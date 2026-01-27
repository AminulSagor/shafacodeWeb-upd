import SOPList from "@/components/admin/sop/sop-list";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSOPs } from "@/actions/sops/getSOPs";

type MaybePromise<T> = T | Promise<T>;

function statusLabel(status?: string) {
  if (!status) return "All SOP";
  if (status === "active") return "Active SOP";
  if (status === "pending") return "Pending SOP";
  if (status === "declined") return "Declined SOP";
  return "All SOP";
}

export default async function SOPPage({
  params,
  searchParams,
}: {
  params: MaybePromise<{ category: string }>;
  searchParams: MaybePromise<{ status?: string; mySop?: string }>;
}) {
  const { category } = await params;
  const { status, mySop } = await searchParams;

  const cookieStore = await cookies();
  const role = await cookieStore.get("role")?.value;
  const email = await cookieStore.get("email")?.value;

  const isMySop = mySop === "true";

  const data = await getSOPs();

  const filteredSops = data.filter((sop: any) => {
    const sameCategory = sop.category?.toLowerCase() === category.toLowerCase();
    
    if (!sameCategory) return false;

    // 🟢 MY SOP MODE
    if (isMySop) {
      if (!email) return false;

      const createdByMe = sop.createdBy === email;

      const updatedByMe =
        Array.isArray(sop.history) &&
        sop.history.length > 0 &&
        sop.history.some((h: any) => {
          return h?.by === email;
        });

      const touchedByMe = createdByMe || updatedByMe;

      if (!touchedByMe) return false;

      if (status) return sop.status === status;
      return true;
    }

    // 🟡 NORMAL MODE
    if (role !== "admin") return sop.status === "active";
    if (status) return sop.status === status;

    return true;
  });

  const selectedText = statusLabel(status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">
          {category} Standard Operating Procedures
        </h2>

        <div className="flex items-center gap-2">
          {role === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{selectedText}</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/sop/${category}`}>All SOP</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/admin/sop/${category}?status=active`}>
                    Active SOP
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/admin/sop/${category}?status=pending`}>
                    Pending SOP
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/admin/sop/${category}?status=declined`}>
                    Declined SOP
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {role === "employee" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {isMySop ? `My • ${selectedText}` : "All SOP"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/sop/${category}?status=active`}>
                    All SOP
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/sop/${category}?status=active&mySop=true`}
                  >
                    Active SOP
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/sop/${category}?status=pending&mySop=true`}
                  >
                    Pending SOP
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/sop/${category}?status=declined&mySop=true`}
                  >
                    Declined SOP
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            asChild
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800"
          >
            <Link href={`/admin/sop/${category}/create`}>Create SOP</Link>
          </Button>
        </div>
      </div>

      <SOPList sops={filteredSops} />
    </div>
  );
}
