from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
from app.rag_service import RAGService

app = FastAPI(title="RAG Chatbot API", version="1.0.0")

# Add CORS middleware to allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class QueryResponse(BaseModel):
    response: str
    sources: List[str]
    confidence: Optional[float] = None

# Ensure documents directory exists
DOCUMENTS_DIR = "/app/documents"
os.makedirs(DOCUMENTS_DIR, exist_ok=True)

# Initialize RAG service
rag_service = RAGService()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    try:
        result = rag_service.query(request.query, request.top_k)
        return QueryResponse(
            response=result["response"],
            sources=result["sources"],
            confidence=result.get("confidence")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ingest")
async def ingest_document(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        file_path = os.path.join(DOCUMENTS_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process document with RAG service
        result = rag_service.ingest_document(file_path)
        
        return {
            "status": "success",
            "message": f"File \"{file.filename}\" uploaded and processed successfully",
            "chunks": result["chunks"],
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")
