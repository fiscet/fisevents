import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/img/logo.png"
      alt="Logo"
      width="320"
      height="320"
      className="mx-auto"
    />
  );
}
