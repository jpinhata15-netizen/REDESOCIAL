import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    // Buscar usuários cadastrados no sistema
    const users = await prisma.user.findMany({
      where: currentUser
        ? {
            id: { not: currentUser.id },
          }
        : {},
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        role: true,
        updatedAt: true,
      },
      take: 15,
      orderBy: { updatedAt: "desc" },
    });

    // Simulação e enriquecimento de status de atividade
    // Se o usuário atualizou perfil recentemente ou para os usuários ativos da rede
    const onlineUsers = users.map((u, index) => ({
      ...u,
      status: index < 5 ? "online" : "ausente",
      lastActive: "Agora mesmo",
    }));

    return NextResponse.json({
      totalOnline: onlineUsers.filter((u) => u.status === "online").length,
      users: onlineUsers,
    });
  } catch (error) {
    console.error("Erro ao listar usuários online:", error);
    return NextResponse.json({ error: "Erro ao buscar usuários online." }, { status: 500 });
  }
}
