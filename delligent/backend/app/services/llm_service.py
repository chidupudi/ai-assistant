import google.generativeai as genai
from app.config import settings
from typing import Dict, List

class LLMService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def generate_response(
        self,
        query: str,
        context: Dict,
        user_id: str
    ) -> Dict:
        """Generate LLM response using RAG context with Gemini"""
        
        # Build system prompt
        system_prompt = self._build_system_prompt()
        
        # Build user prompt with context
        user_prompt = self._build_user_prompt(query, context)
        
        # Combine prompts
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        # Call Gemini API
        response = self.model.generate_content(full_prompt)
        
        # Estimate tokens (Gemini doesn't provide exact count in response)
        estimated_tokens = len(full_prompt.split()) + len(response.text.split())
        
        return {
            "response": response.text,
            "tokens_used": estimated_tokens
        }
    
    def _build_system_prompt(self) -> str:
        return """You are a helpful personal work assistant for an employee.

Your responsibilities:
- Summarize emails, tasks, and calendar events
- Identify urgent items and action points
- Provide clear, concise, and actionable information
- Prioritize based on importance and deadlines

Guidelines:
- Be professional but friendly
- Use bullet points for clarity
- Highlight urgent items with appropriate emphasis
- Always extract clear action items
- Keep responses under 300 words
- Do not make up information not in the context
"""
    
    def _build_user_prompt(self, query: str, context: Dict) -> str:
        """Build user prompt with retrieved context"""
        
        context_text = "Here is relevant information from the employee's data:\n\n"
        
        for item in context['items']:
            if item.get('type') == 'email':
                context_text += f"""
📧 Email:
- Subject: {item.get('subject')}
- From: {item.get('sender', {}).get('name')} ({item.get('sender', {}).get('email')})
- Received: {item.get('receivedAt')}
- Priority: {item.get('priority')}
- Preview: {item.get('bodyPreview', '')[:200]}

"""
            elif item.get('type') == 'task':
                context_text += f"""
📋 Task:
- Title: {item.get('title')}
- Due: {item.get('dueDate')}
- Priority: {item.get('priority')}
- Status: {item.get('status')}

"""
            elif item.get('type') == 'event':
                context_text += f"""
📅 Event:
- Title: {item.get('title')}
- Start: {item.get('startTime')}
- Location: {item.get('location', 'N/A')}

"""
        
        if not context['items']:
            context_text += "No relevant items found in the database.\n\n"
        
        return f"""User's question: "{query}"

{context_text}

Please provide a helpful response based on the above context."""

llm_service = LLMService()
