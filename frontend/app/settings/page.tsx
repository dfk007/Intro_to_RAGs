'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// Use environment variable or detect from current host
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser: use env var or construct from current host
    const envUrl = process.env.NEXT_PUBLIC_API_URL
    if (envUrl && !envUrl.includes('localhost')) {
      return envUrl
    }
    // Fallback: use same host as frontend but port 8001
    return `${window.location.protocol}//${window.location.hostname}:8001`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
}

const API_URL = getApiUrl()

export default function Settings() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Don't set Content-Type header - axios will set it automatically with boundary
      const response = await axios.post(`${API_URL}/api/ingest`, formData, {
        headers: {
          'Accept': 'application/json',
        },
      })

      setMessage({ type: 'success', text: response.data.message || `File uploaded successfully! Processed ${response.data.chunks || 0} chunks.` })
      setFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to upload file. Please try again.' 
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#0070f3' }}>
          Settings
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Upload documents to add them to the RAG knowledge base
        </p>
        <nav style={{ marginTop: '20px' }}>
          <a href="/" className="btn btn-secondary">
            Back to Chat
          </a>
        </nav>
      </header>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Upload Document</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="file-input" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Select a document (PDF, Markdown, TXT, etc.)
          </label>
          <input
            id="file-input"
            type="file"
            accept=".pdf,.md,.txt,.doc,.docx"
            onChange={handleFileChange}
            style={{ 
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              width: '100%',
              cursor: 'pointer'
            }}
          />
          {file && (
            <p style={{ marginTop: '10px', color: '#666' }}>
              Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn btn-primary"
          style={{ 
            opacity: (!file || uploading) ? 0.6 : 1,
            cursor: (!file || uploading) ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '6px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message.text}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Supported File Formats</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>📄 PDF (.pdf)</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>📝 Markdown (.md)</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>📄 Text (.txt)</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>📄 Word (.doc, .docx)</li>
        </ul>
        <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9rem' }}>
          After uploading, documents are processed and added to the searchable knowledge base. 
          This may take a few moments depending on file size.
        </p>
      </div>
    </div>
  )
}
