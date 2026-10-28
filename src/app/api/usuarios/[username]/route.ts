import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const cleanUsername = username.toLowerCase();
    const currentUser = await getCurrentUser();

    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        location: true,
        website: true,
        role: true,
        isVerified: true,
        isPrivate: true,
        interests: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            receivedTestimonials: {
              where: { status: "ACCEPTED" }, // Apenas aceitos contam publicamente!
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // Verificar se o usuário atual segue este perfil
    let isFollowing = false;
    let friendshipStatus: string | null = null;

    if (currentUser && currentUser.id !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: user.id,
          },
        },
      });
      isFollowing = Boolean(follow);

      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { requesterId: currentUser.id, addresseeId: user.id },
            { requesterId: user.id, addresseeId: currentUser.id },
          ],
        },
      });
      friendshipStatus = friendship?.status || null;
    }

    // Depoimentos PÚBLICOS do perfil: RIGOROSAMENTE apenas os com status ACCEPTED!
    const testimonials = await prisma.testimonial.findMany({
      where: {
        recipientId: user.id,
        status: "ACCEPTED",
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

    // Publicações do usuário
    const posts = await prisma.post.findMany({
      where: {
        userId: user.id,
        communityId: null, // Posts principais do feed pessoal
      },
      orderBy: { createdAt: "desc" },
      take: 20,
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
      },
    });

    return NextResponse.json({
      user,
      isFollowing,
      friendshipStatus,
      testimonials,
      posts: posts.map((p) => ({
        ...p,
        mediaUrls: p.mediaUrls ? JSON.parse(p.mediaUrls) : [],
      })),
    });
  } catch (error) {
    console.error("Erro ao obter perfil de usuário:", error);
    return NextResponse.json({ error: "Erro ao carregar o perfil." }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    // Apenas o próprio usuário pode editar seu perfil
    if (currentUser.username !== username.toLowerCase() && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Você só tem autorização para editar seu próprio perfil." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, bio, location, website, avatarUrl, coverUrl, interests, isPrivate } = body;

    const updatedUser = await prisma.user.update({
      where: { username: username.toLowerCase() },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        bio: bio !== undefined ? bio.trim() : undefined,
        location: location !== undefined ? location.trim() : undefined,
        website: website !== undefined ? website.trim() : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
        coverUrl: coverUrl !== undefined ? coverUrl : undefined,
        interests: interests !== undefined ? interests.trim() : undefined,
        isPrivate: isPrivate !== undefined ? Boolean(isPrivate) : undefined,
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        location: true,
        website: true,
        interests: true,
        isPrivate: true,
      },
    });

    return NextResponse.json({
      message: "Perfil atualizado com sucesso!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json({ error: "Erro ao salvar alterações no perfil." }, { status: 500 });
  }
}
