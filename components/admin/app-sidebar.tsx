"use client";
import {
  Calendar,
  Inbox,
  Building2,
  Baby,
  Image,
  HomeIcon,
  EthernetPort,
  LogOut,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Role = "admin" | "employee" | "client" | string;

type MenuItem = {
  title: string;
  url: string;
  icon: any;
  roles: Role[];
};

const mainItems: MenuItem[] = [
  {
    title: "Projects",
    url: "/admin/projects",
    icon: Inbox,
    roles: ["admin", "employee"],
  },
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: Calendar,
    roles: ["admin"],
  },
  {
    title: "Media",
    url: "/admin/media",
    icon: Image,
    roles: ["admin"],
  },
  {
    title: "SOP",
    url: "/admin/sop",
    icon: EthernetPort,
    roles: ["admin", "employee"],
  },
  {
    title: "Employees",
    url: "/admin/employees",
    icon: EthernetPort,
    roles: ["admin"],
  },
];

const careerItems: MenuItem[] = [
  {
    title: "Jobs",
    url: "/admin/jobs",
    icon: Building2,
    roles: ["admin"],
  },
  {
    title: "Job Applications",
    url: "/admin/job-applications",
    icon: Baby,
    roles: ["admin"],
  },
];

const websiteItems: MenuItem[] = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
    roles: ["admin", "employee", "client"],
  },
];

const accountItems: MenuItem[] = [
  {
    title: "Profile",
    url: "/admin/profile",
    icon: User,
    roles: ["admin", "employee", "client"],
  },
];

export function AppSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await fetch("/api/logout", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      window.location.href = "/";
    }
  };

  const renderMenu = (items: MenuItem[]) => {
    return items
      .filter((item) => item.roles.includes(role as Role))
      .map((item) => {
        const isActive = pathname.startsWith(item.url);
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton className={cn(isActive && "bg-white")} asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      });
  };

  const hasMain = mainItems.some((i) => i.roles.includes(role as Role));
  const hasCareers = careerItems.some((i) => i.roles.includes(role as Role));
  const hasWebsite = websiteItems.some((i) => i.roles.includes(role as Role));
  const hasAccount = accountItems.some((i) => i.roles.includes(role as Role));

  return (
    <Sidebar>
      <SidebarHeader className="bg-slate-200 border-b border-slate-300 py-4.5">
        <Link href={role === "client" ? "/" : "/admin"} className="font-bold font-4xl">
          Shafacode
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-slate-200">
        {hasMain ? (
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenu(mainItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {hasCareers ? (
          <SidebarGroup>
            <SidebarGroupLabel>Careers</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenu(careerItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {hasWebsite ? (
          <SidebarGroup>
            <SidebarGroupLabel>Website</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenu(websiteItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {hasAccount ? (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenu(accountItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleLogout()}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
