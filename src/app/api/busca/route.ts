import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const type = searchParams.get("tipo") || "todos"; // todos | pessoas | comunidades | posts

    if (!query) {
      return NextResponse.json({
        users: [],
        communities: [],
        posts: [],
      });
    }

    const currentUser = await getCurrentUser();

    // 1. Pessoas
    let users: any[] = [];
    if (type === "todos" || type === "pessoas") {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { username: { contains: query.replace("@", "") } },
            { bio: { contains: query } },
            { location: { contains: query } },
          ],
        },
        take: 10,
        select: {
          id: true,
          username: true,
          name: true,
          bio: true,
          avatarUrl: true,
          location: true,
          isVerified: true,
          _count: { select: { followers: true } },
        },
      });
    }

    // 2. Comunidades
    let communities: any[] = [];
    if (type === "todos" || type === "comunidades") {
      communities = await prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 10,
        include: {
          _count: { select: { members: true } },
        },
      });
    }

    // 3. Publicações (apenas públicas)
    let posts: any[] = [];
    if (type === "todos" || type === "posts") {
      const dbPosts = await prisma.post.findMany({
        where: {
          content: { contains: query },
          audience: "PUBLIC",
        },
        take: 15,
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
      users,
      communities,
      posts,
      totalCount: users.length + communities.length + posts.length,
    });
  } catch (error) {
    console.error("Erro na busca global:", error);
    return NextResponse.json({ error: "Erro ao executar a busca." }, { status: 500 });
  }
}
