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
    <main>
      <h1>Retros</h1>
      <ul>
        {boards.map((board) => (
          <li key={board.slug}>
            <Link to={board.slug} className="text-blue-600 underline">
              {board.title}
            </Link>
          </li>
        ))}
      </ul>
      {/* you get relative links here based on the parent route */}
      {/* Did you notice that the to prop is just "admin" and it linked to
      /posts/admin? With Remix, you get relative links. */}
      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
    </main>
  );
}
