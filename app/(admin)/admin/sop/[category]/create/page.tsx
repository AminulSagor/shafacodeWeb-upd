import { CreateSopForm } from "@/components/admin/sop/createSopForm";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";

const page = async ({ params }: { params: { category: string } }) => {
  const { category } = await params;
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-3xl">Create SOP</h2>
        <Button asChild>
          <Link href={`/admin/sop/${category}?status=active`}>Go Back</Link>
        </Button>
      </div>

      <CreateSopForm role={(role as string) || ""} />
    </div>
  );
};

export default page;
