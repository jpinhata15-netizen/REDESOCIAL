import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Faça login para curtir esta publicação." }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
    }

    // Verificar se já curtiu
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: currentUser.id,
        },
      },
    });

    let isLiked = false;

    if (existingLike) {
      // Remover curtida
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      // Adicionar curtida
      await prisma.like.create({
        data: {
          postId,
          userId: currentUser.id,
        },
      });
      isLiked = true;

      // Criar notificação para o autor do post caso não seja ele mesmo
      if (post.userId !== currentUser.id) {
        await prisma.notification.create({
          data: {
            userId: post.userId,
            actorId: currentUser.id,
            type: "LIKE",
            title: "Nova curtida",
            message: `${currentUser.name} curtiu sua publicação.`,
            link: `/post/${postId}`,
          },
        });
      }
    }

    const likesCount = await prisma.like.count({ where: { postId } });

    return NextResponse.json({ isLiked, likesCount });
  } catch (error) {
    console.error("Erro ao curtir publicação:", error);
    return NextResponse.json({ error: "Erro ao processar curtida." }, { status: 500 });
  }
}
