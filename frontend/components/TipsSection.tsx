export default function TipsSection() {
  return (
    <div className="card" style={{ backgroundColor: '#f8f9fa', border: '2px solid #0070f3' }}>
      <h2 style={{ marginBottom: '20px', color: '#0070f3' }}>
        💡 Tips & Helpful Information
      </h2>
      
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>What is RAG?</h3>
        <p style={{ color: '#555', lineHeight: '1.6' }}>
          RAG (Retrieval-Augmented Generation) is a system that lets AI chatbots search through 
          your documents before answering questions. Instead of relying only on what the AI was 
          trained on, it finds relevant parts of your documents and uses them to give accurate 
          answers with source citations.
        </p>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>How to Use This System</h3>
        <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
          <li><strong>Upload Documents:</strong> Go to Settings and upload PDF, Markdown, or text files</li>
          <li><strong>Wait for Processing:</strong> Documents are broken into searchable chunks (this takes a moment)</li>
          <li><strong>Ask Questions:</strong> Type questions about your documents in the chat above</li>
          <li><strong>Get Answers:</strong> The system finds relevant information and generates answers with sources</li>
        </ol>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Best Practices</h3>
        <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
          <li><strong>Be Specific:</strong> Ask clear, specific questions for better results</li>
          <li><strong>Use Keywords:</strong> Include important terms from your documents</li>
          <li><strong>Ask Follow-ups:</strong> Build on previous answers for deeper understanding</li>
          <li><strong>Check Sources:</strong> Review the source citations to verify information</li>
        </ul>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Example Questions</h3>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '6px',
          border: '1px solid #ddd'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, color: '#555' }}>
            <li style={{ padding: '5px 0' }}>• "What is the main topic of this document?"</li>
            <li style={{ padding: '5px 0' }}>• "Summarize the key points"</li>
            <li style={{ padding: '5px 0' }}>• "What does it say about [specific topic]?"</li>
            <li style={{ padding: '5px 0' }}>• "List the important steps or procedures"</li>
            <li style={{ padding: '5px 0' }}>• "Explain [concept] in simple terms"</li>
          </ul>
        </div>
      </div>

      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e7f3ff', 
        borderRadius: '6px',
        border: '1px solid #b3d9ff'
      }}>
        <strong style={{ color: '#0066cc' }}>💬 Remember:</strong>
        <p style={{ marginTop: '8px', color: '#555', marginBottom: 0 }}>
          The system only knows about documents you've uploaded. Make sure to upload all relevant 
          documents in Settings before asking questions about them.
        </p>
      </div>
    </div>
  )
}
