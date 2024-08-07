export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[url('/img/main-bg.jpg')] bg-contain">
      <div className="w-screen h-screen bg-white opacity-70 absolute z-10"></div>
      <div className="z-20">{children}</div>
    </div>
  );
}
