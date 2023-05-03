import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getBoards } from "~/models/board.server";

export const loader = async () => {
  return json({ boards: await getBoards() });
};

export default function BoardAdmin() {
  const { boards } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {boards.map((board) => (
              <li key={board.slug}>
                <Link to={board.slug} className="text-blue-600 underline">
                  {board.title}
                </Link>
              </li>
            ))}
            <li key="new">
              <Link to="new" className="text-blue-600 underline">
                New Board
              </Link>
            </li>
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          {/* works like children	in react */}
          {/* takes in the index for the "new" route  */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
