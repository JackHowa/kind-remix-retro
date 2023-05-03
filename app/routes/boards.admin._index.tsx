import { Link } from "@remix-run/react";

// I'm not sure what the purpose of this is
export default function AdminIndex() {
  return (
    <p>
      <Link to="new" className="text-blue-600 underline">
        Create a New Board
      </Link>
    </p>
  );
}
