import { Suspense } from 'react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs font-bold text-slate-500">Loading B2B Dashboard...</div>}>
      {children}
    </Suspense>
  );
}
