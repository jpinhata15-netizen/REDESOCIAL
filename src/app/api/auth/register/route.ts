import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, name, password, termsAccepted } = body;

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar." },
        { status: 400 }
      );
    }

    if (!username || !email || !name || !password) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    // Normalização e validações
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return NextResponse.json(
        { error: "O nome de usuário deve ter entre 3 e 30 caracteres alfanuméricos." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    // Verificar duplicidades
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: cleanUsername }, { email: cleanEmail }],
      },
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return NextResponse.json(
          { error: "Este nome de usuário já está em uso. Por favor, escolha outro." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado na Conecta." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        name: name.trim(),
        passwordHash,
        avatarUrl: defaultAvatar,
        role: "USER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
      },
    });

    // Criar notificação de boas-vindas
    await prisma.notification.create({
      data: {
        userId: newUser.id,
        type: "WELCOME",
        title: "Bem-vindo(a) à Conecta! 🇧🇷",
        message: "Estamos felizes em ter você aqui. Complete seu perfil e explore as comunidades!",
        link: "/configuracoes",
      },
    });

    const token = signSessionToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        message: "Cadastro realizado com sucesso!",
        user: newUser,
      },
      { status: 201 }
    );

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 dias
    });

    return response;
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno ao processar seu cadastro. Tente novamente." },
      { status: 500 }
    );
  }
}
