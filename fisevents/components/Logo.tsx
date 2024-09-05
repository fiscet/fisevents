import Image from 'next/image';
import Link from 'next/link';

export type LogoProps = {
  linkTo?: string;
};

export default function Logo({ linkTo = '/' }: LogoProps) {
  return (
    <Link href={linkTo}>
      <Image
        src="/img/logo.png"
        alt="Logo"
        width="320"
        height="320"
        className="mx-auto"
      />
    </Link>
  );
}
