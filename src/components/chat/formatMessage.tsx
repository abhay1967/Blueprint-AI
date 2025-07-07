import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

export function formatMessage(raw: string): JSX.Element[] {
  if (!raw) return [];

  const cleaned = raw
    .replace(/\|\\n\|/g, "") // Remove pipe-newline edge cases
    .replace(/\\n/g, "\n") // Convert \n to newline
    .replace(/\n{3,}/g, "\n\n"); // Collapse triple+ newlines

  return [
    <div
      className="prose prose-sm w-full break-words max-w-none !leading-snug !my-1 prose-ul:pl-4 prose-ul:my-0 prose-li:my-0 prose-li:pl-0 prose-table:my-2 prose-table:overflow-x-auto"
      key="md-0"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-xs">
                {props.children}
              </table>
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border px-2 py-1 bg-gray-100">{props.children}</th>
          ),
          td: ({ node, ...props }) => (
            <td className="border px-2 py-1">{props.children}</td>
          ),
          ul: ({ node, ...props }) => (
            <ul className="pl-4 my-0 list-disc">{props.children}</ul>
          ),
          li: ({ node, ...props }) => (
            <li className="my-0 pl-0">{props.children}</li>
          ),
        }}
      >
        {cleaned.trim()}
      </ReactMarkdown>
    </div>,
  ];
}
