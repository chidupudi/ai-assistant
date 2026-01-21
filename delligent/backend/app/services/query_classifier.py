import re
from typing import Dict, List
from datetime import datetime, timedelta

class QueryClassifier:
    def __init__(self):
        self.intent_patterns = {
            "email_query": [
                r"email",
                r"inbox",
                r"message",
                r"mail"
            ],
            "calendar_query": [
                r"meeting",
                r"calendar",
                r"schedule",
                r"appointment"
            ],
            "task_query": [
                r"task",
                r"todo",
                r"assignment",
                r"work"
            ],
            "deadline_query": [
                r"deadline",
                r"due",
                r"overdue"
            ]
        }
        
        self.urgency_keywords = ["urgent", "asap", "important", "critical", "high priority"]
        self.time_keywords = {
            "today": 0,
            "tomorrow": 1,
            "this week": 7,
            "next week": 14
        }
    
    async def classify(self, query: str) -> Dict:
        """Classify query intent and extract parameters"""
        query_lower = query.lower()
        
        # Detect intent
        detected_intents = []
        for intent, patterns in self.intent_patterns.items():
            if any(re.search(pattern, query_lower) for pattern in patterns):
                detected_intents.append(intent)
        
        # If no specific intent, it's a general query
        if not detected_intents:
            detected_intents = ["general_query"]
        
        # Detect urgency
        is_urgent = any(keyword in query_lower for keyword in self.urgency_keywords)
        
        # Detect time range
        time_range = None
        for keyword, days in self.time_keywords.items():
            if keyword in query_lower:
                time_range = {
                    "keyword": keyword,
                    "days": days,
                    "start": datetime.now().replace(hour=0, minute=0, second=0, microsecond=0),
                    "end": datetime.now() + timedelta(days=days)
                }
                break
        
        return {
            "intents": detected_intents,
            "is_urgent": is_urgent,
            "time_range": time_range,
            "original_query": query
        }

query_classifier = QueryClassifier()
