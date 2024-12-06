import { Suspense } from 'react';
import Loading from '../creator-admin/loading';

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50" data-testid="public-layout">
      <div className="flex justify-center min-h-screen">
        <div className="bg-white w-full md:w-[700px] h-full p-10">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}
