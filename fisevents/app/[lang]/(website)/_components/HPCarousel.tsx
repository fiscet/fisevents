'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useDictionary } from '@/app/contexts/DictionaryContext';

const images = [
  '/img/Sh-01.jpg',
  '/img/Sh-02.jpg',
  '/img/Sh-03.jpg',
  '/img/Sh-04.jpg',
  '/img/Sh-05.jpg',
  '/img/Sh-06.jpg',
  '/img/Sh-07.jpg',
];

export default function HPCarousel() {
  const { website: d } = useDictionary();
  const alts: string[] = d.home.screenshots.carousel;

  return (
    <Carousel plugins={[Autoplay({ delay: 3000 })]}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="flex justify-center">
            <Image
              src={image}
              alt={alts[index] ?? ''}
              width={1024}
              height={300}
              className="rounded-2xl w-full h-auto shadow-editorial border border-fe-outline-variant/10"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 text-fe-primary bg-fe-surface-container-lowest/90 border-fe-outline-variant/20 shadow-editorial-sm" />
      <CarouselNext className="right-3 text-fe-primary bg-fe-surface-container-lowest/90 border-fe-outline-variant/20 shadow-editorial-sm" />
    </Carousel>
  );
}
