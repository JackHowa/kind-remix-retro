import { prisma } from "~/db.server";
// so I let the db drive the types
import type { Board } from "@prisma/client";

export async function getBoards() {
  // prisma handles types
  // Notice we're able to remove the return type, but everything is still fully typed. The TypeScript feature of Prisma is one of its greatest strengths. Less manual typing, but still type safe!

  return prisma.board.findMany();
}

// this is like the service for getting the board data
// todo: handle undefined
export async function getBoard(slug: string) {
  return prisma.board.findUnique({ where: { slug } });
}

export async function createBoard(board: Pick<Board, "slug" | "title">) {
  return prisma.board.create({ data: board });
}
