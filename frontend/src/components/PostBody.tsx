import { Fragment } from "react";

/**
 * Renders an article body as React elements. Supports headings ("## "), bullet
 * lists ("- ") and paragraphs. Nothing is ever injected as HTML, so stored
 * content cannot introduce script into the page.
 */
export default function PostBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="prose-body">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return <h2 key={index}>{block.slice(3)}</h2>;
        }
        if (block.startsWith("- ")) {
          const items = block.split("\n").map((line) => line.replace(/^-\s*/, ""));
          return (
            <ul key={index}>
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index}>
            {block.split("\n").map((line, lineIndex, lines) => (
              <Fragment key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
