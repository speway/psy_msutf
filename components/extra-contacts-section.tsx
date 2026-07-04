"use client";

import { Mail, Phone, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { extraOfficialContacts } from "@/data";

export function ExtraContactsSection({ label }: { label: string }) {
  return (
    <Accordion>
      <AccordionItem value="extra-contacts" className="border-0">
        <AccordionTrigger className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-bauhaus-ochre hover:no-underline min-h-[44px] px-0">
          {label}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1 pt-1">
            {extraOfficialContacts.map((contact) => {
              if (contact.type === "phone") {
                return (
                  <a
                    key={contact.label}
                    href={`tel:${contact.value.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-bauhaus-ochre transition-colors min-h-[36px] rounded-sm px-1"
                  >
                    <Phone className="size-3.5 shrink-0 text-bauhaus-ochre/60" />
                    <span className="font-medium">{contact.label}:</span>
                    <span>{contact.value}</span>
                  </a>
                );
              }
              if (contact.type === "email") {
                return (
                  <a
                    key={contact.label}
                    href={`mailto:${contact.value}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-bauhaus-ochre transition-colors min-h-[36px] rounded-sm px-1"
                  >
                    <Mail className="size-3.5 shrink-0 text-bauhaus-ochre/60" />
                    <span className="font-medium">{contact.label}:</span>
                    <span>{contact.value}</span>
                  </a>
                );
              }
              return (
                <a
                  key={contact.label}
                  href={contact.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-bauhaus-ochre transition-colors min-h-[36px] rounded-sm px-1"
                >
                  <ExternalLink className="size-3.5 shrink-0 text-bauhaus-ochre/60" />
                  <span className="font-medium">{contact.label}:</span>
                  <span>{contact.value}</span>
                </a>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
