'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const images = [
  '/img/sh-hp-01.jpg',
  '/img/sh-hp-02.jpg',
  '/img/sh-hp-03.jpg',
  '/img/sh-hp-04.jpg',
  '/img/sh-hp-06.jpg',
  '/img/sh-hp-07.jpg'
];

export default function HPCarousel() {
  return (
    <Carousel plugins={[Autoplay({ delay: 3000 })]}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="flex justify-center">
            <Image src={image} alt="Event list" width={1024} height={300} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 text-orange-600 shadow" />
      <CarouselNext className="right-3 text-orange-600 shadow" />
    </Carousel>
  );
}
