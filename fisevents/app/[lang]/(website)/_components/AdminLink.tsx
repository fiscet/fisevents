import Link from 'next/link';

export type AdminLinkProps = {
  label: string;
  href: string;
};

export default function AdminLink({ label, href }: AdminLinkProps) {
  return (
    <Link
      className="font-headline font-semibold text-sm text-fe-primary hover:opacity-80 transition-opacity"
      href={href}
    >
      {label}
    </Link>
  );
}
