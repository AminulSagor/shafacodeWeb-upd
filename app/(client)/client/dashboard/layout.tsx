import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../../globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";
import ClientShell from "@/components/client/client-shell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientProvider } from "@/context/ClientContext";
import { getClientServer } from "@/actions/clients/getClientData";
import { getClientProjects } from "@/actions/clients/getClientProjects";
import { ProjectsProvider } from "@/context/ProjectsContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Client | ShafaCode",
};

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("client_auth");
  const email = cookieStore.get("client_email")?.value || "";

  if (!auth || auth.value !== "true") {
    redirect("/client/login");
  }

  const client = (await getClientServer()) as any;
  const projects = await getClientProjects(email);

  console.log(projects);

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <UserProvider>
          <ClientProvider initialClient={client}>
            <ProjectsProvider initialProjects={projects}>
              <ClientShell>{children}</ClientShell>
            </ProjectsProvider>
          </ClientProvider>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
