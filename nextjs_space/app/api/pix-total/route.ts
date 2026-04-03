import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const participants = await prisma.participant.findMany({
      where: {
        pixValue: {
          not: null
        }
      }
    });

    const total = participants.reduce((sum, p) => {
      return sum + (p?.pixValue ?? 0);
    }, 0);

    return NextResponse.json({
      total,
      totalFormatted: `R$ ${(total / 100).toFixed(2)}`
    });
  } catch (error) {
    console.error("Error calculating PIX total:", error);
    return NextResponse.json(
      { error: "Erro ao calcular total" },
      { status: 500 }
    );
  }
}
