import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Kind Retro App" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen flex-col gap-4 bg-gradient-to-b from-orange-400 to-orange-600 sm:flex sm:items-center sm:justify-center">
      <div className="flex max-w-md flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-white">Kind Retro App</h1>
        <p className="text-center text-xl font-bold text-white">
          Good feedback is specific, prescriptive, actionable, referenced, and
          kind.
        </p>
      </div>
      <div className="flex w-full max-w-md items-center justify-center gap-4 rounded-xl bg-white bg-opacity-10 bg-clip-padding p-8 backdrop-blur-lg backdrop-filter">
        {user ? (
          <>
            <p className="flex items-center justify-center rounded-full  p-2 text-center text-xl font-bold text-white">
              {user.email.charAt(0).toUpperCase()}
            </p>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="flex items-center justify-center rounded-md bg-white bg-opacity-10 px-4 py-3 font-medium text-white hover:bg-opacity-20"
              >
                👋
              </button>
            </Form>
          </>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            <Link
              to="/join"
              className="flex items-center justify-center rounded-md bg-white bg-opacity-10 px-4 py-3 font-medium text-white hover:bg-opacity-20"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-indigo-600"
            >
              Log In
            </Link>
          </div>
        )}
      </div>

      <div className="w-full max-w-md space-y-8 rounded-xl bg-white bg-opacity-10 bg-clip-padding p-8 ">
        <Link
          className="flex items-center justify-center rounded-md bg-white bg-opacity-10 px-4 py-3 font-medium text-white hover:bg-opacity-20"
          to="/boards"
        >
          Start
        </Link>
      </div>
    </main>
  );
}
