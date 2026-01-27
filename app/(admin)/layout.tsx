import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import NotificationBell from "@/components/admin/notifications/notification-bell";
import { getNotifications } from "@/actions/sops/getNotifications";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shafacode - Admin Layout",
  description: "Shafacode - Next Generation Software Development",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  const role = cookieStore.get("role")?.value ?? "";
  const email = cookieStore.get("email")?.value ?? "";



  if (!auth || auth.value !== "true"){
    redirect("/login");
  }

  const notifications = await getNotifications(role);

  console.log("noy",notifications);

  const notificationsWithEmail = notifications.map((n: any) => ({
    ...n,
    userEmail: n.userEmail || email,
  }));

  const filteredNotifications = role === "admin" ? notificationsWithEmail : notificationsWithEmail.filter((n: any) => n.userEmail === email);


  console.log("filter",filteredNotifications);

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <UserProvider>
          <SidebarProvider>
            <AppSidebar role={role} />
            <main className="grow">
              <div className="flex justify-between items-center border-b bg-slate-100 py-4 sticky top-0 z-50">
                <SidebarTrigger className="ml-2" />
                <div className="px-4">
                  <NotificationBell
                    userEmail={email}
                    initialNotifications={filteredNotifications}
                    
                  />
                </div>
              </div>

              <div className="p-4">{children}</div>
              <Toaster />
            </main>
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}
