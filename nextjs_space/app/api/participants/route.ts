import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Erro ao buscar participantes" },
      { status: 500 }
    );
  }
}
