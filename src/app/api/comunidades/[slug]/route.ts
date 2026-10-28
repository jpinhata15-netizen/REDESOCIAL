import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const currentUser = await getCurrentUser();

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        members: {
          take: 12,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json({ error: "Comunidade não encontrada." }, { status: 404 });
    }

    // Checar relação do usuário atual
    let membership = null;
    let hasRequested = false;

    if (currentUser) {
      membership = await prisma.communityMember.findUnique({
        where: {
          communityId_userId: {
            communityId: community.id,
            userId: currentUser.id,
          },
        },
      });

      if (!membership && community.isPrivate) {
        const reqItem = await prisma.communityJoinRequest.findUnique({
          where: {
            communityId_userId: {
              communityId: community.id,
              userId: currentUser.id,
            },
          },
        });
        hasRequested = reqItem?.status === "PENDING";
      }
    }

    // Regra de segurança para comunidades privadas: se privada e não for membro, não expor posts!
    const canViewContent = !community.isPrivate || Boolean(membership);

    let posts: any[] = [];
    if (canViewContent) {
      const dbPosts = await prisma.post.findMany({
        where: { communityId: community.id },
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

      posts = dbPosts.map((p) => ({
        ...p,
        mediaUrls: p.mediaUrls ? JSON.parse(p.mediaUrls) : [],
        isLiked: currentUser ? p.likes && p.likes.length > 0 : false,
        isSaved: currentUser ? p.savedBy && p.savedBy.length > 0 : false,
      }));
    }

    return NextResponse.json({
      community,
      userRole: membership?.role || null,
      hasRequested,
      canViewContent,
      posts,
    });
  } catch (error) {
    console.error("Erro ao obter comunidade:", error);
    return NextResponse.json({ error: "Erro ao carregar comunidade." }, { status: 500 });
  }
}
