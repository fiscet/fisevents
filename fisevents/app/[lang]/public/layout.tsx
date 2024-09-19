export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50">
      <div className="flex justify-center h-screen w-screen">
        <div className="bg-white w-full md:w-[700px] h-full p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
