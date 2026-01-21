import asyncio
from typing import Dict, List, Optional
from app.services.firebase_service import firebase_service
from app.services.vector_service import vector_service
from app.services.embedding_service import embedding_service

class ContextBuilder:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.max_context_items = 10
    
    async def build_context(self, query: str, intent: Dict) -> Dict:
        """Build context from Firebase + Vector DB"""
        
        # Generate query embedding (use query-specific embedding for Gemini)
        query_embedding = await embedding_service.generate_query_embedding(query)

        
        # Parallel retrieval
        tasks = []
        
        for intent_type in intent['intents']:
            if intent_type == "email_query":
                tasks.append(self._retrieve_emails(query_embedding, intent))
            elif intent_type == "task_query":
                tasks.append(self._retrieve_tasks(query_embedding, intent))
            elif intent_type == "calendar_query":
                tasks.append(self._retrieve_events(intent))
        
        # If no specific intent, try all
        if not tasks or intent['intents'] == ["general_query"]:
            tasks = [
                self._retrieve_emails(query_embedding, intent),
                self._retrieve_tasks(query_embedding, intent),
                self._retrieve_events(intent)
            ]
        
        # Execute all retrieval tasks in parallel
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Merge and rank
        all_items = []
        for result in results:
            if isinstance(result, list):
                all_items.extend(result)
        
        # Sort by relevance
        all_items.sort(key=lambda x: x.get('relevance', 0), reverse=True)
        
        # Limit to max items
        top_items = all_items[:self.max_context_items]
        
        return {
            "items": top_items,
            "sources": [
                {
                    "type": item.get('type', 'unknown'),
                    "id": item.get('emailId') or item.get('taskId') or item.get('eventId', ''),
                    "title": item.get('subject') or item.get('title', ''),
                    "relevance": item.get('relevance', 1.0)
                }
                for item in top_items
            ],
            "intent": intent
        }
    
    async def _retrieve_emails(self, query_embedding: List[float], intent: Dict) -> List[Dict]:
        """Retrieve relevant emails"""
        try:
            # Firebase structured query
            firebase_emails = await firebase_service.get_emails(
                user_id=self.user_id,
                filters={
                    "priority": "high" if intent['is_urgent'] else None,
                    "time_range": intent.get('time_range')
                },
                limit=5
            )
            
            # Vector semantic search
            vector_results = await vector_service.search_emails(
                user_id=self.user_id,
                query_embedding=query_embedding,
                filters={
                    "priority": "high" if intent['is_urgent'] else None
                },
                top_k=5
            )
            
            # Merge results
            merged = self._merge_results(firebase_emails, vector_results, 'emailId')
            
            return merged
        except Exception as e:
            print(f"Error retrieving emails: {e}")
            return []
    
    async def _retrieve_tasks(self, query_embedding: List[float], intent: Dict) -> List[Dict]:
        """Retrieve relevant tasks"""
        try:
            # Firebase structured query
            firebase_tasks = await firebase_service.get_tasks(
                user_id=self.user_id,
                filters={
                    "priority": "high" if intent['is_urgent'] else None
                },
                limit=5
            )
            
            # Vector semantic search
            vector_results = await vector_service.search_tasks(
                user_id=self.user_id,
                query_embedding=query_embedding,
                filters={
                    "priority": "high" if intent['is_urgent'] else None
                },
                top_k=5
            )
            
            # Merge results
            merged = self._merge_results(firebase_tasks, vector_results, 'taskId')
            
            return merged
        except Exception as e:
            print(f"Error retrieving tasks: {e}")
            return []
    
    async def _retrieve_events(self, intent: Dict) -> List[Dict]:
        """Retrieve relevant calendar events"""
        try:
            time_range = intent.get('time_range')
            
            events = await firebase_service.get_calendar_events(
                user_id=self.user_id,
                start_time=time_range['start'] if time_range else None,
                end_time=time_range['end'] if time_range else None,
                limit=5
            )
            
            # Add type and relevance
            for event in events:
                event['type'] = 'event'
                event['relevance'] = 0.7  # Base relevance for events
            
            return events
        except Exception as e:
            print(f"Error retrieving events: {e}")
            return []
    
    def _merge_results(self, firebase_items: List, vector_results: Dict, id_field: str) -> List[Dict]:
        """Merge Firebase and vector results, add relevance scores"""
        merged = {}
        
        # Add Firebase items
        for item in firebase_items:
            item['relevance'] = 0.5  # Base relevance
            item['type'] = 'email' if id_field == 'emailId' else 'task'
            merged[item.get(id_field, '')] = item
        
        # Enhance with vector scores
        if vector_results.get('ids') and len(vector_results['ids']) > 0:
            for i, vec_id in enumerate(vector_results['ids'][0]):
                # Extract ID from "userId_emailId"
                parts = vec_id.split('_')
                if len(parts) >= 2:
                    item_id = '_'.join(parts[1:])
                    
                    if item_id in merged:
                        # Boost relevance with vector score
                        distance = vector_results['distances'][0][i]
                        similarity = max(0, 1 - distance)  # Convert distance to similarity
                        merged[item_id]['relevance'] = max(merged[item_id]['relevance'], similarity)
        
        return list(merged.values())
