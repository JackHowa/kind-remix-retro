import { redirect } from "@remix-run/node";
// have to separate import type from non type imports
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Board } from "@prisma/client";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  createBoard,
  deleteBoard,
  getBoard,
  updateBoard,
} from "~/models/board.server";
import invariant from "tiny-invariant";
const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

// optional board if it's on the new route
type LoaderData = { board?: Board };

export const action = async ({ request, params }: ActionArgs) => {
  // to ensure that param is not undefined
  invariant(params.slug, `params.slug is required`);
  const formData = await request.formData();

  const intent = formData.get("intent");

  if (intent === "delete") {
    await deleteBoard(params.slug);
    return redirect("/boards/admin");
  }

  const title = formData.get("title");
  const slug = formData.get("slug");

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  if (params.slug === "new") {
    await createBoard({ title, slug });
  } else {
    await updateBoard(params.slug, { title, slug });
  }

  return redirect("/boards/admin");
};

export const loader = async ({ params }: LoaderArgs) => {
  // can't allow people to type in new as slug
  if (params.slug === "new") {
    return json<LoaderData>({});
  }

  invariant(params.slug, `params.slug is required`);

  const board = await getBoard(params.slug);
  // handle not found
  // Quick note on that invariant for the params. Because params comes from the URL, we can't be totally sure that params.slug will be defined--maybe you change the name of the file to posts.$postId.ts! It's a good practice to validate that stuff with invariant, and it makes TypeScript happy too.

  invariant(board, `Board not found: ${params.slug}`);

  return json<LoaderData>({ board });
};

// this is very similar to board but you can edit
export default function AdminBoardSlug() {
  const data = useLoaderData<typeof loader>() as LoaderData;

  // will be undefined if no board data
  const isNewParam = !data.board;

  const errors = useActionData<typeof action>();

  // for progressive enhancement without js and handlng pending form submission
  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === "submitting");

  // comes from the params object in loader
  return (
    <Form method="post" key={data.board?.slug ?? "new"}>
      {/* nice that it's not doing anything crazy like importing its own form submit */}
      <p>
        <label>
          Board Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={data.board?.title}
          />
        </label>
      </p>
      <p>
        <label>
          Board Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={data.board?.slug}
          />
        </label>
      </p>
      <p className="text-right">
        {isNewParam ? null : (
          <button
            type="submit"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            name="intent"
            value="delete"
            // could work on individual is updating but not sure if it's worth it
            disabled={isSubmitting}
          >
            Delete Board
          </button>
        )}
        <button
          // good for migration that nothing crazy here for form handling
          type="submit"
          // setting the value of the submit button
          name="intent"
          value={isNewParam ? "create" : "update"}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          // could break up with isSubmitted or isEditing
          disabled={isSubmitting}
        >
          {isNewParam
            ? isSubmitting
              ? "Creating Board..."
              : "Create Board"
            : isSubmitting
            ? "Editing Board..."
            : "Edit Board"}
        </button>
      </p>
    </Form>
  );
}
