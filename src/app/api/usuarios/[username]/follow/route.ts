import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Faça login para seguir outros usuários." }, { status: 401 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    if (targetUser.id === currentUser.id) {
      return NextResponse.json({ error: "Você não pode seguir a si mesmo." }, { status: 400 });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUser.id,
        },
      },
    });

    let isFollowing = false;

    if (existingFollow) {
      await prisma.follow.delete({ where: { id: existingFollow.id } });
      isFollowing = false;
    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: targetUser.id,
        },
      });
      isFollowing = true;

      // Disparar notificação de novo seguidor
      await prisma.notification.create({
        data: {
          userId: targetUser.id,
          actorId: currentUser.id,
          type: "FOLLOW",
          title: "Novo seguidor",
          message: `${currentUser.name} começou a seguir você na Conecta!`,
          link: `/perfil/${currentUser.username}`,
        },
      });
    }

    const followersCount = await prisma.follow.count({
      where: { followingId: targetUser.id },
    });

    return NextResponse.json({ isFollowing, followersCount });
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);
    return NextResponse.json({ error: "Erro ao atualizar relacionamento." }, { status: 500 });
  }
}
