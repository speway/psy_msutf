import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

function Accordion({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function AccordionItem({
  className,
  children,
  value: _value,
  ...props
}: { value?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <details
      data-slot="accordion-item"
      className={cn("group/accordion-item not-last:border-b", className)}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </details>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <summary
      data-slot="accordion-trigger"
      className={cn(
        "group/accordion-trigger relative flex flex-1 cursor-pointer items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="accordion-trigger-icon"
        className="pointer-events-none shrink-0 group-open/accordion-item:hidden"
      />
      <ChevronUpIcon
        data-slot="accordion-trigger-icon"
        className="pointer-events-none hidden shrink-0 group-open/accordion-item:inline"
      />
    </summary>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="accordion-content"
      className={cn("overflow-hidden text-sm", className)}
      {...props}
    >
      <div className={cn("pt-0 pb-2.5")}>{children}</div>
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
