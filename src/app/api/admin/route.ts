import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso restrito a administradores da Conecta." },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalPosts,
      totalCommunities,
      totalTestimonials,
      pendingReportsCount,
      reports,
      users,
      auditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.community.count(),
      prisma.testimonial.count({ where: { status: "ACCEPTED" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.report.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
          reporter: {
            select: { id: true, username: true, name: true },
          },
        },
      }),
      prisma.user.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { posts: true, followers: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalPosts,
        totalCommunities,
        totalTestimonials,
        pendingReportsCount,
      },
      reports,
      users,
      auditLogs,
    });
  } catch (error) {
    console.error("Erro no painel administrativo:", error);
    return NextResponse.json({ error: "Erro interno no painel admin." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // Ação 1: Qualquer usuário pode denunciar um conteúdo impróprio
    if (action === "REPORT") {
      const { targetType, targetId, reason } = body;
      if (!targetType || !targetId || !reason) {
        return NextResponse.json({ error: "Dados da denúncia incompletos." }, { status: 400 });
      }

      const report = await prisma.report.create({
        data: {
          reporterId: currentUser.id,
          targetType,
          targetId,
          reason: reason.trim(),
        },
      });

      return NextResponse.json(
        { message: "Denúncia registrada com sucesso. Nossa equipe irá analisar.", report },
        { status: 201 }
      );
    }

    // Ação 2: Ações de moderação administrativa (Requer ADMIN)
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
    }

    if (action === "RESOLVE_REPORT") {
      const { reportId, resolutionNotes, status } = body;
      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: status || "RESOLVED",
          resolutionNotes: resolutionNotes || "Análise concluída pelo moderador.",
        },
      });

      await prisma.auditLog.create({
        data: {
          adminId: currentUser.id,
          action: "RESOLVE_REPORT",
          details: `Denúncia ${reportId} resolvida com status ${status || "RESOLVED"}`,
        },
      });

      return NextResponse.json({ message: "Denúncia moderada com sucesso." });
    }

    if (action === "DELETE_POST_ADMIN") {
      const { postId } = body;
      await prisma.post.delete({ where: { id: postId } });

      await prisma.auditLog.create({
        data: {
          adminId: currentUser.id,
          action: "DELETE_POST",
          details: `Post ${postId} removido por moderação administrativa`,
        },
      });

      return NextResponse.json({ message: "Publicação removida administrativamente." });
    }

    return NextResponse.json({ error: "Ação não reconhecida." }, { status: 400 });
  } catch (error) {
    console.error("Erro na ação administrativa:", error);
    return NextResponse.json({ error: "Erro ao processar ação." }, { status: 500 });
  }
}
