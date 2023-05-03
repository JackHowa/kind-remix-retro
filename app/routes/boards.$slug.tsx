import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBoard } from "~/models/board.server";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);

  const board = await getBoard(params.slug);
  // handle not found
  // Quick note on that invariant for the params. Because params comes from the URL, we can't be totally sure that params.slug will be defined--maybe you change the name of the file to posts.$postId.ts! It's a good practice to validate that stuff with invariant, and it makes TypeScript happy too.

  invariant(board, `Board not found: ${params.slug}`);

  return json({ board });
};

// The part of the filename attached to the $ becomes a named key on the params object that comes into your loader. This is how we'll look up our blog post.

export default function BoardSlug() {
  // comes from the params object in loader
  const { board } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        Board: {board.title}
      </h1>
    </main>
  );
}
