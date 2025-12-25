# Introduction to RAG (Retrieval-Augmented Generation)

## Table of Contents
1. [Why RAGs are Needed](#why-rags-are-needed)
2. [Problems RAG Solves](#problems-rag-solves)
3. [RAG vs Conventional Solutions](#rag-vs-conventional-solutions)
4. [RAG Use Cases](#rag-use-cases)
5. [RAG vs Fine-tuning](#rag-vs-fine-tuning)
6. [RAG System Components](#rag-system-components)
7. [Implementing RAGs](#implementing-rags)
8. [Ways of Implementing RAG](#ways-of-implementing-rag)
9. [End-to-End RAG Pipeline Architecture](#end-to-end-rag-pipeline-architecture)
10. [Docker Compose Setup](#docker-compose-setup)

---

## Why RAGs are Needed

**Retrieval-Augmented Generation (RAG)** addresses critical limitations of Large Language Models (LLMs):

1. **Knowledge Cutoff**: LLMs are trained on data up to a specific date and cannot access information beyond their training cutoff
2. **Hallucination**: LLMs may generate plausible-sounding but incorrect information
3. **Domain-Specific Knowledge**: General-purpose LLMs lack deep expertise in specialized domains
4. **Real-Time Information**: LLMs cannot access current events, recent data, or private documents
5. **Cost of Fine-tuning**: Continuously fine-tuning models for new information is expensive and time-consuming
6. **Transparency**: RAG provides source attribution, allowing users to verify information

---

## Problems RAG Solves

### 1. **Outdated Information**
- **Problem**: LLMs have knowledge cutoffs and cannot access recent information
- **Solution**: RAG retrieves up-to-date documents from external sources

### 2. **Lack of Domain Expertise**
- **Problem**: General LLMs lack deep knowledge in specialized fields (legal, medical, technical)
- **Solution**: RAG augments responses with domain-specific documents

### 3. **Hallucination and Inaccuracy**
- **Problem**: LLMs generate confident but incorrect answers
- **Solution**: RAG grounds responses in retrieved documents, reducing hallucinations

### 4. **Private/Proprietary Data**
- **Problem**: LLMs cannot access internal company documents, private databases
- **Solution**: RAG enables querying private knowledge bases without exposing data to external APIs

### 5. **Cost and Scalability**
- **Problem**: Fine-tuning models for every update is expensive
- **Solution**: RAG allows knowledge updates by simply adding documents to the vector store

### 6. **Transparency and Trust**
- **Problem**: Users cannot verify LLM responses
- **Solution**: RAG provides source citations, enabling fact-checking

---

## RAG vs Conventional Solutions

### Traditional Approaches vs RAG

#### 1. **Fine-tuning**
```
Traditional Fine-tuning:
┌─────────────────────────────────────────┐
│  Base LLM                               │
│  ┌───────────────────────────────────┐ │
│  │ Train on new data                 │ │
│  │ - Expensive (GPU resources)       │ │
│  │ - Time-consuming (days/weeks)     │ │
│  │ - Requires full model retraining  │ │
│  │ - Knowledge frozen at training    │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘

RAG Approach:
┌─────────────────────────────────────────┐
│  Base LLM + Vector Store                │
│  ┌───────────────────────────────────┐ │
│  │ Add documents to vector store      │ │
│  │ - Fast (minutes)                   │ │
│  │ - Cost-effective (no retraining)   │ │
│  │ - Easy to update (add/remove docs) │ │
│  │ - Knowledge always current         │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Advantages of RAG:**
- ✅ **Faster Updates**: Add new documents in minutes vs days/weeks for fine-tuning
- ✅ **Cost-Effective**: No expensive GPU training required
- ✅ **Flexible**: Easy to add, remove, or update knowledge
- ✅ **Transparent**: Source attribution for every response
- ✅ **Scalable**: Handle large knowledge bases efficiently

#### 2. **Rule-Based Systems**
```
Rule-Based System:
┌─────────────────────────────────────────┐
│  User Query                              │
│         ↓                                │
│  Pattern Matching Engine                │
│  ┌───────────────────────────────────┐ │
│  │ if "password" → show reset steps  │ │
│  │ if "refund" → show policy         │ │
│  │ if "shipping" → show times        │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Predefined Response                     │
└─────────────────────────────────────────┘

RAG System:
┌─────────────────────────────────────────┐
│  User Query                              │
│         ↓                                │
│  Semantic Search                         │
│  ┌───────────────────────────────────┐ │
│  │ Find relevant documents           │ │
│  │ Understand context & intent        │ │
│  │ Handle variations naturally       │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Context-Aware Response                  │
└─────────────────────────────────────────┘
```

**Advantages of RAG:**
- ✅ **Natural Language Understanding**: Handles variations and synonyms
- ✅ **Context-Aware**: Understands user intent beyond keywords
- ✅ **Maintainable**: No complex rule maintenance required
- ✅ **Adaptive**: Learns from document structure and content

#### 3. **Keyword Search**
```
Keyword Search:
┌─────────────────────────────────────────┐
│  Query: "password reset"                │
│         ↓                                │
│  Exact Keyword Match                    │
│  ┌───────────────────────────────────┐ │
│  │ Finds: "password", "reset"        │ │
│  │ Misses: "forgot password",         │ │
│  │         "change login"             │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Limited Results                         │
└─────────────────────────────────────────┘

RAG Semantic Search:
┌─────────────────────────────────────────┐
│  Query: "password reset"                 │
│         ↓                                │
│  Semantic Similarity Search             │
│  ┌───────────────────────────────────┐ │
│  │ Finds: "password reset",           │ │
│  │         "forgot password",         │ │
│  │         "change login",            │ │
│  │         "account recovery"         │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Comprehensive Results                   │
└─────────────────────────────────────────┘
```

**Advantages of RAG:**
- ✅ **Semantic Understanding**: Finds conceptually similar content
- ✅ **Better Recall**: Captures related information beyond exact matches
- ✅ **Multilingual**: Works across languages with proper embeddings
- ✅ **Contextual**: Understands query intent and document meaning

---

## RAG Use Cases

```
┌─────────────────────────────────────────────────────────────┐
│                    RAG Use Cases                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Customer     │  │ Technical    │  │ Legal        │       │
│  │ Support      │  │ Documentation│  │ Research     │       │
│  │ Chatbots     │  │ Assistants   │  │ & Analysis   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Enterprise   │  │ Medical      │  │ Educational  │       │
│  │ Knowledge    │  │ Q&A Systems  │  │ Tutoring     │       │
│  │ Bases        │  │              │  │ Systems      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Code         │  │ Research     │  │ Content      │       │
│  │ Documentation│  │ Assistants   │  │ Generation   │       │
│  │ Assistants   │  │              │  │ with Sources │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Specific Examples:
1. **Customer Support**: Answer FAQs from knowledge base
2. **Technical Documentation**: Help developers find relevant docs
3. **Legal Research**: Query case law and legal documents
4. **Medical Q&A**: Answer questions from medical literature
5. **Enterprise Search**: Search internal wikis and documents
6. **Code Assistance**: Query codebases and documentation
7. **Research Assistance**: Query academic papers and publications

---

## RAG vs Fine-tuning

```
┌─────────────────────────────────────────────────────────────────┐
│              RAG vs Fine-tuning Comparison                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │   FINE-TUNING        │      │        RAG            │        │
│  ├──────────────────────┤      ├──────────────────────┤        │
│  │                      │      │                      │        │
│  │  Knowledge baked     │      │  Knowledge in        │        │
│  │  into model          │      │  external store      │        │
│  │                      │      │                      │        │
│  │  Update: Retrain     │      │  Update: Add docs    │        │
│  │  (days/weeks)        │      │  (minutes)           │        │
│  │                      │      │                      │        │
│  │  Cost: High          │      │  Cost: Low           │        │
│  │  (GPU training)      │      │  (storage only)      │        │
│  │                      │      │                      │        │
│  │  Transparency: Low   │      │  Transparency: High  │        │
│  │  (no sources)        │      │  (source citations)  │        │
│  │                      │      │                      │        │
│  │  Best for:           │      │  Best for:           │        │
│  │  - Style adaptation  │      │  - Dynamic content   │        │
│  │  - Task-specific     │      │  - Large KBs         │        │
│  │  - Domain expertise  │      │  - Source attribution│        │
│  │                      │      │  - Frequent updates  │        │
│  └──────────────────────┘      └──────────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### When to Use RAG:
- ✅ Need to update knowledge frequently
- ✅ Require source citations
- ✅ Working with large, changing knowledge bases
- ✅ Need transparency and auditability
- ✅ Want cost-effective solution

### When to Use Fine-tuning:
- ✅ Need to change model behavior/style
- ✅ Task-specific optimization required
- ✅ Knowledge is stable and won't change
- ✅ Need model to "remember" without retrieval
- ✅ Working with proprietary model training

### Hybrid Approach:
Many production systems combine both:
- **Fine-tuning**: Adapt model style and behavior
- **RAG**: Provide up-to-date, citable knowledge

---

## RAG System Components

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAG System Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐                                               │
│  │   User       │                                               │
│  │   Query      │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Query Processing Layer                        │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  Query Understanding & Preprocessing                 │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Embedding Generation                         │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  Convert Query → Vector Embedding                    │ │  │
│  │  │  (Using Embedding Model)                             │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Vector Database                              │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  Similarity Search                                    │ │  │
│  │  │  Find Top-K Relevant Documents                       │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Context Assembly                             │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  Combine Retrieved Documents                         │ │  │
│  │  │  Format for LLM Input                                │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              LLM Generation (Ollama)                      │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  Generate Response Based on Context                   │ │  │
│  │  │  Port: 11435                                          │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐                                               │
│  │   Response   │                                               │
│  │   + Sources  │                                               │
│  └──────────────┘                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Details

#### 1. **Document Ingestion**
```
┌─────────────────────────────────────────┐
│  Raw Documents                           │
│  (PDF, TXT, MD, HTML, etc.)              │
│         ↓                                │
│  ┌───────────────────────────────────┐ │
│  │  Document Loader                   │ │
│  │  - Parse formats                   │ │
│  │  - Extract text                    │ │
│  │  - Handle metadata                 │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Structured Text                         │
└─────────────────────────────────────────┘
```

#### 2. **Chunking**
```
┌─────────────────────────────────────────┐
│  Full Document Text                      │
│         ↓                                │
│  ┌───────────────────────────────────┐ │
│  │  Text Splitter                    │ │
│  │  - Fixed size chunks              │ │
│  │  - Overlap for context            │ │
│  │  - Semantic boundaries            │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Document Chunks                         │
│  [Chunk 1, Chunk 2, ..., Chunk N]        │
└─────────────────────────────────────────┘
```

#### 3. **Embedding**
```
┌─────────────────────────────────────────┐
│  Text Chunks                             │
│         ↓                                │
│  ┌───────────────────────────────────┐ │
│  │  Embedding Model                   │ │
│  │  (e.g., sentence-transformers)    │ │
│  │  - Convert text → vectors          │ │
│  │  - Preserve semantic meaning       │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Vector Embeddings                       │
│  [768-dim vectors]                       │
└─────────────────────────────────────────┘
```

#### 4. **Vector Database**
```
┌─────────────────────────────────────────┐
│  Vector Embeddings                       │
│         ↓                                │
│  ┌───────────────────────────────────┐ │
│  │  Vector Store                      │ │
│  │  (Chroma, Pinecone, Weaviate)     │ │
│  │  - Store vectors + metadata        │ │
│  │  - Index for fast search           │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Indexed Knowledge Base                  │
└─────────────────────────────────────────┘
```

#### 5. **Retrieval**
```
┌─────────────────────────────────────────┐
│  Query Embedding                         │
│         ↓                                │
│  ┌───────────────────────────────────┐ │
│  │  Similarity Search                 │ │
│  │  - Cosine similarity               │ │
│  │  - Top-K retrieval                 │ │
│  │  - Re-ranking (optional)           │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Relevant Chunks                         │
└─────────────────────────────────────────┘
```

#### 6. **Generation**
```
┌─────────────────────────────────────────┐
│  Query + Retrieved Context              │
│         ↓                                │
│  ┌───────────────────────────────────┐ │
│  │  LLM (Ollama)                     │ │
│  │  - Prompt engineering              │ │
│  │  - Context-aware generation        │ │
│  │  - Source attribution              │ │
│  └───────────────────────────────────┘ │
│         ↓                                │
│  Generated Response                      │
└─────────────────────────────────────────┘
```

---

## Implementing RAGs

### 1. Chunking

**Purpose**: Break documents into smaller, manageable pieces for embedding and retrieval.

```
┌─────────────────────────────────────────────────────────┐
│                    Chunking Strategies                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Fixed-Size Chunking:                                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Document: "Lorem ipsum dolor sit amet..."        │ │
│  │  Chunk Size: 500 chars                            │ │
│  │  Overlap: 50 chars                                │ │
│  │                                                    │ │
│  │  Chunk 1: [0:500]                                 │ │
│  │  Chunk 2: [450:950]  (50 char overlap)            │ │
│  │  Chunk 3: [900:1400]                              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                           │
│  Semantic Chunking:                                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Split at sentence/paragraph boundaries           │ │
│  │  Preserve context and meaning                     │ │
│  │  Better for retrieval quality                     │ │
│  └───────────────────────────────────────────────────┘ │
│                                                           │
│  Recursive Chunking:                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Try large chunks first, recursively split       │ │
│  │  if too large                                     │ │
│  │  Maintains hierarchy (sections → paragraphs)     │ │
│  └───────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Key Parameters:**
- **Chunk Size**: Typically 200-1000 tokens
- **Overlap**: 10-20% to preserve context
- **Chunking Strategy**: Fixed, semantic, or recursive

### 2. Embedding

**Purpose**: Convert text into numerical vectors that capture semantic meaning.

```
┌─────────────────────────────────────────────────────────┐
│                    Embedding Process                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Text: "How to reset password"                           │
│         ↓                                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Embedding Model                                   │ │
│  │  (e.g., all-MiniLM-L6-v2, sentence-transformers) │ │
│  │                                                    │ │
│  │  Input:  "How to reset password"                  │ │
│  │  Output: [0.12, -0.45, 0.78, ..., 0.23]          │ │
│  │          (384 or 768 dimensions)                  │ │
│  └───────────────────────────────────────────────────┘ │
│         ↓                                                │
│  Vector: [0.12, -0.45, 0.78, ..., 0.23]                  │
│                                                           │
│  Similar queries map to similar vectors:                 │
│  "password reset" → [0.11, -0.44, 0.79, ..., 0.22]       │
│  "forgot password" → [0.10, -0.43, 0.80, ..., 0.21]     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Embedding Models:**
- **Open Source**: sentence-transformers, BGE, E5
- **Commercial**: OpenAI embeddings, Cohere
- **Dimensions**: 384, 512, 768, 1536 (higher = more capacity, slower)

### 3. Vector Database

**Purpose**: Store and efficiently search through millions of embeddings.

```
┌─────────────────────────────────────────────────────────┐
│                  Vector Database Architecture             │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Vector Store                                      │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  Collection: "documents"                     │ │ │
│  │  │  ┌──────────┬──────────────┬──────────────┐ │ │ │
│  │  │  │ ID      │ Embedding    │ Metadata     │ │ │ │
│  │  │  ├──────────┼──────────────┼──────────────┤ │ │ │
│  │  │  │ doc_1   │ [0.1,0.2...] │ {source:...} │ │ │ │
│  │  │  │ doc_2   │ [0.3,0.4...] │ {source:...} │ │ │ │
│  │  │  │ doc_3   │ [0.5,0.6...] │ {source:...} │ │ │ │
│  │  │  │ ...     │ ...          │ ...          │ │ │ │
│  │  │  └──────────┴──────────────┴──────────────┘ │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  Index: HNSW, IVF, or Flat                        │ │
│  │  (for fast approximate nearest neighbor search)   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Popular Vector Databases:**
- **Chroma**: Open-source, easy to use, good for development
- **Pinecone**: Managed service, scalable, production-ready
- **Weaviate**: Open-source, graphQL API, advanced features
- **Qdrant**: High-performance, Rust-based
- **FAISS**: Facebook's library, in-memory, very fast

### 4. Retrieval Process

**Purpose**: Find the most relevant documents for a user query.

```
┌─────────────────────────────────────────────────────────┐
│                    Retrieval Flow                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Query Embedding:                                     │
│     "How do I reset my password?"                        │
│         ↓                                                │
│     [0.12, -0.45, 0.78, ..., 0.23]                       │
│                                                           │
│  2. Similarity Search:                                    │
│     ┌─────────────────────────────────────────────────┐ │
│     │  Compare query vector with all document vectors │ │
│     │  Calculate cosine similarity                     │ │
│     │  Score: similarity(query, doc_i)                 │ │
│     └─────────────────────────────────────────────────┘ │
│         ↓                                                │
│  3. Top-K Selection:                                     │
│     ┌─────────────────────────────────────────────────┐ │
│     │  Rank by similarity score                       │ │
│     │  Select top K documents (e.g., K=5)             │ │
│     │                                                  │ │
│     │  Doc_1: score=0.89  "Password reset steps..."   │ │
│     │  Doc_2: score=0.76  "Account recovery..."       │ │
│     │  Doc_3: score=0.65  "Login troubleshooting..."  │ │
│     └─────────────────────────────────────────────────┘ │
│         ↓                                                │
│  4. Re-ranking (Optional):                               │
│     ┌─────────────────────────────────────────────────┐ │
│     │  Cross-encoder for better accuracy              │ │
│     │  More expensive but more accurate               │ │
│     └─────────────────────────────────────────────────┘ │
│         ↓                                                │
│  Retrieved Context Documents                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Retrieval Strategies:**
- **Dense Retrieval**: Vector similarity search (most common)
- **Sparse Retrieval**: BM25, keyword-based (faster, less semantic)
- **Hybrid Retrieval**: Combine dense + sparse (best results)
- **Re-ranking**: Use cross-encoder to refine top-K results

### 5. Generation

**Purpose**: Generate natural language response using retrieved context.

```
┌─────────────────────────────────────────────────────────┐
│                    Generation Process                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Prompt Template:                                        │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Context: {retrieved_documents}                   │ │
│  │  Question: {user_query}                           │ │
│  │                                                    │ │
│  │  Instructions:                                    │ │
│  │  - Answer based on context only                   │ │
│  │  - Cite sources                                   │ │
│  │  - Say "I don't know" if not in context           │ │
│  └───────────────────────────────────────────────────┘ │
│         ↓                                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │  LLM (Ollama)                                     │ │
│  │  - Processes prompt                               │ │
│  │  - Generates response                             │ │
│  │  - Streams tokens                                 │ │
│  └───────────────────────────────────────────────────┘ │
│         ↓                                                │
│  Generated Response:                                     │
│  "To reset your password:                               │
│   1. Go to login page                                   │
│   2. Click 'Forgot Password'                           │
│   3. Enter your email                                   │
│   4. Check email for reset link                         │
│                                                          │
│   Source: password_reset_guide.md"                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Prompt Engineering Tips:**
- Include clear instructions about using context
- Specify format for citations
- Add examples for better few-shot learning
- Set temperature for creativity vs accuracy trade-off

---

## Ways of Implementing RAG

### 1. Using SDKs Directly

**Approach**: Use individual libraries for each component.

```python
# Example: Direct SDK usage
from sentence_transformers import SentenceTransformer
import chromadb
from ollama import Client

# Embedding
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(texts)

# Vector DB
client = chromadb.Client()
collection = client.create_collection("docs")
collection.add(embeddings=embeddings, documents=texts)

# LLM
ollama_client = Client(host='http://localhost:11435')
response = ollama_client.generate(model='llama2', prompt=prompt)
```

**Pros:**
- Full control over each component
- Lightweight, no framework overhead
- Easy to customize

**Cons:**
- More boilerplate code
- Need to manage integrations manually
- More error-prone

### 2. LangChain

**LangChain** is a framework for building LLM applications that provides abstractions and integrations for RAG pipelines. It offers pre-built components for document loading, text splitting, embeddings, vector stores, and LLM interactions, making it easier to build production-ready RAG systems with less code.

**Key Features:**
- Document loaders for various formats (PDF, HTML, CSV, etc.)
- Text splitters with multiple strategies
- Integration with 50+ vector stores
- Chain abstractions for complex workflows
- Memory management for conversations
- Agent framework for tool use

**Example:**
```python
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import Ollama
from langchain.chains import RetrievalQA

# Load and chunk documents
loader = TextLoader("doc.txt")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500)
chunks = splitter.split_documents(docs)

# Create vector store
embeddings = HuggingFaceEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)

# Create RAG chain
llm = Ollama(base_url="http://localhost:11435", model="llama2")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever()
)

# Query
response = qa_chain.run("What is RAG?")
```

**Pros:**
- Rapid development with pre-built components
- Extensive integrations
- Production-ready patterns
- Active community

**Cons:**
- Framework overhead
- Less fine-grained control
- Can be verbose for simple use cases

### 3. LlamaIndex

**LlamaIndex** (formerly GPT Index) is a data framework for LLM applications focused on indexing and retrieval. It provides specialized tools for building RAG systems with advanced querying capabilities like structured queries, multi-step reasoning, and data connectors.

**Key Features:**
- Specialized indexing strategies
- Query engines with advanced reasoning
- Data connectors for various sources
- Structured output support
- Agent capabilities

**Example:**
```python
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.llms import Ollama

# Load documents
documents = SimpleDirectoryReader("docs").load_data()

# Create index
llm = Ollama(base_url="http://localhost:11435", model="llama2")
service_context = ServiceContext.from_defaults(llm=llm)
index = VectorStoreIndex.from_documents(documents, service_context=service_context)

# Query
query_engine = index.as_query_engine()
response = query_engine.query("What is RAG?")
```

**Pros:**
- Excellent indexing strategies
- Advanced query capabilities
- Good for complex data structures
- Strong documentation

**Cons:**
- Steeper learning curve
- More opinionated framework
- Can be overkill for simple use cases

### 4. Haystack

**Haystack** by deepset is an end-to-end framework for building production-ready search systems and RAG applications. It emphasizes modularity, scalability, and enterprise features.

**Key Features:**
- Modular pipeline architecture
- Production-ready components
- Advanced retrieval strategies
- Built-in evaluation tools
- REST API support

**Example:**
```python
from haystack import Pipeline
from haystack.components.builders import PromptBuilder
from haystack.components.retrievers import InMemoryEmbeddingRetriever
from haystack.document_stores import InMemoryDocumentStore

# Build pipeline
pipeline = Pipeline()
pipeline.add_component("retriever", InMemoryEmbeddingRetriever(...))
pipeline.add_component("prompt_builder", PromptBuilder(...))
pipeline.add_component("llm", OllamaGenerator(...))

pipeline.connect("retriever", "prompt_builder")
pipeline.connect("prompt_builder", "llm")

# Run
result = pipeline.run({"retriever": {"query": "What is RAG?"}})
```

**Pros:**
- Production-focused
- Modular and extensible
- Good evaluation tools
- Enterprise features

**Cons:**
- More complex setup
- Smaller community than LangChain
- Steeper learning curve

### 5. RAGFlow

**RAGFlow** is an open-source RAG engine based on deep document understanding. It focuses on accurate document parsing and intelligent chunking for better retrieval quality.

**Key Features:**
- Deep document understanding
- Intelligent chunking
- Web UI for document management
- Multiple LLM backends
- Built-in evaluation

**Pros:**
- Excellent document parsing
- User-friendly interface
- Good for document-heavy use cases

**Cons:**
- Less flexible than frameworks
- Smaller ecosystem
- More specialized use case

---

## End-to-End RAG Pipeline Architecture

### Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           End-to-End RAG Pipeline with Ollama + FastAPI         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    CLIENT LAYER                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Web Browser  │  │ Mobile App   │  │ API Client   │    │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │ │
│  │         │                 │                 │            │ │
│  │         └─────────────────┴─────────────────┘            │ │
│  │                           │                               │ │
│  └───────────────────────────┼───────────────────────────────┘ │
│                               │                                 │
│                               ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                 FASTAPI APPLICATION                       │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  REST API Endpoints                                  │ │ │
│  │  │  - POST /query    (user queries)                     │ │ │
│  │  │  - POST /ingest   (document ingestion)               │ │ │
│  │  │  - GET  /health   (health check)                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                           │                               │ │
│  │                           ▼                               │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  RAG Service (LangChain)                              │ │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │ │
│  │  │  │  1. Query Processing                            │ │ │ │
│  │  │  │     - Validate input                            │ │ │ │
│  │  │  │     - Preprocess query                          │ │ │ │
│  │  │  └─────────────────────────────────────────────────┘ │ │ │
│  │  │                           │                           │ │ │
│  │  │                           ▼                           │ │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │ │
│  │  │  │  2. Query Embedding                             │ │ │ │
│  │  │  │     - Convert query to vector                   │ │ │ │
│  │  │  │     - Use embedding model                        │ │ │ │
│  │  │  └─────────────────────────────────────────────────┘ │ │ │
│  │  │                           │                           │ │ │
│  │  │                           ▼                           │ │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │ │
│  │  │  │  3. Vector Search                                │ │ │ │
│  │  │  │     - Search vector database                     │ │ │ │
│  │  │  │     - Retrieve top-K documents                   │ │ │ │
│  │  │  │     - Get similarity scores                     │ │ │ │
│  │  │  └─────────────────────────────────────────────────┘ │ │ │
│  │  │                           │                           │ │ │
│  │  │                           ▼                           │ │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │ │
│  │  │  │  4. Context Assembly                             │ │ │ │
│  │  │  │     - Combine retrieved chunks                  │ │ │ │
│  │  │  │     - Format for LLM                            │ │ │ │
│  │  │  │     - Build prompt with context                  │ │ │ │
│  │  │  └─────────────────────────────────────────────────┘ │ │ │
│  │  │                           │                           │ │ │
│  │  │                           ▼                           │ │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │ │
│  │  │  │  5. LLM Generation                               │ │ │ │
│  │  │  │     - Call Ollama API                           │ │ │ │
│  │  │  │     - Generate response                         │ │ │ │
│  │  │  │     - Stream tokens (optional)                  │ │ │ │
│  │  │  └─────────────────────────────────────────────────┘ │ │ │
│  │  │                           │                           │ │ │
│  │  │                           ▼                           │ │ │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │ │
│  │  │  │  6. Response Formatting                         │ │ │ │
│  │  │  │     - Add source citations                      │ │ │ │
│  │  │  │     - Format output                             │ │ │ │
│  │  │  │     - Return to client                          │ │ │ │
│  │  │  └─────────────────────────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                               │                                 │
│         ┌─────────────────────┴─────────────────────┐         │
│         │                                             │         │
│         ▼                                             ▼         │
│  ┌──────────────────┐                      ┌──────────────────┐ │
│  │  VECTOR DATABASE │                      │   OLLAMA SERVICE │ │
│  │  (Chroma)        │                      │   Port: 11435    │ │
│  │                  │                      │                  │ │
│  │  - Embeddings    │                      │  - LLM Models    │ │
│  │  - Metadata      │                      │  - Generation    │ │
│  │  - Index         │                      │  - Streaming     │ │
│  └──────────────────┘                      └──────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Sequential Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              Sequential RAG Pipeline Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Step 1: User Query                                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  User: "How do I reset my password?"                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 2: API Request                                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  POST /api/query                                           │ │
│  │  { "query": "How do I reset my password?" }               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 3: Query Embedding                                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Embedding Model: "How do I reset my password?"           │ │
│  │  → [0.12, -0.45, 0.78, ..., 0.23]                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 4: Vector Search                                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Vector DB: Find similar documents                        │ │
│  │  → Top 3 results:                                         │ │
│  │    1. "Password reset guide" (score: 0.89)               │ │
│  │    2. "Account recovery" (score: 0.76)                    │ │
│  │    3. "Login help" (score: 0.65)                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 5: Context Assembly                                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Build Prompt:                                            │ │
│  │  Context: [Retrieved document chunks]                     │ │
│  │  Question: "How do I reset my password?"                  │ │
│  │  Instructions: Answer based on context...                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 6: LLM Generation (Ollama)                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Ollama API Call (http://ollama:11435)                    │ │
│  │  Model: llama2                                            │ │
│  │  → Generates response token by token                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 7: Response Formatting                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Add source citations:                                    │ │
│  │  Response: "To reset your password..."                    │ │
│  │  Sources: [password_reset_guide.md]                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 8: Return to Client                                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  HTTP 200 OK                                               │ │
│  │  {                                                         │ │
│  │    "response": "To reset your password...",               │ │
│  │    "sources": ["password_reset_guide.md"],                │ │
│  │    "confidence": 0.89                                     │ │
│  │  }                                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Document Ingestion Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              Document Ingestion Pipeline                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Step 1: Document Upload                                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  POST /api/ingest                                          │ │
│  │  File: document.pdf                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 2: Document Loading                                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  LangChain Document Loader                                 │ │
│  │  - Parse PDF/TXT/MD/HTML                                   │ │
│  │  - Extract text and metadata                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 3: Text Chunking                                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  RecursiveCharacterTextSplitter                           │ │
│  │  - Split into chunks (500 chars)                          │ │
│  │  - Add overlap (50 chars)                                 │ │
│  │  - Preserve metadata                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 4: Generate Embeddings                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Embedding Model                                           │ │
│  │  - Convert each chunk to vector                           │ │
│  │  - Batch processing for efficiency                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 5: Store in Vector DB                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Chroma Vector Store                                       │ │
│  │  - Store embeddings                                        │ │
│  │  - Store original text                                     │ │
│  │  - Store metadata (source, chunk_id)                       │ │
│  │  - Index for fast retrieval                                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  Step 6: Confirmation                                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  HTTP 200 OK                                               │ │
│  │  { "status": "ingested", "chunks": 42 }                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Docker Compose Setup

### Complete Docker Compose Configuration

The following Docker Compose file sets up a complete RAG system with:
- **FastAPI** application for the API server
- **Ollama** service running on port 11435
- **Chroma** vector database
- **LangChain** integration
- All services containerized (no host dependencies)

```yaml
version: '3.8'

services:
  # Ollama Service - LLM Backend
  ollama:
    image: ollama/ollama:latest
    container_name: ollama_service
    ports:
      - "11435:11434"  # Map host 11435 to container 11434
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
    networks:
      - rag_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # Vector Database - Chroma
  chroma:
    image: chromadb/chroma:latest
    container_name: chroma_db
    ports:
      - "8000:8000"
    volumes:
      - chroma_data:/chroma/chroma
    environment:
      - IS_PERSISTENT=TRUE
      - ANONYMIZED_TELEMETRY=FALSE
    networks:
      - rag_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/heartbeat"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # FastAPI Application - RAG Service
  rag_api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: rag_fastapi
    ports:
      - "8001:8000"
    volumes:
      - ./documents:/app/documents:ro
      - ./app:/app/app
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - CHROMA_HOST=chroma
      - CHROMA_PORT=8000
      - EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
    depends_on:
      ollama:
        condition: service_healthy
      chroma:
        condition: service_healthy
    networks:
      - rag_network
    restart: unless-stopped
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

volumes:
  ollama_data:
    driver: local
  chroma_data:
    driver: local

networks:
  rag_network:
    driver: bridge
```

### Dockerfile for FastAPI Application

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Requirements.txt

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
langchain==0.1.0
langchain-community==0.0.10
chromadb==0.4.18
sentence-transformers==2.2.2
ollama==0.1.6
pydantic==2.5.0
python-multipart==0.0.6
```

### FastAPI Application Structure

```
app/
├── main.py           # FastAPI application entry point
├── rag_service.py    # RAG pipeline implementation
├── models.py         # Pydantic models
└── config.py         # Configuration settings
```

### Example FastAPI Application (app/main.py)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.rag_service import RAGService

app = FastAPI(title="RAG Chatbot API", version="1.0.0")

# Initialize RAG service
rag_service = RAGService()

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class QueryResponse(BaseModel):
    response: str
    sources: List[str]
    confidence: Optional[float] = None

class IngestRequest(BaseModel):
    document_path: str

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    try:
        result = await rag_service.query(
            query=request.query,
            top_k=request.top_k
        )
        return QueryResponse(
            response=result["response"],
            sources=result["sources"],
            confidence=result.get("confidence")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ingest")
async def ingest_document(request: IngestRequest):
    try:
        result = await rag_service.ingest_document(request.document_path)
        return {"status": "success", "chunks": result["chunks"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Usage Instructions

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```
   Starts all containers in detached mode.

2. **Pull Ollama model (first time):**
   ```bash
   docker exec -it ollama_service ollama pull llama2
   ```
   Downloads the llama2 model into the Ollama container.

3. **Ingest documents:**
   ```bash
   curl -X POST http://localhost:8001/api/ingest \
     -H "Content-Type: application/json" \
     -d '{"document_path": "/app/documents/faq.md"}'
   ```

4. **Query the RAG system:**
   ```bash
   curl -X POST http://localhost:8001/api/query \
     -H "Content-Type: application/json" \
     -d '{"query": "How do I reset my password?", "top_k": 5}'
   ```

5. **Check service health:**
   ```bash
   curl http://localhost:8001/health
   ```

### Service Endpoints

- **FastAPI**: http://localhost:8001
- **Ollama**: http://localhost:11435
- **Chroma**: http://localhost:8000

### Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Docker Network: rag_network                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐      ┌──────────────┐                │
│  │  rag_fastapi │──────│   ollama      │                │
│  │  :8000       │      │   :11434      │                │
│  └──────┬───────┘      └──────────────┘                │
│         │                                               │
│         │      ┌──────────────┐                        │
│         └──────│   chroma     │                        │
│                │   :8000       │                        │
│                └──────────────┘                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    Host:8001          Host:11435          Host:8000
```

---

## Summary

RAG (Retrieval-Augmented Generation) is a powerful approach that combines the strengths of:
- **Information Retrieval**: Fast, accurate document search
- **Language Generation**: Natural, context-aware responses

### Key Takeaways:

1. **RAG solves critical LLM limitations**: Knowledge cutoff, hallucinations, domain expertise
2. **RAG is more flexible than fine-tuning**: Easy updates, cost-effective, transparent
3. **RAG pipeline consists of**: Chunking → Embedding → Vector DB → Retrieval → Generation
4. **Multiple implementation options**: Direct SDKs, LangChain, LlamaIndex, Haystack, RAGFlow
5. **Production-ready setup**: Docker Compose enables isolated, scalable RAG systems

### Next Steps:

- Experiment with different chunking strategies
- Try various embedding models
- Optimize retrieval with hybrid search
- Implement re-ranking for better accuracy
- Add evaluation metrics for quality assessment

---

*This document provides a comprehensive introduction to RAG systems. For implementation details, refer to the code examples and Docker Compose configuration above.*
