import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Obter também contagem de notificações não lidas e depoimentos pendentes
    const [unreadNotifications, pendingTestimonials] = await Promise.all([
      prisma.notification.count({
        where: { userId: user.id, read: false },
      }),
      prisma.testimonial.count({
        where: { recipientId: user.id, status: "PENDING" },
      }),
    ]);

    return NextResponse.json({
      user: {
        ...user,
        unreadNotifications,
        pendingTestimonials,
      },
    });
  } catch (error) {
    console.error("Erro na rota /api/auth/me:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
