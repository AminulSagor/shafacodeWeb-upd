
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/client/dashboard/projects");
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        loading...
      </div>
    </>
  );
}
