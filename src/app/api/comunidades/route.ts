import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("categoria");
    const search = searchParams.get("q");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (category && category !== "Todas") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const communities = await prisma.community.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ communities });
  } catch (error) {
    console.error("Erro ao listar comunidades:", error);
    return NextResponse.json({ error: "Erro ao carregar comunidades." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Faça login para criar uma comunidade." }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, category, rules, isPrivate, avatarUrl, coverUrl } = body;

    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: "Nome, identificador (slug) e descrição são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

    const existing = await prisma.community.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma comunidade com esse identificador. Escolha outro." },
        { status: 409 }
      );
    }

    const community = await prisma.community.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        description: description.trim(),
        category: category || "Geral",
        rules: rules?.trim() || null,
        isPrivate: Boolean(isPrivate),
        avatarUrl: avatarUrl || `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80`,
        coverUrl: coverUrl || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80`,
        ownerId: currentUser.id,
        members: {
          create: {
            userId: currentUser.id,
            role: "OWNER",
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Comunidade criada com sucesso!", community },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar comunidade:", error);
    return NextResponse.json({ error: "Erro ao criar comunidade." }, { status: 500 });
  }
}
