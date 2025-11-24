import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../globals.css';
import { Toaster } from 'react-hot-toast';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin/app-sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shafacode - Admin Layout',
  description: 'Shafacode - Next Generation Software Development',
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');
  if (!auth || auth.value !== 'true') {
    redirect('/login');
  }
  return (
    <html lang="en">
      <body className={`${poppins.className}  antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <main className="grow">
            <div className="border-b bg-slate-100 py-4 sticky top-0 z-50">
              <SidebarTrigger className="ml-2" />
            </div>
            <div className="p-4">{children}</div>
            <Toaster />
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
