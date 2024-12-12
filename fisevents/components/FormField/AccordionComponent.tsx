import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type AccordionComponentProps = {
  triggerComponent: ReactNode;
  children: ReactNode;
};

export default function AccordionComponent({ triggerComponent, children }: AccordionComponentProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="unique-item" className='border-none'>
        <AccordionTrigger>{triggerComponent}</AccordionTrigger>
        <AccordionContent className="p-1">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>);
}