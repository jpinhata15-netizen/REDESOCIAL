import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
      take: 40,
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: currentUser.id, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Erro ao carregar notificações:", error);
    return NextResponse.json({ error: "Erro ao carregar notificações." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: currentUser.id, read: false },
        data: { read: true },
      });
      return NextResponse.json({ message: "Todas as notificações foram marcadas como lidas." });
    }

    if (notificationId) {
      await prisma.notification.updateMany({
        where: { id: notificationId, userId: currentUser.id },
        data: { read: true },
      });
      return NextResponse.json({ message: "Notificação marcada como lida." });
    }

    return NextResponse.json({ error: "Dados insuficientes." }, { status: 400 });
  } catch (error) {
    console.error("Erro ao atualizar notificações:", error);
    return NextResponse.json({ error: "Erro ao atualizar notificações." }, { status: 500 });
  }
}
