'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

interface ChatInterfaceProps {
  apiUrl?: string
}

export default function ChatInterface({ apiUrl = 'http://localhost:8001' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post(`${apiUrl}/api/query`, {
        query: input,
        top_k: 5
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response || 'No response received',
        sources: response.data.sources || []
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Chat error:', error)
      let errorText = 'Failed to get response'
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorText = 'Network Error: Cannot connect to the API. Please check if the API is running at ' + apiUrl
      } else if (error.response?.data?.detail) {
        errorText = `Error: ${error.response.data.detail}`
      } else if (error.message) {
        errorText = `Error: ${error.message}`
      }
      
      const errorMessage: Message = {
        role: 'assistant',
        content: errorText
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="card" style={{ marginBottom: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>Chat</h2>
      
      <div style={{
        height: '500px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#fafafa'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            <p>Start a conversation by asking a question about your documents.</p>
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              Try: "What is this document about?" or "Summarize the main points"
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '20px',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#0070f3' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : '#333',
                marginLeft: msg.role === 'user' ? 'auto' : '0',
                marginRight: msg.role === 'user' ? '0' : 'auto',
                maxWidth: '80%',
                textAlign: msg.role === 'user' ? 'right' : 'left'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ 
                  marginTop: '10px', 
                  paddingTop: '10px', 
                  borderTop: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.3)' : '#ddd'}`,
                  fontSize: '0.85rem',
                  opacity: 0.8
                }}>
                  <strong>Sources:</strong> {msg.sources.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div style={{ textAlign: 'center', color: '#999', padding: '10px' }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about your documents..."
          className="input"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="btn btn-primary"
          style={{
            minWidth: '100px',
            opacity: (!input.trim() || loading) ? 0.6 : 1,
            cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
