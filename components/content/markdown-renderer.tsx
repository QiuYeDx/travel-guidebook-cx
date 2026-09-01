import type { CSSProperties } from "react";
import { smoothCorners } from "@qiuyedx/smooth-corners";
import { ArrowUpRightIcon, LinkIcon } from "lucide-react";
import Markdown, { type Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { ScrollEdgeFades } from "@/components/content/scroll-edge-fades";

const insetContentCorners = smoothCorners(8, 0.65) as CSSProperties;

function HeadingLink({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  if (!id) return children;

  return (
    <a className="group inline-flex items-start gap-2" href={`#${id}`}>
      <span>{children}</span>
      <LinkIcon
        aria-hidden="true"
        className="mt-1.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </a>
  );
}

const components: Components = {
  h1: ({ children, id }) => (
    <h1
      id={id}
      className="mb-7 scroll-mt-24 text-3xl font-semibold leading-tight sm:text-4xl"
    >
      <HeadingLink id={id}>{children}</HeadingLink>
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="mb-4 mt-14 scroll-mt-24 border-t pt-8 text-2xl font-semibold leading-tight first:mt-0"
    >
      <HeadingLink id={id}>{children}</HeadingLink>
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="mb-3 mt-9 scroll-mt-24 text-lg font-semibold leading-snug"
    >
      <HeadingLink id={id}>{children}</HeadingLink>
    </h3>
  ),
  h4: ({ children, id }) => (
    <h4 id={id} className="mb-2 mt-7 scroll-mt-24 text-base font-semibold">
      <HeadingLink id={id}>{children}</HeadingLink>
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-4 text-[15px] leading-7 text-foreground/90 sm:text-base">
      {children}
    </p>
  ),
  a: ({ children, href }) => {
    const external =
      href?.startsWith("http://") || href?.startsWith("https://");
    return (
      <a
        href={href}
        className="font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
        rel={external ? "noopener noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {children}
        {external ? (
          <ArrowUpRightIcon
            aria-hidden="true"
            className="ml-1 inline size-3.5"
          />
        ) : null}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="my-4 list-disc space-y-1.5 pl-6 text-[15px] leading-7 marker:text-muted-foreground sm:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-1.5 pl-6 text-[15px] leading-7 marker:text-muted-foreground sm:text-base">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-primary/50 pl-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  code: ({ children, className }) => (
    <code
      className={
        className
          ? `${className} font-mono text-sm`
          : "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
      }
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre
      className="smooth-corners my-6 overflow-x-auto border bg-muted/50 p-4 text-sm leading-6"
      style={insetContentCorners}
    >
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <ScrollEdgeFades
      ariaLabel="攻略数据表格"
      axis="horizontal"
      className="smooth-corners my-6 max-w-full border bg-background"
      role="region"
      style={insetContentCorners}
      tabIndex={0}
    >
      <table className="w-max min-w-full border-collapse text-left text-sm leading-6">
        {children}
      </table>
    </ScrollEdgeFades>
  ),
  thead: ({ children }) => <thead className="bg-muted/70">{children}</thead>,
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="align-top">{children}</tr>,
  th: ({ children }) => (
    <th className="whitespace-nowrap border-r px-3 py-2.5 font-semibold last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="max-w-80 min-w-28 border-r px-3 py-2.5 text-foreground/85 last:border-r-0">
      {children}
    </td>
  ),
  input: ({ type, ...props }) => (
    <input
      {...props}
      type={type}
      className="mr-2 size-4 translate-y-0.5 accent-primary"
    />
  ),
};

export function MarkdownRenderer({
  content,
  headingMeta,
}: {
  content: string;
  headingMeta?: React.ReactNode;
}) {
  const markdownComponents: Components = headingMeta
    ? {
        ...components,
        h1: ({ children, id }) => (
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b pb-5">
            <h1
              id={id}
              className="min-w-0 scroll-mt-24 text-3xl font-semibold leading-tight sm:text-4xl"
            >
              <HeadingLink id={id}>{children}</HeadingLink>
            </h1>
            <div className="ml-auto">{headingMeta}</div>
          </div>
        ),
      }
    : components;

  return (
    <Markdown
      components={markdownComponents}
      rehypePlugins={[rehypeSlug]}
      remarkPlugins={[remarkGfm]}
      skipHtml
    >
      {content}
    </Markdown>
  );
}
