'use client'

import { useState } from 'react'
import axios from 'axios'
import ChatInterface from '@/components/ChatInterface'
import TipsSection from '@/components/TipsSection'

// Use environment variable or detect from current host
// In browser, this will use the host IP from docker-compose env var
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

export default function Home() {
  return (
    <div className="container">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#0070f3' }}>
          RAG Chat System
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Ask questions about your uploaded documents
        </p>
        <nav style={{ marginTop: '20px' }}>
          <a href="/settings" className="btn btn-secondary" style={{ marginRight: '10px' }}>
            Settings
          </a>
        </nav>
      </header>

      <ChatInterface apiUrl={API_URL} />

      <TipsSection />
    </div>
  )
}
