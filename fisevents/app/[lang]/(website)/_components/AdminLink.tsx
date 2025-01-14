import Link from 'next/link';

export type AdminLinkProps = {
  label: string;
  href: string;
};

export default function AdminLink({ label, href }: AdminLinkProps) {
  return (
    <Link className="text-lg text-orange-600" href={href}>
      {label}
    </Link>
  );
}
