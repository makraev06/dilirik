import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([]);
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: userId,
      },
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
