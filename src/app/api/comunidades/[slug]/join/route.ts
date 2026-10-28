import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Faça login para participar de comunidades." }, { status: 401 });
    }

    const community = await prisma.community.findUnique({
      where: { slug },
      select: { id: true, isPrivate: true, ownerId: true, name: true },
    });

    if (!community) {
      return NextResponse.json({ error: "Comunidade não encontrada." }, { status: 404 });
    }

    // Verificar se já é membro
    const existingMember = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId: community.id,
          userId: currentUser.id,
        },
      },
    });

    if (existingMember) {
      // Dono não pode sair da sua própria comunidade sem transferir a posse
      if (existingMember.role === "OWNER") {
        return NextResponse.json(
          { error: "O proprietário não pode sair da comunidade." },
          { status: 400 }
        );
      }

      // Sair da comunidade
      await prisma.communityMember.delete({
        where: { id: existingMember.id },
      });

      return NextResponse.json({ action: "LEFT", message: "Você saiu da comunidade." });
    }

    // Se a comunidade for privada, criar solicitação de entrada
    if (community.isPrivate) {
      const existingReq = await prisma.communityJoinRequest.findUnique({
        where: {
          communityId_userId: {
            communityId: community.id,
            userId: currentUser.id,
          },
        },
      });

      if (existingReq) {
        if (existingReq.status === "PENDING") {
          // Cancelar solicitação
          await prisma.communityJoinRequest.delete({ where: { id: existingReq.id } });
          return NextResponse.json({ action: "CANCELLED", message: "Solicitação de entrada cancelada." });
        }
      }

      await prisma.communityJoinRequest.create({
        data: {
          communityId: community.id,
          userId: currentUser.id,
          status: "PENDING",
        },
      });

      // Notificar dono da comunidade
      await prisma.notification.create({
        data: {
          userId: community.ownerId,
          actorId: currentUser.id,
          type: "COMMUNITY",
          title: "Solicitação de entrada na comunidade",
          message: `${currentUser.name} solicitou entrada na comunidade "${community.name}".`,
          link: `/comunidades/${slug}`,
        },
      });

      return NextResponse.json({
        action: "REQUESTED",
        message: "Solicitação enviada aos moderadores da comunidade.",
      });
    }

    // Comunidade pública: entrada imediata
    await prisma.communityMember.create({
      data: {
        communityId: community.id,
        userId: currentUser.id,
        role: "MEMBER",
      },
    });

    return NextResponse.json({ action: "JOINED", message: "Você entrou na comunidade!" });
  } catch (error) {
    console.error("Erro ao gerenciar participação na comunidade:", error);
    return NextResponse.json({ error: "Erro ao processar solicitação." }, { status: 500 });
  }
}
