export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav>Nav here!</nav>

      {children}
    </section>
  );
}
