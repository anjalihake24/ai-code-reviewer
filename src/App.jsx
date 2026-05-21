import { useState } from 'react'
import EditorModule from 'react-simple-code-editor'
import Prism from 'prismjs'
import Markdown from 'react-markdown'
import axios from 'axios'

import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'

import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import './App.css'

const Editor = EditorModule.default || EditorModule
const API_URL = import.meta.env.VITE_API_URL || 'https://ai-code-reviewer-backend-v696.onrender.com'

function App() {
  const [code, setCode] = useState(`function sum(a, b) {
  return a + b;
}`)

  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)

  async function reviewCode() {
    try {
      setLoading(true)
      setReview('')

      const response = await axios.post(`${API_URL}/api/ai/get-review`, {
        code,
      })

      setReview(String(response.data))
    } catch (error) {
      console.error(error)
      setReview('Something went wrong while reviewing the code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <section className="panel left">
        <div className="panel-header">
          <span>Code Input </span>
          {/* <span className="badge">JavaScript</span> */}
        </div>

        <div className="code">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, 'javascript')
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 16,
              minHeight: '100%',
              width: '100%',
              outline: 'none',
            }}
          />
        </div>

        <button onClick={reviewCode} className="review" disabled={loading}>
          {loading ? 'Reviewing...' : 'Review Code'}
        </button>
      </section>

      <section className="panel right">
        <div className="panel-header">
          <span>AI Review</span>
          <span className="badge success">{loading ? 'Checking' : 'Ready'}</span>
        </div>

       <div className="output">
  {loading ? (
    <p className="placeholder">Reviewing your code...</p>
  ) : review ? (
    <Markdown rehypePlugins={[rehypeHighlight]}>
      {review}
    </Markdown>
  ) : (
    <p className="placeholder">Your code review will appear here.</p>
  )}
</div>
      </section>
    </main>
  )
}

export default App
