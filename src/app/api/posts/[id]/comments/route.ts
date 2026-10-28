import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Comentários de primeiro nível
      },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
                isVerified: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Erro ao listar comentários:", error);
    return NextResponse.json({ error: "Erro ao carregar comentários." }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Faça login para comentar." }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
    }

    const body = await req.json();
    const { content, parentId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "O comentário não pode ser vazio." }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        postId,
        userId: currentUser.id,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        user: {
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

    // Notificar autor da publicação (se não for o próprio comentador)
    if (post.userId !== currentUser.id) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          actorId: currentUser.id,
          type: "COMMENT",
          title: "Novo comentário",
          message: `${currentUser.name} comentou: "${content.trim().slice(0, 50)}..."`,
          link: `/post/${postId}`,
        },
      });
    }

    return NextResponse.json({ message: "Comentário publicado!", comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json({ error: "Erro ao publicar comentário." }, { status: 500 });
  }
}
