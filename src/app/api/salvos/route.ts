import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const savedPosts = await prisma.savedPost.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
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
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
                savedBy: true,
              },
            },
          },
        },
      },
    });

    const formatted = savedPosts.map((sp) => ({
      ...sp.post,
      mediaUrls: sp.post.mediaUrls ? JSON.parse(sp.post.mediaUrls) : [],
      isLiked: false,
      isSaved: true,
    }));

    return NextResponse.json({ posts: formatted });
  } catch (error) {
    console.error("Erro ao listar favoritos:", error);
    return NextResponse.json({ error: "Erro ao carregar itens salvos." }, { status: 500 });
  }
}
