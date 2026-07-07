'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import 'katex/dist/katex.min.css'
import './markdown.css'

interface MathMarkdownProps {
  content: string
  className?: string
}

function normalizeDelimiters(content: string): string {
  return content
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    .replace(/\\\(/g, '$$')
    .replace(/\\\)/g, '$$')
}

const components = {
  code: ({ node, ...props }: any) => {
    const match = /language-(\w+)/.exec(node.properties.className?.[0] || '')
    return <code {...props} className={match ? `language-${match[1]}` : undefined} />
  },
  pre: ({ children, ...props }: any) => (
    <div className="relative group">
      <pre {...props} className="overflow-x-auto rounded-lg bg-muted p-4">
        {children}
      </pre>
    </div>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote {...props} className="border-l-4 border-primary pl-4 italic my-4">
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-4">
      <table {...props} className="w-full border-collapse">{children}</table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th {...props} className="border border-border p-2 text-left bg-muted font-semibold">{children}</th>
  ),
  td: ({ children, ...props }: any) => (
    <td {...props} className="border border-border p-2 text-left">{children}</td>
  ),
  hr: () => <hr className="my-8 border-border" />,
}

export function MathMarkdown({ content, className }: MathMarkdownProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className || ''}`}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          rehypeKatex,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
      >
        {normalizeDelimiters(content)}
      </ReactMarkdown>
    </div>
  )
}