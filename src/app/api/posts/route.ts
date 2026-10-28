import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "para-voce";
    const communityId = searchParams.get("communityId");
    const username = searchParams.get("username");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    const currentUser = await getCurrentUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (communityId) {
      whereClause.communityId = communityId;
    } else if (username) {
      whereClause.user = { username };
    } else if (tab === "seguindo" && currentUser) {
      // Obter IDs das pessoas seguidas
      const follows = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      });
      const followingIds = follows.map((f) => f.followingId);
      whereClause.userId = { in: [...followingIds, currentUser.id] };
    } else {
      // Para você / Recentes: posts públicos ou de comunidades públicas
      whereClause.OR = [
        { audience: "PUBLIC" },
        currentUser ? { userId: currentUser.id } : {},
      ].filter(Boolean);
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      take: limit,
      orderBy: { createdAt: "desc" },
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

    // Formatar posts com booleanos amigáveis para o frontend
    const formatted = posts.map((post) => ({
      ...post,
      mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : [],
      isLiked: currentUser ? post.likes && post.likes.length > 0 : false,
      isSaved: currentUser ? post.savedBy && post.savedBy.length > 0 : false,
      likes: undefined,
      savedBy: undefined,
    }));

    return NextResponse.json({ posts: formatted });
  } catch (error) {
    console.error("Erro ao listar publicações:", error);
    return NextResponse.json({ error: "Erro ao carregar o feed." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Você precisa estar conectado para publicar." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { content, mediaUrls, videoUrl, audience, communityId } = body;

    if (!content && (!mediaUrls || mediaUrls.length === 0) && !videoUrl) {
      return NextResponse.json(
        { error: "A publicação deve conter ao menos um texto ou mídia." },
        { status: 400 }
      );
    }

    // Se estiver publicando dentro de uma comunidade, verificar se é membro
    if (communityId) {
      const membership = await prisma.communityMember.findUnique({
        where: {
          communityId_userId: {
            communityId,
            userId: currentUser.id,
          },
        },
      });

      if (!membership) {
        return NextResponse.json(
          { error: "Você precisa ser membro desta comunidade para publicar nela." },
          { status: 403 }
        );
      }
    }

    const newPost = await prisma.post.create({
      data: {
        userId: currentUser.id,
        content: content?.trim() || "",
        mediaUrls: mediaUrls ? JSON.stringify(mediaUrls) : null,
        videoUrl: videoUrl?.trim() || null,
        audience: audience || "PUBLIC",
        communityId: communityId || null,
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
      },
    });

    return NextResponse.json(
      {
        message: "Publicação criada com sucesso!",
        post: {
          ...newPost,
          mediaUrls: newPost.mediaUrls ? JSON.parse(newPost.mediaUrls) : [],
          isLiked: false,
          isSaved: false,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar publicação:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao enviar sua publicação." },
      { status: 500 }
    );
  }
}
