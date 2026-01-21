from pinecone import Pinecone, ServerlessSpec
from app.config import settings
from typing import List, Dict, Optional
import time

class VectorService:
    def __init__(self):
        # Initialize Pinecone
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        
        # Get or create index
        index_name = settings.PINECONE_INDEX_NAME
        
        # Check if index exists
        existing_indexes = [index.name for index in self.pc.list_indexes()]
        
        if index_name not in existing_indexes:
            # Create index if it doesn't exist
            # Gemini embeddings are 768 dimensions
            self.pc.create_index(
                name=index_name,
                dimension=768,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=settings.PINECONE_ENVIRONMENT or "us-east-1"
                )
            )
            
            # Wait for index to be ready
            while not self.pc.describe_index(index_name).status['ready']:
                time.sleep(1)
        
        # Connect to index
        self.index = self.pc.Index(index_name)
    
    async def add_email_embedding(
        self,
        email_id: str,
        user_id: str,
        text: str,
        embedding: List[float],
        metadata: Dict
    ):
        """Add email embedding to Pinecone"""
        vector_id = f"{user_id}_email_{email_id}"
        
        self.index.upsert(
            vectors=[
                {
                    "id": vector_id,
                    "values": embedding,
                    "metadata": {
                        "userId": user_id,
                        "emailId": email_id,
                        "type": "email",
                        "priority": metadata.get("priority", "medium"),
                        "sender": metadata.get("sender", ""),
                        "receivedAt": str(metadata.get("receivedAt", "")),
                        "labels": ",".join(metadata.get("labels", [])),
                        "text": text[:1000]  # Store snippet for reference
                    }
                }
            ]
        )
    
    async def add_task_embedding(
        self,
        task_id: str,
        user_id: str,
        text: str,
        embedding: List[float],
        metadata: Dict
    ):
        """Add task embedding to Pinecone"""
        vector_id = f"{user_id}_task_{task_id}"
        
        self.index.upsert(
            vectors=[
                {
                    "id": vector_id,
                    "values": embedding,
                    "metadata": {
                        "userId": user_id,
                        "taskId": task_id,
                        "type": "task",
                        "priority": metadata.get("priority", "medium"),
                        "status": metadata.get("status", "pending"),
                        "dueDate": str(metadata.get("dueDate", "")),
                        "text": text[:1000]
                    }
                }
            ]
        )
    
    async def add_event_embedding(
        self,
        event_id: str,
        user_id: str,
        text: str,
        embedding: List[float],
        metadata: Dict
    ):
        """Add event embedding to Pinecone"""
        vector_id = f"{user_id}_event_{event_id}"
        
        self.index.upsert(
            vectors=[
                {
                    "id": vector_id,
                    "values": embedding,
                    "metadata": {
                        "userId": user_id,
                        "eventId": event_id,
                        "type": "event",
                        "startTime": str(metadata.get("startTime", "")),
                        "text": text[:1000]
                    }
                }
            ]
        )
    
    async def search_emails(
        self,
        user_id: str,
        query_embedding: List[float],
        filters: Optional[Dict] = None,
        top_k: int = 5
    ) -> Dict:
        """Semantic search for emails in Pinecone"""
        # Build filter
        filter_dict = {
            "userId": {"$eq": user_id},
            "type": {"$eq": "email"}
        }
        
        if filters:
            if "priority" in filters and filters["priority"]:
                filter_dict["priority"] = {"$eq": filters["priority"]}
        
        try:
            results = self.index.query(
                vector=query_embedding,
                filter=filter_dict,
                top_k=top_k,
                include_metadata=True
            )
            
            # Convert to format similar to ChromaDB
            return {
                "ids": [[match.id for match in results.matches]],
                "distances": [[1 - match.score for match in results.matches]],  # Convert similarity to distance
                "metadatas": [[match.metadata for match in results.matches]],
                "documents": [[match.metadata.get("text", "") for match in results.matches]]
            }
        except Exception as e:
            print(f"Error searching emails in Pinecone: {e}")
            return {"ids": [[]], "distances": [[]], "metadatas": [[]], "documents": [[]]}
    
    async def search_tasks(
        self,
        user_id: str,
        query_embedding: List[float],
        filters: Optional[Dict] = None,
        top_k: int = 5
    ) -> Dict:
        """Semantic search for tasks in Pinecone"""
        filter_dict = {
            "userId": {"$eq": user_id},
            "type": {"$eq": "task"}
        }
        
        if filters:
            if "priority" in filters and filters["priority"]:
                filter_dict["priority"] = {"$eq": filters["priority"]}
        
        try:
            results = self.index.query(
                vector=query_embedding,
                filter=filter_dict,
                top_k=top_k,
                include_metadata=True
            )
            
            return {
                "ids": [[match.id for match in results.matches]],
                "distances": [[1 - match.score for match in results.matches]],
                "metadatas": [[match.metadata for match in results.matches]],
                "documents": [[match.metadata.get("text", "") for match in results.matches]]
            }
        except Exception as e:
            print(f"Error searching tasks in Pinecone: {e}")
            return {"ids": [[]], "distances": [[]], "metadatas": [[]], "documents": [[]]}
    
    async def delete_user_data(self, user_id: str):
        """Delete all data for a user (GDPR compliance)"""
        try:
            # Pinecone doesn't support wildcard deletion, so we need to query first
            # This is a simplified version - in production, you'd need pagination
            for data_type in ["email", "task", "event"]:
                results = self.index.query(
                    vector=[0] * 768,  # Dummy vector
                    filter={
                        "userId": {"$eq": user_id},
                        "type": {"$eq": data_type}
                    },
                    top_k=10000,
                    include_metadata=False
                )
                
                if results.matches:
                    ids_to_delete = [match.id for match in results.matches]
                    self.index.delete(ids=ids_to_delete)
        except Exception as e:
            print(f"Error deleting user data from Pinecone: {e}")

vector_service = VectorService()
