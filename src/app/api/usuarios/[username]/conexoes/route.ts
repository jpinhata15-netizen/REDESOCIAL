import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/usuarios/[username]/conexoes?tipo=seguidores|seguindo
export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo") || "seguidores";

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true, isPrivate: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const currentUser = await getCurrentUser();
    const isOwnProfile = currentUser?.id === user.id;

    // Perfil privado: apenas o próprio usuário vê
    if (user.isPrivate && !isOwnProfile) {
      return NextResponse.json({ users: [], restricted: true });
    }

    if (tipo === "seguidores") {
      // Quem segue este usuário
      const follows = await prisma.follow.findMany({
        where: { followingId: user.id },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
              bio: true,
              isVerified: true,
              _count: { select: { followers: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      return NextResponse.json({
        users: follows.map((f) => f.follower),
        tipo: "seguidores",
      });
    } else {
      // Quem este usuário segue
      const follows = await prisma.follow.findMany({
        where: { followerId: user.id },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
              bio: true,
              isVerified: true,
              _count: { select: { followers: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      return NextResponse.json({
        users: follows.map((f) => f.following),
        tipo: "seguindo",
      });
    }
  } catch (error) {
    console.error("Erro ao carregar conexões:", error);
    return NextResponse.json({ error: "Erro ao carregar conexões." }, { status: 500 });
  }
}
