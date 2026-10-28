import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    const post = await prisma.post.findUnique({
      where: { id },
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
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            savedBy: true,
          },
        },
        likes: currentUser
          ? {
              where: { userId: currentUser.id },
              select: { id: true },
            }
          : false,
        savedBy: currentUser
          ? {
              where: { userId: currentUser.id },
              select: { id: true },
            }
          : false,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
    }

    return NextResponse.json({
      post: {
        ...post,
        mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : [],
        isLiked: currentUser ? post.likes && post.likes.length > 0 : false,
        isSaved: currentUser ? post.savedBy && post.savedBy.length > 0 : false,
      },
    });
  } catch (error) {
    console.error("Erro ao obter publicação:", error);
    return NextResponse.json({ error: "Erro ao carregar a publicação." }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
    }

    // Apenas o autor pode editar
    if (post.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Você não tem permissão para editar esta publicação." }, { status: 403 });
    }

    const body = await req.json();
    const { content, audience } = body;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        content: content?.trim() || post.content,
        audience: audience || post.audience,
      },
    });

    return NextResponse.json({ message: "Publicação atualizada com sucesso!", post: updated });
  } catch (error) {
    console.error("Erro ao editar publicação:", error);
    return NextResponse.json({ error: "Erro ao atualizar a publicação." }, { status: 500 });
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

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
    }

    // Apenas o autor ou admin pode excluir
    if (post.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Você não tem permissão para excluir esta publicação." }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Publicação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir publicação:", error);
    return NextResponse.json({ error: "Erro ao excluir publicação." }, { status: 500 });
  }
}
