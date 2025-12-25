# FAQ Bot - Ollama RAG Overview

## **1. Introduction to RAG**
   - **Definition of RAG**: Combines document retrieval and generation models to answer questions.
   - **Why use RAG?**: Enhances accuracy by retrieving relevant documents and generating more precise answers.

## **2. Core Components of RAG**
   - **Retrieval Mechanism**:
     - **Vector Database**: Uses **ChromaDB** to store and search through document embeddings.
     - **Embedding Models**: Transforms text into vectors using models like **nomic-embed-text**.
   - **Generative Model**:
     - **Language Models**: Uses **llama2** for text generation, based on retrieved documents.

## **3. RAG Pipeline**
   - **Step 1 - Query Processing**: Converts the query into a vector.
   - **Step 2 - Document Retrieval**: Retrieves relevant documents from the vector database.
   - **Step 3 - Answer Generation**: The generative model produces an answer using the retrieved documents.
   - **Step 4 - Output**: The final generated answer is returned to the user.

## **4. RAG Model Types**
   - **RAG-Sequence**: Documents are retrieved and used sequentially in answer generation.
   - **RAG-Token**: Token-by-token generation with a document as context.

## **5. Key Advantages of RAG**
   - **Improved Accuracy**: Combines retrieval and generation for better factual accuracy.
   - **Better Handling of Long-Tail Queries**: Efficient for rare or very specific queries.
   - **Contextual Understanding**: Generates coherent answers based on retrieved documents.

## **6. Common Use Cases for RAG**
   - **Question Answering**: Ideal for FAQ systems.
   - **Chatbots**: Use RAG to power conversational agents.
   - **Document Summarization**: Can summarize large documents by generating concise summaries.

## **7. Technologies and Tools**
   - **ChromaDB**: Vector store used for document retrieval.
   - **Ollama**: Used to serve local models for text generation and document embedding.
   - **llama2**: A generative model used for answering questions.
   - **nomic-embed-text**: Embedding model for converting text into vectors.
   - **FastAPI**: Framework for building APIs and serving the bot.
   - **Uvicorn**: ASGI server for running the FastAPI app.

## **8. Setting up FAQ Bot - Ollama RAG**
   - **Install dependencies**: `pip install -r ../../requirements.txt`
   - **Run Ollama**: Ensure Ollama is running with `ollama serve`.
   - **Pull required models**:
     - `ollama pull llama2`
     - `ollama pull nomic-embed-text`
   - **Set environment variables**:
     - `export OLLAMA_MODEL=llama2`
     - `export OLLAMA_HOST=http://localhost:11434`
   - **Add FAQ Documents**: Place .md files in `documents/` folder.
   - **Run the service**: Start the bot with:
     - `python app.py`
     - or `uvicorn app:app --host 0.0.0.0 --port 8002`

## **9. API Endpoints**
   - **POST /ask**: Ask a question and get an answer.
     - **Request Body**: `{"question": "What is LangChain?"}`
     - **Response**: 
       ```json
       {
         "question": "What is LangChain?",
         "answer": "LangChain is a framework...",
         "sources": [
           {"content": "...", "source": "documents/faq.md"}
         ]
       }
       ```

   - **GET /health**: Check the health status of the service.

## **10. Usage Example**
   - Example code to query the FAQ bot using Python:
     ```python
     import requests
     
     response = requests.post(
         "http://localhost:8002/ask",
         json={"question": "What is RAG?"}
     )
     print(response.json()["answer"])
     ```

