import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BOARDS = [
  {
    slug: "robust-convo-on-robustness",
    title: "Robust convo on robustness",
  },
  {
    slug: "hunting-socks-accident-in-the-woods",
    title: "Hunting socks accident in the woods",
  },
  {
    slug: "engineers-talking-about-prs",
    title: "Engineers talking about prs",
  },
];

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  for (const board of BOARDS) {
    // Note that we're using upsert so you can run the seed script over and over without adding multiple versions of the same post every time.

    await prisma.board.upsert({
      where: { slug: board.slug },
      update: board,
      create: board,
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
