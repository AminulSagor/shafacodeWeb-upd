import Link from "next/link";
import { redirect } from "next/navigation";

export default function DashboardPage() {

  const user=false

  if(user){
    redirect("/client/login")
  }

  return (
    <div className="space-y-4 h-screen flex flex-col justify-center items-center p-4">
      <h2 className="text-lg font-semibold">Welcome 👋</h2>
      <p className="text-muted-foreground text-sm">
        This is your client dashboard home.
      </p>

      <div className="grid grid-cols-1 gap-4 p-4">
        <Link href="/client/profile" className="rounded-lg border p-4">Profile</Link>
      </div>
    </div>
  );
}
