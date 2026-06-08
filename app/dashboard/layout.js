import { HostSidebar } from '@/components/layout/HostSidebar';
import { PageTransition } from '@/components/PageTransition';
import { AuthGuard } from '@/components/AuthGuard';

export const metadata = {
  title: 'Dashboard — BaliVilla for Hosts',
};

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-paper">
        <HostSidebar />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AuthGuard>
  );
}
