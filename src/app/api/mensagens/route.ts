import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const withUserId = searchParams.get("with");

    if (withUserId) {
      // Marcar mensagens recebidas como lidas
      await prisma.message.updateMany({
        where: {
          senderId: withUserId,
          receiverId: currentUser.id,
          read: false,
        },
        data: { read: true },
      });

      // Buscar histórico entre os dois usuários
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUser.id, receiverId: withUserId },
            { senderId: withUserId, receiverId: currentUser.id },
          ],
        },
        orderBy: { createdAt: "asc" },
      });

      const partner = await prisma.user.findUnique({
        where: { id: withUserId },
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      });

      return NextResponse.json({ messages, partner });
    }

    // Se não informou interlocutor, listar todas as conversas do usuário
    const allUserMessages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: { id: true, username: true, name: true, avatarUrl: true },
        },
        receiver: {
          select: { id: true, username: true, name: true, avatarUrl: true },
        },
      },
    });

    // Agrupar por parceiro de conversa
    const conversationMap = new Map();
    for (const msg of allUserMessages) {
      const partner = msg.senderId === currentUser.id ? msg.receiver : msg.sender;
      if (!conversationMap.has(partner.id)) {
        conversationMap.set(partner.id, {
          partner,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      if (msg.receiverId === currentUser.id && !msg.read) {
        const item = conversationMap.get(partner.id);
        item.unreadCount += 1;
      }
    }

    const conversations = Array.from(conversationMap.values());
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Erro ao carregar mensagens:", error);
    return NextResponse.json({ error: "Erro ao carregar mensagens." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "Destinatário e conteúdo da mensagem são obrigatórios." },
        { status: 400 }
      );
    }

    if (receiverId === currentUser.id) {
      return NextResponse.json(
        { error: "Você não pode enviar mensagem para si mesmo." },
        { status: 400 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: currentUser.id,
        receiverId,
        content: content.trim(),
      },
    });

    return NextResponse.json(
      { message: "Mensagem enviada!", messageData: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json({ error: "Erro ao enviar mensagem." }, { status: 500 });
  }
}
