import { Form, useActionData, useNavigation } from "@remix-run/react";
import { createBoard } from "~/models/board.server";
import { json, redirect } from "@remix-run/node";

import type { ActionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

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
  await createBoard({ title, slug });

  return redirect("/boards/admin");
};

export default function NewBoard() {
  const errors = useActionData<typeof action>();

  // for progressive enhancement without js and handlng pending form submission
  const navigation = useNavigation();
  const isCreating = Boolean(navigation.state === "submitting");

  return (
    <Form method="post">
      {/* nice that it's not doing anything crazy like importing its own form submit */}
      <p>
        <label>
          Board Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Board Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p className="text-right">
        <button
          // good for migration that nothing crazy here for form handling
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating}
        >
          {isCreating ? "Creating Board..." : "Create Board"}
        </button>
      </p>
    </Form>
  );
}
