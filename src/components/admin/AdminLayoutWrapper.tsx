'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <div className="admin-shell">{children}</div>;
  }

  return (
    <div className="admin-shell min-h-screen bg-[#040406] text-zinc-100 flex flex-row">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        {children}
      </div>
    </div>
  );
}
