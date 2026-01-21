import google.generativeai as genai
from app.config import settings
from typing import List

class EmbeddingService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.embedding_model = "models/embedding-001"
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using Gemini"""
        # Truncate to reasonable length
        text = text[:10000]
        
        result = genai.embed_content(
            model=self.embedding_model,
            content=text,
            task_type="retrieval_document"
        )
        
        return result['embedding']
    
    async def generate_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        embeddings = []
        
        for text in texts:
            # Truncate each text
            text = text[:10000]
            
            result = genai.embed_content(
                model=self.embedding_model,
                content=text,
                task_type="retrieval_document"
            )
            
            embeddings.append(result['embedding'])
        
        return embeddings
    
    async def generate_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for query text"""
        result = genai.embed_content(
            model=self.embedding_model,
            content=query,
            task_type="retrieval_query"
        )
        
        return result['embedding']

embedding_service = EmbeddingService()
