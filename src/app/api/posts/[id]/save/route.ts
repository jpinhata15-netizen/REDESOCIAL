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
      return NextResponse.json({ error: "Faça login para salvar publicações." }, { status: 401 });
    }

    const existingSave = await prisma.savedPost.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: currentUser.id,
        },
      },
    });

    let isSaved = false;

    if (existingSave) {
      await prisma.savedPost.delete({ where: { id: existingSave.id } });
      isSaved = false;
    } else {
      await prisma.savedPost.create({
        data: {
          postId,
          userId: currentUser.id,
        },
      });
      isSaved = true;
    }

    return NextResponse.json({ isSaved });
  } catch (error) {
    console.error("Erro ao salvar publicação:", error);
    return NextResponse.json({ error: "Erro ao atualizar favoritos." }, { status: 500 });
  }
}
