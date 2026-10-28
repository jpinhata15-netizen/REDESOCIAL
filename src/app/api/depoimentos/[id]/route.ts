import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        recipient: { select: { id: true, name: true } },
        author: { select: { id: true, name: true } },
      },
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Depoimento não encontrado." }, { status: 404 });
    }

    const body = await req.json();
    const { action } = body; // "ACCEPT" | "REJECT" | "DELETE"

    // Validação estrita de autorização
    if (action === "ACCEPT" || action === "REJECT") {
      // APENAS o destinatário pode aceitar ou recusar
      if (testimonial.recipientId !== currentUser.id) {
        return NextResponse.json(
          { error: "Apenas o destinatário tem autorização para aceitar ou recusar este depoimento." },
          { status: 403 }
        );
      }

      const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

      const updated = await prisma.testimonial.update({
        where: { id },
        data: {
          status: newStatus,
          reviewedAt: new Date(),
        },
      });

      // Se foi aceito, notificar o autor
      if (action === "ACCEPT") {
        await prisma.notification.create({
          data: {
            userId: testimonial.authorId,
            actorId: currentUser.id,
            type: "TESTIMONIAL",
            title: "Depoimento Aceito! 🎉",
            message: `${currentUser.name} aceitou seu depoimento e agora ele é exibido publicamente no perfil!`,
            link: `/perfil/${testimonial.recipient.name}`,
          },
        });
      }

      return NextResponse.json({
        message: action === "ACCEPT" ? "Depoimento aceito e publicado!" : "Depoimento recusado.",
        testimonial: updated,
      });
    }

    if (action === "DELETE") {
      // Tanto o autor quanto o destinatário podem remover
      if (testimonial.recipientId !== currentUser.id && testimonial.authorId !== currentUser.id) {
        return NextResponse.json({ error: "Permissão negada." }, { status: 403 });
      }

      await prisma.testimonial.update({
        where: { id },
        data: { status: "DELETED" },
      });

      return NextResponse.json({ message: "Depoimento removido." });
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  } catch (error) {
    console.error("Erro ao gerenciar depoimento:", error);
    return NextResponse.json({ error: "Erro ao processar ação." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return NextResponse.json({ error: "Depoimento não encontrado." }, { status: 404 });
    }

    if (testimonial.recipientId !== currentUser.id && testimonial.authorId !== currentUser.id) {
      return NextResponse.json({ error: "Permissão negada." }, { status: 403 });
    }

    await prisma.testimonial.delete({ where: { id } });

    return NextResponse.json({ message: "Depoimento excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir depoimento:", error);
    return NextResponse.json({ error: "Erro ao excluir depoimento." }, { status: 500 });
  }
}
