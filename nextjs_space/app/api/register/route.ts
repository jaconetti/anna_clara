import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, whatsapp, estimatedBirthDate, itemName, pixValue, receiptPath } = body;

    if (!name?.trim() || !whatsapp?.trim()) {
      return NextResponse.json(
        { error: "Nome e WhatsApp são obrigatórios" },
        { status: 400 }
      );
    }

    if (!estimatedBirthDate) {
      return NextResponse.json(
        { error: "Data do palpite é obrigatória" },
        { status: 400 }
      );
    }

    if (!itemName && !pixValue) {
      return NextResponse.json(
        { error: "Escolha um item ou um valor de PIX" },
        { status: 400 }
      );
    }

    if (pixValue && !receiptPath) {
      return NextResponse.json(
        { error: "Comprovante PIX é obrigatório" },
        { status: 400 }
      );
    }

    const participant = await prisma.participant.create({
      data: {
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        estimatedBirthDate: new Date(estimatedBirthDate),
        itemName: itemName ?? null,
        pixValue: pixValue ?? null,
        receiptPath: receiptPath ?? null
      }
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erro ao registrar participante" },
      { status: 500 }
    );
  }
}
