from typing import Dict, Optional
from app.services.query_classifier import query_classifier
from app.services.context_builder import ContextBuilder
from app.services.llm_service import llm_service
from app.services.firebase_service import firebase_service

class RAGEngine:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.context_builder = ContextBuilder(user_id)
    
    async def process_query(
        self,
        query: str,
        conversation_id: Optional[str] = None
    ) -> Dict:
        """Main RAG pipeline"""
        
        # Step 1: Classify query intent
        intent = await query_classifier.classify(query)
        
        # Step 2: Retrieve relevant context (parallel)
        context = await self.context_builder.build_context(
            query=query,
            intent=intent
        )
        
        # Step 3: Generate LLM response
        llm_response = await llm_service.generate_response(
            query=query,
            context=context,
            user_id=self.user_id
        )
        
        # Step 4: Save conversation
        conversation = await firebase_service.save_conversation(
            user_id=self.user_id,
            conversation_id=conversation_id,
            user_message=query,
            assistant_message=llm_response['response'],
            context_sources=context['sources']
        )
        
        return {
            "conversation_id": conversation['id'],
            "response": llm_response['response'],
            "context_sources": context['sources'],
            "timestamp": conversation['timestamp'],
            "tokens_used": llm_response['tokens_used']
        }
