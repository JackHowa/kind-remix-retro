import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
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
    <main className="flex h-full w-full flex-col items-center gap-4">
      <div className="flex w-10/12 flex-col items-start justify-start gap-4">
        <Link to="/boards" className="text-2xl text-gray-900">
          ←
        </Link>
        {/* todo: implement timer */}
      </div>
      <div className="flex w-10/12  items-start justify-between	">
        <div className="flex flex-col">
          <h1 className="text-3xl">Retrospective</h1>
          <h2 className="text-2xl text-gray-600">{board.title}</h2>
        </div>
        <div className="flex flex-row gap-2">
          <Form>
            <label htmlFor="invite" className="text-gray-600">
              Invite User By Email
            </label>
            <input
              id="invite"
              name="invite"
              type="email"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Email"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-md bg-orange-500 px-4 py-3 font-medium text-white hover:bg-orange-600"
            >
              Invite
            </button>
          </Form>
        </div>
      </div>
      <div className="flex w-10/12 flex-col items-center gap-2">
        <h3 className="text-center text-xl text-gray-600">People</h3>
        <ul className="flex flex-row flex-row gap-2 bg-clip-padding">
          {["J", "K", "L"].map((letter) => (
            <li key={letter}>{letter}</li>
            // todo: add pronouns
          ))}
        </ul>
      </div>
    </main>
  );
}
