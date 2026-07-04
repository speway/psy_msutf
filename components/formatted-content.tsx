interface FormattedContentProps {
  text: string;
}

function InlineContent({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-bold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <em key={match.index} className="italic text-foreground/80">
          {match[3]}
        </em>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

export function FormattedContent({ text }: FormattedContentProps) {
  const blocks = text.split("\n\n");
  const elements: React.ReactNode[] = [];
  let inList: "ul" | "ol" | null = null;
  let listItems: React.ReactNode[] = [];

  function flushList() {
    if (inList && listItems.length > 0) {
      const Tag = inList === "ul" ? "ul" : "ol";
      elements.push(
        <Tag key={`list-${elements.length}`} className="mb-6 space-y-1">
          {listItems}
        </Tag>
      );
      listItems = [];
      inList = null;
    }
  }

  for (const block of blocks) {
    const lines = block.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith("- ");
      const numberedMatch = trimmed.match(/^(\d+)\.\s/);

      if (isBullet) {
        if (inList !== "ul") {
          flushList();
          inList = "ul";
        }
        listItems.push(
          <li
            key={`li-${elements.length}-${listItems.length}`}
            className="text-base leading-relaxed text-foreground/85 ml-6 list-disc"
          >
            <InlineContent text={trimmed.slice(2)} />
          </li>
        );
      } else if (numberedMatch) {
        if (inList !== "ol") {
          flushList();
          inList = "ol";
        }
        listItems.push(
          <li
            key={`li-${elements.length}-${listItems.length}`}
            className="text-base leading-relaxed text-foreground/85 ml-6 list-decimal"
          >
            <InlineContent text={trimmed.replace(/^\d+\.\s/, "")} />
          </li>
        );
      } else if (trimmed === "") {
        continue;
      } else {
        flushList();
        elements.push(
          <p
            key={`p-${elements.length}`}
            className="text-base leading-relaxed mb-6 text-foreground/85"
          >
            <InlineContent text={trimmed} />
          </p>
        );
      }
    }
  }

  flushList();

  return <>{elements}</>;
}
