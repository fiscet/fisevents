export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[url('/img/auth-bg.jpg')] bg-contain">
      <div className="w-screen h-screen flex items-center justify-center bg-white opacity-70 absolute z-10"></div>
      {children}
    </div>
  );
}
