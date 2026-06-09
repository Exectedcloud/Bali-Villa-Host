import { HostSidebar } from '@/components/layout/HostSidebar';
import { PageTransition } from '@/components/PageTransition';
import { AdminGuard } from '@/components/AdminGuard';

export const metadata = {
  title: 'Admin Panel — BaliVilla',
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-paper">
        <HostSidebar />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AdminGuard>
  );
}
