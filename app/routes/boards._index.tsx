import { json } from "@remix-run/node";
// link is like the link tag in ember
// If your background is a bit farther back than that with MVC web frameworks like Rails, then you can think of your Remix routes as backend views using React for templating
import { Link, useLoaderData } from "@remix-run/react";
import { getBoards } from "~/models/board.server";

export const loader = async () => {
  return json({ boards: await getBoards() });
};

export default function Boards() {
  // runs on the server and the browser
  // will be exposed to the client
  const { boards } = useLoaderData<typeof loader>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-orange-400 to-orange-600">
      <Link to="/" className="text-2xl text-white">
        ←
      </Link>
      <h1 className="text-center text-4xl font-bold text-white">Boards</h1>
      <ul className="flex flex-col gap-4 rounded-xl bg-white bg-opacity-10 bg-clip-padding p-8 backdrop-blur-lg backdrop-filter">
        {boards.map((board: any) => (
          <li
            className="text-center text-xl font-bold text-white"
            key={board.slug}
          >
            <Link
              to={board.slug}
              className="text-center text-xl font-bold text-white underline"
            >
              {board.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center rounded-md bg-white bg-opacity-10 px-4 py-3 font-medium text-white hover:bg-opacity-20">
        {/* you get relative links here based on the parent route */}
        {/* Did you notice that the to prop is just "admin" and it linked to
      /posts/admin? With Remix, you get relative links. */}
        <Link to="admin" className="text-xl text-white underline">
          Admin
        </Link>
      </div>
    </main>
  );
}
