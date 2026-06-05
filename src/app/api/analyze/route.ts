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

    // Menyertakan jobPosition ke prompt jika user menentukannya agar analisis relevan
    const prompt = `
Kamu adalah ATS CV Analyzer.
${jobPosition ? `Analisis CV ini secara spesifik untuk posisi pekerjaan: "${jobPosition}".` : "Analisis CV ini secara umum."}

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

    // 3. Request ke Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    console.log("GEMINI RESPONSE SUKSES");

    // 4. Parsing response JSON
    const analysis = JSON.parse(content);

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
