import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin/app-sidebar';

// Temporary shell for the old admin screens until the admin rebuild lands.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');
  if (!auth || auth.value !== 'true') {
    redirect('/login');
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main id="main" className="grow">
        <div className="sticky top-0 z-50 border-b bg-surface-2 py-4">
          <SidebarTrigger className="ml-2" />
        </div>
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
