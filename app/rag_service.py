import os
from typing import List, Dict, Optional
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

class RAGService:
    def __init__(self):
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")
        self.embedding_model = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        self.documents_dir = "/app/documents"
        
        # Initialize embeddings
        try:
            self.embeddings = HuggingFaceEmbeddings(
                model_name=self.embedding_model,
                model_kwargs={"device": "cpu"}
            )
        except Exception as e:
            print(f"Warning: Could not initialize embeddings: {e}")
            self.embeddings = None
        
        # Use local persistent Chroma
        self.vectorstore = None
        self.collection_name = "rag_documents"
        self._initialize_vectorstore()
        
        # Initialize LLM
        self.llm = Ollama(
            base_url=self.ollama_base_url,
            model="tinyllama"
        )
        
        # Initialize QA chain
        self.qa_chain = None
        self._initialize_qa_chain()
    
    def _initialize_vectorstore(self):
        """Initialize Chroma vector store - use local persistent storage"""
        try:
            if not self.embeddings:
                return
            
            # Use local persistent Chroma
            persist_dir = "/app/chroma_db"
            os.makedirs(persist_dir, exist_ok=True)
            
            # Load existing or create new
            try:
                self.vectorstore = Chroma(
                    persist_directory=persist_dir,
                    embedding_function=self.embeddings,
                    collection_name=self.collection_name
                )
            except Exception:
                # Create new if doesn't exist
                self.vectorstore = Chroma.from_texts(
                    texts=[""],
                    embedding=self.embeddings,
                    persist_directory=persist_dir,
                    collection_name=self.collection_name
                )
        except Exception as e:
            print(f"Error initializing Chroma: {e}")
            import traceback
            traceback.print_exc()
            self.vectorstore = None
    
    def _initialize_qa_chain(self):
        """Initialize the QA chain"""
        if not self.vectorstore or not self.embeddings:
            return
        
        prompt_template = """Use the following pieces of context to answer the question at the end. 
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}

Question: {question}

Answer:"""
        
        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
        
        try:
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(search_kwargs={"k": 5}),
                chain_type_kwargs={"prompt": PROMPT},
                return_source_documents=True
            )
        except Exception as e:
            print(f"Warning: Could not initialize QA chain: {e}")
            self.qa_chain = None
    
    def ingest_document(self, file_path: str) -> Dict:
        """Process and ingest a document"""
        try:
            if not self.vectorstore:
                raise Exception("Vector store not initialized.")
            
            if file_path.endswith(".pdf"):
                loader = PyPDFLoader(file_path)
            else:
                loader = TextLoader(file_path, encoding="utf-8")
            
            documents = loader.load()
            
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=50,
                length_function=len,
            )
            chunks = text_splitter.split_documents(documents)
            
            for chunk in chunks:
                chunk.metadata["source"] = os.path.basename(file_path)
            
            if self.vectorstore:
                self.vectorstore.add_documents(chunks)
                if hasattr(self.vectorstore, "persist"):
                    self.vectorstore.persist()
                self._initialize_qa_chain()
            
            return {
                "chunks": len(chunks),
                "status": "success"
            }
        except Exception as e:
            raise Exception(f"Failed to ingest document: {str(e)}")
    
    def query(self, query: str, top_k: int = 5) -> Dict:
        """Query the RAG system"""
        try:
            if not self.qa_chain:
                return {
                    "response": "No documents have been ingested yet. Please upload documents first.",
                    "sources": [],
                    "confidence": None
                }
            
            result = self.qa_chain({"query": query})
            
            sources = []
            if "source_documents" in result:
                for doc in result["source_documents"]:
                    if "source" in doc.metadata:
                        source = doc.metadata["source"]
                        if source not in sources:
                            sources.append(source)
            
            return {
                "response": result.get("result", "No response generated"),
                "sources": sources,
                "confidence": None
            }
        except Exception as e:
            if "model" in str(e).lower() or "ollama" in str(e).lower():
                return {
                    "response": f"Error: Ollama model not loaded. Please run: docker exec ollama_service ollama pull llama2",
                    "sources": [],
                    "confidence": None
                }
            return {
                "response": f"Error: {str(e)}",
                "sources": [],
                "confidence": None
            }
