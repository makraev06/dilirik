import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import { getGeminiModel } from "@/lib/gemini";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("cv");

    // Menangkap input posisi pekerjaan dan userId dari frontend (jika ada)
    const jobPosition = (formData.get("jobPosition") as string) || "";
    const userId = (formData.get("userId") as string) || null;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File harus berupa PDF" },
        { status: 400 },
      );
    }

    // 1. Ekstraksi Text menggunakan unpdf
    const buffer = await file.arrayBuffer();
    const pdfResult = await extractText(new Uint8Array(buffer));
    const text = String(pdfResult.text ?? "").trim();

    if (!text) {
      return NextResponse.json(
        { error: "Isi PDF tidak dapat dibaca" },
        { status: 400 },
      );
    }

    console.log("CV LENGTH:", text.length);

    // 2. Setup Gemini AI dan Prompt
    const model = getGeminiModel();

    // Menyertakan jobPosition dan tanggal saat ini ke prompt jika user menentukannya agar analisis relevan
    const currentDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const prompt = `
Kamu adalah ATS CV Analyzer. Hari ini adalah tanggal ${currentDate}. JANGAN menganggap tahun sebelum atau sama dengan ${new Date().getFullYear()} sebagai tahun di masa depan.
${jobPosition ? `Analisis CV ini secara spesifik untuk posisi pekerjaan: "${jobPosition}".` : "Analisis CV ini secara umum."}
PENTING: Kamu WAJIB mengisi bagian "details" (nama, email, experience, education, skills) dari informasi kandidat di dalam CV, apa pun kondisinya. Jangan biarkan null atau kosong.

Balas HANYA JSON valid dengan format:

{
  "score": 0,
  "kelebihan": [],
  "kekurangan": [],
  "saran": [],
  "details": {
    "name": "",
    "email": "",
    "experience": [{"role": "", "company": "", "duration": "", "skills": []}],
    "education": [{"degree": "", "institution": ""}],
    "skills": []
  }
}

CV TEXT:
${text.slice(0, 12000)}
`;

    // 3. Request ke Gemini API (dengan mekanisme Retry)
    let content = "";
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        content = response.text();
        break; // Jika berhasil, keluar dari loop
      } catch (apiError: any) {
        attempts++;
        console.warn(`Gemini API Error (Percobaan ${attempts}):`, apiError.message);
        
        if (attempts >= maxAttempts) {
          throw apiError; // Lemparkan error jika sudah maksimal percobaan
        }
        
        // Tunggu 2 detik sebelum mencoba lagi jika gagal (misal karena 503/high demand)
        await new Promise((res) => setTimeout(res, 2000));
      }
    }

    console.log("GEMINI RESPONSE SUKSES");

    // 4. Parsing response JSON
    let cleanedContent = content;
    
    // Cari blok JSON jika dibungkus markdown ```json ... ```
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[1];
    } else {
      // Jika tidak ada markdown, cari kurawal pembuka dan penutup pertama dan terakhir
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedContent = content.slice(firstBrace, lastBrace + 1);
      }
    }
    
    const analysis = JSON.parse(cleanedContent);

    // 5. Simpan ke Database via Prisma menggunakan model Resume yang baru
    const savedResume = await prisma.resume.create({
      data: {
        userId: userId,
        fileName: file.name,
        content: text, // Menyimpan raw text sesuai requirement schema baru Anda
        jobPosition: jobPosition || null,
        score: analysis.score ?? 0,
        kelebihan: analysis.kelebihan ?? [],
        kekurangan: analysis.kekurangan ?? [],
        saran: analysis.saran ?? [],
        details: analysis.details || null,
      },
    });

    // 6. Return ke Frontend dengan mencantumkan ID dari model Resume
    return NextResponse.json({
      id: savedResume.id,
      fileName: savedResume.fileName,
      jobPosition: savedResume.jobPosition,
      score: savedResume.score,
      kelebihan: savedResume.kelebihan,
      kekurangan: savedResume.kekurangan,
      saran: savedResume.saran,
      details: savedResume.details,
      createdAt: savedResume.createdAt,
    });
  } catch (error) {
    console.error("ANALYZE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan server",
      },
      { status: 500 },
    );
  }
}
