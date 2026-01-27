import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditSOPForm from "@/components/admin/sop/editSOPForm";
import { getSOPById } from "@/actions/sops/getSOPById";
import { cookies } from "next/headers";

export default async function EditSOPPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  const email = cookieStore.get("email")?.value;

  const sop = await getSOPById(id);

  if (!sop) {
    return <div>SOP not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Edit SOP</h2>
        <Button asChild variant="outline">
          <Link href={`/admin/sop/${sop.category}`}>Go Back</Link>
        </Button>
      </div>

      <EditSOPForm sop={sop} email={email ?? ""} role={role ?? ""} />
    </div>
  );
}
