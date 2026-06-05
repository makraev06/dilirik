import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fileName: true,
        jobPosition: true,
        score: true,
        kelebihan: true,
        kekurangan: true,
        saran: true,
        details: true,
        createdAt: true,
      },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("HISTORY ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil riwayat CV" },
      { status: 500 }
    );
  }
}
