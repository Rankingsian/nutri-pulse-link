from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from models import db, User, ChatHistory
import requests
import os
import json

chatbot_bp = Blueprint('chatbot', __name__)

class ChatMessageSchema(Schema):
    """Schema for chat message validation"""
    message = fields.Str(required=True, validate=lambda x: len(x.strip()) > 0)

def get_ai_response(user_message, user_role):
    """Get AI response from external API"""
    try:
        api_key = os.environ.get('AI_API_KEY')
        api_url = os.environ.get('AI_API_URL')
        model = os.environ.get('AI_MODEL', 'gpt-3.5-turbo')
        
        if not api_key:
            return "I'm sorry, the AI service is currently unavailable. Please contact your healthcare provider for assistance."
        
        # Create system prompt for health and nutrition context
        system_prompt = f"""You are a helpful AI assistant for a Nurse-Patient Health & Nutrition Interaction System. 
        You are speaking with a {user_role}. 
        
        IMPORTANT GUIDELINES:
        - Provide general health awareness and nutrition advice
        - Give preventive care recommendations
        - DO NOT provide medical diagnosis or treatment
        - Always recommend consulting healthcare professionals for medical concerns
        - Focus on SDG 2 (Zero Hunger) and SDG 3 (Good Health and Well-being)
        - Be supportive and educational
        - Keep responses concise but informative
        
        Your role is to provide health education and nutrition guidance, not medical treatment."""
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'model': model,
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_message}
            ],
            'max_tokens': 500,
            'temperature': 0.7
        }
        
        response = requests.post(api_url, headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            ai_message = result['choices'][0]['message']['content']
            return ai_message
        else:
            return "I'm sorry, I'm having trouble processing your request. Please try again later."
            
    except requests.exceptions.RequestException:
        return "I'm sorry, I'm currently unable to connect to my knowledge base. Please try again later."
    except Exception as e:
        return "I'm sorry, an error occurred while processing your request. Please try again later."

@chatbot_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    """Send a message to the AI chatbot and get response"""
    try:
        # Validate input data
        schema = ChatMessageSchema()
        data = schema.load(request.get_json())
        
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_message = data['message']
        
        # Store user message
        user_chat = ChatHistory(
            user_id=user_id,
            role='user',
            message=user_message
        )
        db.session.add(user_chat)
        db.session.flush()
        
        # Get AI response
        ai_response = get_ai_response(user_message, user.role)
        
        # Store AI response
        ai_chat = ChatHistory(
            user_id=user_id,
            role='assistant',
            message=ai_response
        )
        db.session.add(ai_chat)
        db.session.commit()
        
        return jsonify({
            'message': 'Chat response generated successfully',
            'user_message': user_message,
            'ai_response': ai_response,
            'timestamp': user_chat.created_at.isoformat()
        }), 200
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Chat failed', 'details': str(e)}), 500

@chatbot_bp.route('/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """Get chat history for the current user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get recent chat history (last 50 messages)
        chat_history = ChatHistory.query.filter_by(user_id=user_id)\
            .order_by(ChatHistory.created_at.desc())\
            .limit(50)\
            .all()
        
        # Group messages by conversation (pair user and assistant messages)
        conversations = []
        current_conversation = []
        
        for chat in reversed(chat_history):  # Reverse to get chronological order
            current_conversation.append(chat.to_dict())
            
            # If we have a pair (user + assistant) or it's the last message
            if len(current_conversation) == 2 or chat == chat_history[-1]:
                conversations.append(current_conversation)
                current_conversation = []
        
        return jsonify({
            'user_id': user_id,
            'conversations': conversations
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get chat history', 'details': str(e)}), 500

@chatbot_bp.route('/clear-history', methods=['DELETE'])
@jwt_required()
def clear_chat_history():
    """Clear chat history for the current user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Delete all chat history for the user
        ChatHistory.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        
        return jsonify({
            'message': 'Chat history cleared successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to clear chat history', 'details': str(e)}), 500
