import ReactMarkdown from "react-markdown"

import remarkGfm from "remark-gfm"

import remarkMath from "remark-math"

import rehypeKatex from "rehype-katex"

import "katex/dist/katex.min.css"

function Markdown({ content }) {
  return (
    <div className="chat-markdown min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h2 className="mb-3 mt-5 text-xl font-bold text-slate-900 first:mt-0">
              {children}
            </h2>
          ),

          h2: ({ children }) => (
            <h3 className="mb-2 mt-5 text-lg font-bold text-slate-900 first:mt-0">
              {children}
            </h3>
          ),

          h3: ({ children }) => (
            <h4 className="mb-2 mt-4 text-base font-bold text-slate-900">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="my-2 leading-7 text-slate-700 last:mb-0">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1 pl-6 text-slate-700">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-1 pl-6 text-slate-700">
              {children}
            </ol>
          ),

          li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,

          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-sky-300 pl-4 text-slate-600">
              {children}
            </blockquote>
          ),

          pre: ({ children }) => (
            <pre className="my-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
              {children}
            </pre>
          ),

          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-sky-800">
              {children}
            </code>
          ),

          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-800">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
