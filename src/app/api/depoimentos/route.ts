import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "received"; // received | sent

    if (filter === "sent") {
      const sent = await prisma.testimonial.findMany({
        where: { authorId: currentUser.id },
        orderBy: { createdAt: "desc" },
        include: {
          recipient: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });
      return NextResponse.json({ testimonials: sent });
    }

    // Recebidos (área privada do destinatário com pendentes e aceitos)
    const received = await prisma.testimonial.findMany({
      where: {
        recipientId: currentUser.id,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({ testimonials: received });
  } catch (error) {
    console.error("Erro ao listar depoimentos:", error);
    return NextResponse.json({ error: "Erro ao carregar depoimentos." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Faça login para enviar um depoimento." }, { status: 401 });
    }

    const body = await req.json();
    const { recipientId, content, isAnonymous } = body;

    if (!recipientId || !content || !content.trim()) {
      return NextResponse.json({ error: "O destinatário e o conteúdo são obrigatórios." }, { status: 400 });
    }

    // Regra obrigatória: não pode enviar para si mesmo
    if (recipientId === currentUser.id) {
      return NextResponse.json(
        { error: "Você não pode enviar um depoimento para o seu próprio perfil." },
        { status: 400 }
      );
    }

    // Limite de 1.000 caracteres
    const cleanContent = content.trim();
    if (cleanContent.length > 1000) {
      return NextResponse.json(
        { error: "O depoimento deve ter no máximo 1.000 caracteres." },
        { status: 400 }
      );
    }

    // Verificar se destinatário existe
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true, name: true, username: true },
    });

    if (!recipient) {
      return NextResponse.json({ error: "Destinatário não encontrado." }, { status: 404 });
    }

    // Criar depoimento com status PENDING
    const testimonial = await prisma.testimonial.create({
      data: {
        authorId: currentUser.id,
        recipientId,
        content: cleanContent,
        status: "PENDING",
        isAnonymous: Boolean(isAnonymous),
      },
    });

    // Criar notificação para o destinatário
    await prisma.notification.create({
      data: {
        userId: recipientId,
        actorId: currentUser.id,
        type: "TESTIMONIAL",
        title: "Novo depoimento recebido! 💌",
        message: `${currentUser.name} escreveu um depoimento para você. Revise para aprovar ou recusar.`,
        link: "/depoimentos",
      },
    });

    return NextResponse.json(
      {
        message: "Depoimento enviado com sucesso! Ele ficará pendente até a aprovação do destinatário.",
        testimonial,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao enviar depoimento:", error);
    return NextResponse.json({ error: "Erro ao enviar depoimento." }, { status: 500 });
  }
}
