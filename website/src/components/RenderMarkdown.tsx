import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkMdx from 'remark-mdx'
import 'github-markdown-css/github-markdown-dark.css'

const RenderMarkdown = ({ content }: { content: string }) => {
    const input = `## JavaScript code
    ## Overview

* Follows [CommonMark](https://commonmark.workspace)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`h1\`)
* Has a lot of plugins
`

    return (
        <ReactMarkdown
            children={input}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm, remarkMdx]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            // @ts-ignore
                            style={tomorrow}
                            language={match[1]}
                            showLineNumbers
                            PreTag="div"
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                }
            }}
        />
    )
}

export default RenderMarkdown