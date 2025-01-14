import Image from 'next/image';
import Link from 'next/link';

export type LogoProps = {
  linkTo?: string;
  size?: 'sm' | 'md' | 'lg';
};

function getSize(size: string) {
  switch (size) {
    case 'sm':
      return '160';
    case 'md':
    case 'lg':
    case 'xl':
      return '240';
    case '2xl':
      return '320';
    default:
      return '160';
  }
}

export default function Logo({ linkTo = '/', size = 'md' }: LogoProps) {
  return (
    <Link href={linkTo}>
      <Image
        src="/img/logo.png"
        alt="Logo"
        width={getSize(size)}
        height={getSize(size)}
        className="mx-auto md:mx-0"
      />
    </Link>
  );
}
