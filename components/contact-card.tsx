"use client";

import { useState } from "react";
import { ChevronDown, Mail, Phone, ExternalLink, Send } from "lucide-react";
import type { MainContact, ExtraContact } from "@/data";

interface ContactCardProps {
  contact: MainContact;
  extraContacts?: ExtraContact[];
  extraContactsLabel?: string;
}

export function ContactCard({
  contact,
  extraContacts,
  extraContactsLabel = "Дополнительные контакты",
}: ContactCardProps) {
  const [expanded, setExpanded] = useState(false);

  const hasMainContent = !!(contact.phone || contact.email || contact.link);
  const hasExtraContacts = !!(extraContacts && extraContacts.length > 0);

  return (
    <div className="bauhaus-card bauhaus-card-hover p-6 sm:p-8">
      {contact.title && (
        <h3 className="text-lg font-bold uppercase tracking-wider text-bauhaus-blue mb-3">
          {contact.title}
        </h3>
      )}
      {contact.description && (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
          {contact.description}
        </p>
      )}

      {(contact.phone || contact.email || contact.link) && (
        <div className="space-y-3">
          {contact.phone && (
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="w-full flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground hover:text-bauhaus-ochre transition-colors min-h-[44px]"
            >
              <span className="w-8 h-8 flex items-center justify-center border-2 border-bauhaus-ochre/30 text-bauhaus-ochre shrink-0">
                <Phone className="h-4 w-4" />
              </span>
              <span className="min-w-0 break-words">{contact.phone}</span>
            </a>
          )}

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="w-full flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground hover:text-bauhaus-ochre transition-colors min-h-[44px]"
            >
              <span className="w-8 h-8 flex items-center justify-center border-2 border-bauhaus-ochre/30 text-bauhaus-ochre shrink-0">
                <Mail className="h-4 w-4" />
              </span>
              <span className="min-w-0 break-words">{contact.email}</span>
            </a>
          )}

          {contact.link && (
            <a
              href={contact.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground hover:text-bauhaus-ochre transition-colors min-h-[44px]"
            >
              <span className="w-8 h-8 flex items-center justify-center border-2 border-bauhaus-ochre/30 text-bauhaus-ochre shrink-0">
                <Send className="h-4 w-4" />
              </span>
              <span className="min-w-0 break-words">{contact.link.label}</span>
            </a>
          )}
        </div>
      )}

      {hasExtraContacts && (
        <div
          className={`${hasMainContent ? "mt-4 pt-4 border-t border-border/60" : ""}`}
        >
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-bauhaus-ochre transition-colors min-h-[44px]"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
            {extraContactsLabel}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2">
              {extraContacts!.map((extra) => {
                if (extra.type === "phone") {
                  return (
                    <a
                      key={extra.label}
                      href={`tel:${extra.value.replace(/[^\d+]/g, "")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-bauhaus-ochre transition-colors min-h-[36px]"
                    >
                      <Phone className="h-3 w-3 shrink-0" />
                      <span className="font-medium shrink-0">
                        {extra.label}:
                      </span>
                      <span className="break-words">{extra.value}</span>
                    </a>
                  );
                }
                if (extra.type === "email") {
                  return (
                    <a
                      key={extra.label}
                      href={`mailto:${extra.value}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-bauhaus-ochre transition-colors min-h-[36px]"
                    >
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="font-medium shrink-0">
                        {extra.label}:
                      </span>
                      <span className="break-words">{extra.value}</span>
                    </a>
                  );
                }
                return (
                  <a
                    key={extra.label}
                    href={extra.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-bauhaus-ochre transition-colors min-h-[36px]"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="font-medium shrink-0">{extra.label}:</span>
                    <span className="break-words">{extra.value}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
