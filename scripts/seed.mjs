import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando povoamento de dados de demonstração do Conecta...");

  // Limpar dados existentes para ambiente limpo
  await prisma.notification.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.communityJoinRequest.deleteMany({});
  await prisma.communityMember.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.savedPost.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.community.deleteMany({});
  await prisma.friendship.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("Conecta@2026", 10);

  // 1. Criar Usuários Brasileiros
  const admin = await prisma.user.create({
    data: {
      username: "conecta",
      email: "contato@conecta.social",
      passwordHash,
      name: "Conecta Oficial",
      bio: "Canal oficial da rede social Conecta. Criada para aproximar pessoas e valorizar as conexões autênticas do Brasil.",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
      location: "Brasil",
      website: "https://conecta.social",
      role: "ADMIN",
      isVerified: true,
      interests: "Comunidade, Tecnologia, Cultura, Conexões",
    },
  });

  const clarice = await prisma.user.create({
    data: {
      username: "clarice",
      email: "clarice@exemplo.com.br",
      passwordHash,
      name: "Clarice Lisboa",
      bio: "Cronista, amante de café e caminhadas matinais pela praia de Ipanema. Escrevo sobre o cotidiano e encontros humanos.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      location: "Rio de Janeiro, RJ",
      website: "https://medium.com/@clarice",
      role: "USER",
      isVerified: true,
      interests: "Literatura, Cinema Brasileiro, Filosofia, Bossa Nova",
    },
  });

  const thiago = await prisma.user.create({
    data: {
      username: "thiago_dev",
      email: "thiago@exemplo.com.br",
      passwordHash,
      name: "Thiago Silva",
      bio: "Desenvolvedor Full Stack apaixonado por TypeScript, arquitetura limpa e café coado. Construindo o futuro da web.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
      location: "São Paulo, SP",
      website: "https://github.com/thiagosilva",
      role: "USER",
      isVerified: false,
      interests: "Programação, Next.js, Open Source, Inteligência Artificial",
    },
  });

  const marina = await prisma.user.create({
    data: {
      username: "marina_foto",
      email: "marina@exemplo.com.br",
      passwordHash,
      name: "Marina Santos",
      bio: "Registrando as cores vivas, a luz e a energia da Bahia. Fotógrafa documental e contadora de histórias.",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80",
      location: "Salvador, BA",
      website: "https://marinasantos.art.br",
      role: "USER",
      isVerified: true,
      interests: "Fotografia, Artes Visuais, Viagens, Música Popular Brasileira",
    },
  });

  const lucas = await prisma.user.create({
    data: {
      username: "lucas_eco",
      email: "lucas@exemplo.com.br",
      passwordHash,
      name: "Lucas Mendes",
      bio: "Arquiteto e urbanista focado em sustentabilidade, ciclovias e cidades para pessoas.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1200&auto=format&fit=crop&q=80",
      location: "Curitiba, PR",
      role: "USER",
      isVerified: false,
      interests: "Urbanismo, Ecologia, Ciclismo, Design",
    },
  });

  console.log("✅ Usuários criados.");

  // 2. Seguidores e Amizades
  await prisma.follow.createMany({
    data: [
      { followerId: clarice.id, followingId: thiago.id },
      { followerId: thiago.id, followingId: clarice.id },
      { followerId: marina.id, followingId: clarice.id },
      { followerId: lucas.id, followingId: thiago.id },
      { followerId: thiago.id, followingId: marina.id },
      { followerId: admin.id, followingId: clarice.id },
    ],
  });

  await prisma.friendship.createMany({
    data: [
      { requesterId: clarice.id, addresseeId: thiago.id, status: "ACCEPTED" },
      { requesterId: marina.id, addresseeId: clarice.id, status: "ACCEPTED" },
      { requesterId: lucas.id, addresseeId: clarice.id, status: "PENDING" },
    ],
  });

  console.log("✅ Relacionamentos de amizade e seguidores estabelecidos.");

  // 3. Comunidades
  const techCom = await prisma.community.create({
    data: {
      name: "Tecnologia Brasil",
      slug: "tech-brasil",
      description: "Espaço para discutir tecnologia, desenvolvimento de software, startups e inovação feita no Brasil.",
      category: "Tecnologia",
      avatarUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
      rules: "1. Respeito mútuo sempre.\n2. Compartilhe conhecimento prático.\n3. Sem spam ou autopromoção não autorizada.",
      isPrivate: false,
      ownerId: thiago.id,
      members: {
        create: [
          { userId: thiago.id, role: "OWNER" },
          { userId: clarice.id, role: "MEMBER" },
          { userId: lucas.id, role: "MEMBER" },
        ],
      },
    },
  });

  const fotoCom = await prisma.community.create({
    data: {
      name: "Fotografia & Olhares",
      slug: "foto-olhares",
      description: "Amantes da fotografia capturando a beleza do território brasileiro: paisagens, pessoas e arquitetura.",
      category: "Artes & Fotografia",
      avatarUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80",
      rules: "1. Dê crédito às fotos autorais.\n2. Críticas construtivas são bem-vindas.",
      isPrivate: false,
      ownerId: marina.id,
      members: {
        create: [
          { userId: marina.id, role: "OWNER" },
          { userId: clarice.id, role: "MODERATOR" },
        ],
      },
    },
  });

  const clubeLivro = await prisma.community.create({
    data: {
      name: "Clube do Livro & Filosofia",
      slug: "clube-do-livro",
      description: "Discussões aprofundadas sobre literatura brasileira, ensaios e clássicos universais. Comunidade privada com curadoria.",
      category: "Cultura & Literatura",
      avatarUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80",
      rules: "1. Apenas membros aprovados pela moderação.\n2. Leituras mensais obrigatórias.",
      isPrivate: true,
      ownerId: clarice.id,
      members: {
        create: [
          { userId: clarice.id, role: "OWNER" },
          { userId: thiago.id, role: "MEMBER" },
        ],
      },
      requests: {
        create: [
          { userId: lucas.id, status: "PENDING" },
        ],
      },
    },
  });

  console.log("✅ Comunidades públicas e privadas criadas.");

  // 4. Publicações no Feed
  const post1 = await prisma.post.create({
    data: {
      userId: clarice.id,
      content: "Hoje acordei cedo para ver o nascer do sol na praia. É incrível como a luz do Rio nos lembra da simplicidade da vida. Que a nossa rede Conecta seja um lugar de respiração e trocas verdadeiras! 🌅✨ #Brasil #RioDeJaneiro #Conecta",
      mediaUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop&q=80",
      ]),
      audience: "PUBLIC",
    },
  });

  const post2 = await prisma.post.create({
    data: {
      userId: thiago.id,
      content: "Acabei de finalizar a arquitetura de autorização da Conecta. Row Level Security, sessões seguras e uma interface que carrega instantaneamente. Nada substitui a sensação de ver um código limpo e robusto ganhando vida! 💻🚀 Quem aí curte Next.js com TypeScript?",
      audience: "PUBLIC",
      communityId: techCom.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      userId: marina.id,
      content: "Uma série de retratos que fiz nas ladeiras do Pelourinho neste último fim de semana. O povo baiano tem um sorriso que ilumina qualquer dia cinzento. 🇧🇷💛",
      mediaUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      ]),
      audience: "PUBLIC",
      communityId: fotoCom.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      userId: lucas.id,
      content: "Pedal matinal de 25km pelas ciclofaixas de Curitiba. Como o planejamento urbano verde transforma a saúde mental de uma cidade. O que acham dos novos projetos de mobilidade ativa?",
      audience: "PUBLIC",
    },
  });

  // 5. Curtidas e Comentários
  await prisma.like.createMany({
    data: [
      { postId: post1.id, userId: thiago.id },
      { postId: post1.id, userId: marina.id },
      { postId: post1.id, userId: lucas.id },
      { postId: post2.id, userId: clarice.id },
      { postId: post2.id, userId: marina.id },
      { postId: post3.id, userId: clarice.id },
      { postId: post3.id, userId: thiago.id },
    ],
  });

  const comment1 = await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: thiago.id,
      content: "Foto espetacular, Clarice! O tom dourado do amanhecer ficou perfeito.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: clarice.id,
      parentId: comment1.id,
      content: "Obrigada, Thiago! O Rio tem essa magia incomparável.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: post2.id,
      userId: clarice.id,
      content: "Parabéns pelo trabalho impecável na infraestrutura, Thiago!",
    },
  });

  console.log("✅ Publicações, curtidas e comentários inseridos.");

  // 6. Depoimentos (RECURSO ESTRELA)
  // Depoimento Aceito (Exibido no perfil de Thiago)
  await prisma.testimonial.create({
    data: {
      authorId: clarice.id,
      recipientId: thiago.id,
      content: "O Thiago é daquelas pessoas raras que combinam brilhantismo técnico com uma generosidade sem tamanho. Trabalhar ao lado dele é uma aula diária de paciência, clareza e dedicação. Um amigo para a vida toda!",
      status: "ACCEPTED",
      reviewedAt: new Date(),
    },
  });

  // Depoimento Aceito (Exibido no perfil de Clarice)
  await prisma.testimonial.create({
    data: {
      authorId: thiago.id,
      recipientId: clarice.id,
      content: "A sensibilidade da Clarice é inspiradora. Suas palavras têm o poder de transformar dias difíceis em momentos de reflexão e serenidade. Uma das maiores cronistas que conheço!",
      status: "ACCEPTED",
      reviewedAt: new Date(),
    },
  });

  // Depoimento PENDENTE (Para demonstrar a área de aprovação do destinatário em Clarice)
  await prisma.testimonial.create({
    data: {
      authorId: marina.id,
      recipientId: clarice.id,
      content: "Querida Clarice! Queria deixar registrado o quanto sua última crônica sobre a Bahia me tocou profundamente. Espero que possamos tomar um café em breve quando eu for ao Rio!",
      status: "PENDING",
    },
  });

  // Depoimento PENDENTE (Para demonstrar a área de aprovação do destinatário em Thiago)
  await prisma.testimonial.create({
    data: {
      authorId: lucas.id,
      recipientId: thiago.id,
      content: "Thiago, acompanho seu trabalho com open-source há anos. Sua dedicação à comunidade brasileira de desenvolvedores é admirável!",
      status: "PENDING",
    },
  });

  console.log("✅ Sistema de depoimentos com itens aceitos e pendentes populado.");

  // 7. Notificações
  await prisma.notification.createMany({
    data: [
      {
        userId: clarice.id,
        actorId: marina.id,
        type: "TESTIMONIAL",
        title: "Novo depoimento recebido!",
        message: "Marina Santos escreveu um depoimento para você. Revise para aprovar ou recusar.",
        link: "/depoimentos",
        read: false,
      },
      {
        userId: clarice.id,
        actorId: thiago.id,
        type: "COMMENT",
        title: "Novo comentário",
        message: "Thiago Silva comentou na sua publicação.",
        link: `/post/${post1.id}`,
        read: true,
      },
      {
        userId: thiago.id,
        actorId: lucas.id,
        type: "TESTIMONIAL",
        title: "Novo depoimento pendente",
        message: "Lucas Mendes enviou um depoimento para o seu perfil.",
        link: "/depoimentos",
        read: false,
      },
    ],
  });

  console.log("✅ Notificações criadas.");

  // 8. Mensagens diretas (Chat entre Clarice e Thiago)
  await prisma.message.createMany({
    data: [
      {
        senderId: thiago.id,
        receiverId: clarice.id,
        content: "Olá Clarice! Tudo bem? Vi seu post sobre a praia hoje cedo, fotografia maravilhosa!",
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 3),
      },
      {
        senderId: clarice.id,
        receiverId: thiago.id,
        content: "Oi Thiago! Tudo ótimo por aqui. Muito obrigada! Como estão os preparativos para o lançamento da Conecta?",
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        senderId: thiago.id,
        receiverId: clarice.id,
        content: "Tudo nos trilhos! As comunidades e o sistema de depoimentos estão funcionando perfeitamente.",
        read: false,
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
  });

  console.log("✅ Mensagens diretas criadas.");
  console.log("🎉 Povoamento de demonstração concluído com sucesso!");
  console.log("\nCredenciais de demonstração (Senha para todos: Conecta@2026):");
  console.log(" - Admin:      conecta (contato@conecta.social)");
  console.log(" - Usuário 1:  clarice (clarice@exemplo.com.br)");
  console.log(" - Usuário 2:  thiago_dev (thiago@exemplo.com.br)");
  console.log(" - Usuário 3:  marina_foto (marina@exemplo.com.br)");
  console.log(" - Usuário 4:  lucas_eco (lucas@exemplo.com.br)");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao povoar dados:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
