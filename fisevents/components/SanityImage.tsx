import Image from 'next/image';
import urlBuilder from '@sanity/image-url';
import {
  getImageDimensions,
  type SanityImageSource,
} from '@sanity/asset-utils';
import {
  IMAGE_ALIGNMENTS,
  IMAGE_SIZES,
  classAlignments,
  classSizes,
} from '@/lib/website.config';
import { sanityClient } from '@/lib/sanity';

type SanityImageProps = {
  value: SanityImageSource & {
    alt?: string;
    size: (typeof IMAGE_SIZES)[number];
    alignment: (typeof IMAGE_ALIGNMENTS)[number];
  };
};

export default function SanityImage({ value }: SanityImageProps) {
  const { width, height } = getImageDimensions(value);

  return (
    <Image
      src={urlBuilder(sanityClient).image(value).fit('max').auto('format').url()}
      width={width}
      height={height}
      alt={' '}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      className={`${classSizes.get(value.size)} ${classAlignments.get(value.alignment)}`}
    />
  );
}
