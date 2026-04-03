import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const participants = await prisma.participant.findMany({
      where: {
        itemName: {
          not: null
        }
      },
      select: {
        itemName: true
      }
    });

    const chosenItems = participants.map(p => p?.itemName).filter(Boolean) as string[];

    return NextResponse.json({ chosenItems });
  } catch (error) {
    console.error("Error fetching chosen items:", error);
    return NextResponse.json(
      { error: "Erro ao buscar itens escolhidos" },
      { status: 500 }
    );
  }
}
