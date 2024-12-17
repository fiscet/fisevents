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

export default function HPCarousel() {
  return (
    <Carousel plugins={[Autoplay({ delay: 3000 })]}>
      <CarouselContent>
        <CarouselItem className="flex justify-center">
          <Image
            src="/img/sh-login.jpg"
            alt="Login"
            width={1024}
            height={300}
          />
        </CarouselItem>
        <CarouselItem className="flex justify-center">
          <Image
            src="/img/sh-list.jpg"
            alt="Event list"
            width={1024}
            height={300}
          />
        </CarouselItem>
        <CarouselItem className="flex justify-center">
          <Image
            src="/img/sh-event-1.jpg"
            alt="Event details #1"
            width={1024}
            height={300}
          />
        </CarouselItem>
        <CarouselItem className="flex justify-center">
          <Image
            src="/img/sh-event-2.jpg"
            alt="Event details #2"
            width={1024}
            height={300}
          />
        </CarouselItem>
        <CarouselItem className="flex justify-center">
          <Image
            src="/img/sh-event-3.jpg"
            alt="Event details #3"
            width={1024}
            height={300}
          />
        </CarouselItem>
        <CarouselItem className="flex justify-center">
          <Image
            src="/img/sh-attendants.jpg"
            alt="Event attendants"
            width={1024}
            height={300}
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="left-3 text-orange-600 shadow" />
      <CarouselNext className="right-3 text-orange-600 shadow" />
    </Carousel>
  );
}
