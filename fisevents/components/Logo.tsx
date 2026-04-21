import Image from 'next/image';
import Link from 'next/link';

export type LogoProps = {
  linkTo?: string;
  /** Pixel height of the image — width scales proportionally (square asset). */
  height?: number;
};

export default function Logo({ linkTo = '/', height = 120 }: LogoProps) {
  return (
    <Link href={linkTo} aria-label="FisEvents — Home">
      <Image
        src="/img/logo.png"
        alt="FisEvents"
        width={height}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  );
}
