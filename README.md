# Introduction to RAG (Retrieval-Augmented Generation)

## What is This?

This project demonstrates a **RAG system** - a way to make AI chatbots smarter by letting them search through your documents before answering questions.

**The Problem It Solves:**
- AI models have limited knowledge and can't access your private documents
- They sometimes make up answers (hallucinations)
- They can't access recent information or specialized knowledge

**How RAG Works:**
Instead of relying only on what the AI was trained on, RAG:
1. Stores your documents in a searchable format
2. When you ask a question, it finds relevant parts of your documents
3. It uses those relevant parts to give you an accurate answer with sources

Think of it like giving the AI a library to search through before answering, rather than relying only on its memory.

## Requirements

### Python Packages
- **fastapi** - Web framework for the API
- **uvicorn** - Server to run the API
- **langchain** - Tools for building RAG systems
- **chromadb** - Database for storing document search indexes
- **sentence-transformers** - Converts text into searchable numbers
- **ollama** - Interface to run AI models locally
- **pydantic** - Data validation
- **python-multipart** - For handling file uploads

### System Requirements
- Docker and Docker Compose (for containerized setup)
- Python 3.11+ (if running without Docker)

## How It Works - Simple Flow

```
┌─────────────────────────────────────────────────────────┐
│                    RAG System Flow                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. ADD DOCUMENTS                                        │
│     ┌───────────────────────────────────────────────┐  │
│     │  You upload documents (PDF, text files, etc.)  │  │
│     │  → System breaks them into smaller pieces      │  │
│     │  → Converts each piece into searchable numbers │  │
│     │  → Stores them in a searchable database        │  │
│     └───────────────────────────────────────────────┘  │
│                           │                              │
│                           ▼                              │
│  2. ASK A QUESTION                                       │
│     ┌───────────────────────────────────────────────┐  │
│     │  User: "How do I reset my password?"          │  │
│     └───────────────────────────────────────────────┘  │
│                           │                              │
│                           ▼                              │
│  3. FIND RELEVANT DOCUMENTS                             │
│     ┌───────────────────────────────────────────────┐  │
│     │  System searches database                      │  │
│     │  → Finds documents about password reset        │  │
│     │  → Ranks them by relevance                     │  │
│     │  → Picks the most relevant ones                │  │
│     └───────────────────────────────────────────────┘  │
│                           │                              │
│                           ▼                              │
│  4. GENERATE ANSWER                                      │
│     ┌───────────────────────────────────────────────┐  │
│     │  AI reads the relevant documents              │  │
│     │  → Creates an answer based on those documents  │  │
│     │  → Includes source citations                   │  │
│     └───────────────────────────────────────────────┘  │
│                           │                              │
│                           ▼                              │
│  5. RETURN ANSWER                                        │
│     ┌───────────────────────────────────────────────┐  │
│     │  "To reset your password:                      │  │
│     │  1. Go to login page                            │  │
│     │  2. Click 'Forgot Password'                    │  │
│     │  3. Enter your email                            │  │
│     │                                                  │  │
│     │  Source: password_reset_guide.md"              │  │
│     └───────────────────────────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    System Components                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐      ┌──────────────┐                 │
│  │   FastAPI    │──────│   Ollama     │                 │
│  │   (API)      │      │  (AI Model)  │                 │
│  │   Port 8001  │      │  Port 11435  │                 │
│  └──────┬───────┘      └──────────────┘                 │
│         │                                                │
│         │      ┌──────────────┐                         │
│         └──────│   Chroma     │                         │
│                │  (Database)   │                         │
│                │  Port 8000    │                         │
│                └──────────────┘                         │
│                                                           │
│  FastAPI: Handles requests and coordinates everything    │
│  Ollama:  Runs the AI model that generates answers        │
│  Chroma:  Stores and searches through your documents      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Quick Start with Docker

The project includes Docker Compose setup to run everything in containers:

1. **Start all services:**
   ```bash
   docker-compose -f docker-compose-rag.yml up -d
   ```
   Starts all containers (API, AI model, database) in the background.

2. **Download AI model (first time only):**
   ```bash
   docker exec -it ollama_service ollama pull llama2
   ```
   Downloads the AI model into the container.

3. **Add documents:**
   ```bash
   curl -X POST http://localhost:8001/api/ingest \
     -H "Content-Type: application/json" \
     -d '{"document_path": "/app/documents/your_file.txt"}'
   ```
   Uploads and processes a document.

4. **Ask questions:**
   ```bash
   curl -X POST http://localhost:8001/api/query \
     -H "Content-Type: application/json" \
     -d '{"query": "Your question here"}'
   ```
   Sends a question and gets an answer with sources.

## What Makes This Different?

**Traditional AI Chatbot:**
- Answers from what it learned during training
- Can't access your documents
- May make up information
- No way to verify answers

**RAG System:**
- Searches your documents first
- Answers based on your actual content
- Provides source citations
- Can be updated by adding new documents
- More accurate and trustworthy

## Use Cases

- **Customer Support**: Answer questions from your knowledge base
- **Documentation Assistant**: Help users find information in technical docs
- **Internal Knowledge Base**: Search company wikis and documents
- **Research Assistant**: Query through papers and articles
- **Code Documentation**: Find answers in codebases and docs

---

*This is a simplified introduction to RAG systems. For detailed technical information, see `intro-to-RAG.md`.*
