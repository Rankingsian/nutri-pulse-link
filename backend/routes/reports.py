from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Patient, Nurse, HealthRecord, NutritionPlan, ChatHistory
from functools import wraps
from datetime import datetime, timedelta
import json

reports_bp = Blueprint('reports', __name__)

def nurse_required(f):
    """Decorator to ensure user is a nurse"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'nurse':
            return jsonify({'error': 'Nurse access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def patient_access_required(f):
    """Decorator to ensure user can access patient data"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        # Nurses can access any patient, patients can only access their own data
        if user.role == 'patient':
            patient_id = kwargs.get('id')
            if not user.patient or user.patient.id != int(patient_id):
                return jsonify({'error': 'Access denied'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

@reports_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
@patient_access_required
def generate_patient_report(id):
    """Generate a comprehensive health and nutrition report for a patient"""
    try:
        patient = Patient.query.get(id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Get recent health records (last 6 months)
        six_months_ago = datetime.utcnow() - timedelta(days=180)
        recent_records = patient.health_records.filter(
            HealthRecord.created_at >= six_months_ago
        ).order_by(HealthRecord.created_at.desc()).all()
        
        # Get recent nutrition plans (last 6 months)
        recent_plans = patient.nutrition_plans.filter(
            NutritionPlan.created_at >= six_months_ago
        ).order_by(NutritionPlan.created_at.desc()).all()
        
        # Get recent chat interactions (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_chats = ChatHistory.query.filter(
            ChatHistory.user_id == patient.user_id,
            ChatHistory.created_at >= thirty_days_ago
        ).order_by(ChatHistory.created_at.desc()).all()
        
        # Calculate statistics
        total_records = len(recent_records)
        total_plans = len(recent_plans)
        total_chat_interactions = len(recent_chats)
        
        # Get latest health record
        latest_record = recent_records[0] if recent_records else None
        
        # Get latest nutrition plan
        latest_plan = recent_plans[0] if recent_plans else None
        
        # Analyze chat topics (simple keyword analysis)
        health_keywords = ['health', 'symptom', 'pain', 'medicine', 'treatment', 'doctor']
        nutrition_keywords = ['diet', 'food', 'nutrition', 'vitamin', 'meal', 'eating']
        
        health_chat_count = 0
        nutrition_chat_count = 0
        
        for chat in recent_chats:
            if chat.role == 'user':
                message_lower = chat.message.lower()
                if any(keyword in message_lower for keyword in health_keywords):
                    health_chat_count += 1
                if any(keyword in message_lower for keyword in nutrition_keywords):
                    nutrition_chat_count += 1
        
        # Generate report
        report = {
            'patient_info': {
                'id': patient.id,
                'name': patient.user.name,
                'age': patient.age,
                'gender': patient.gender,
                'medical_history': patient.medical_history,
                'nutrition_needs': patient.nutrition_needs
            },
            'report_generated_at': datetime.utcnow().isoformat(),
            'report_period': {
                'health_records_period': 'Last 6 months',
                'nutrition_plans_period': 'Last 6 months',
                'chat_interactions_period': 'Last 30 days'
            },
            'statistics': {
                'total_health_records': total_records,
                'total_nutrition_plans': total_plans,
                'total_chat_interactions': total_chat_interactions,
                'health_related_chats': health_chat_count,
                'nutrition_related_chats': nutrition_chat_count
            },
            'latest_health_record': latest_record.to_dict() if latest_record else None,
            'latest_nutrition_plan': latest_plan.to_dict() if latest_plan else None,
            'recent_health_records': [record.to_dict() for record in recent_records[:5]],  # Last 5 records
            'recent_nutrition_plans': [plan.to_dict() for plan in recent_plans[:5]],  # Last 5 plans
            'recent_chat_summary': {
                'total_messages': total_chat_interactions,
                'health_queries': health_chat_count,
                'nutrition_queries': nutrition_chat_count,
                'engagement_level': 'High' if total_chat_interactions > 10 else 'Medium' if total_chat_interactions > 5 else 'Low'
            },
            'recommendations': {
                'health_monitoring': 'Continue regular health checkups' if total_records > 0 else 'Schedule initial health assessment',
                'nutrition_follow_up': 'Monitor nutrition plan adherence' if total_plans > 0 else 'Develop initial nutrition plan',
                'engagement': 'Patient shows good engagement with health system' if total_chat_interactions > 5 else 'Encourage patient to use chatbot for health queries'
            },
            'sdg_alignment': {
                'sdg_2_zero_hunger': {
                    'nutrition_plans_provided': total_plans > 0,
                    'nutrition_awareness_queries': nutrition_chat_count,
                    'status': 'Active' if total_plans > 0 or nutrition_chat_count > 0 else 'Needs attention'
                },
                'sdg_3_good_health': {
                    'health_records_maintained': total_records > 0,
                    'health_awareness_queries': health_chat_count,
                    'preventive_care_engagement': total_chat_interactions > 0,
                    'status': 'Active' if total_records > 0 or health_chat_count > 0 else 'Needs attention'
                }
            }
        }
        
        return jsonify({
            'message': 'Patient report generated successfully',
            'report': report
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to generate report', 'details': str(e)}), 500

@reports_bp.route('/<int:id>/summary', methods=['GET'])
@jwt_required()
@patient_access_required
def get_patient_summary(id):
    """Get a brief summary of patient's health and nutrition status"""
    try:
        patient = Patient.query.get(id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Get latest health record
        latest_record = patient.health_records.order_by(HealthRecord.created_at.desc()).first()
        
        # Get latest nutrition plan
        latest_plan = patient.nutrition_plans.order_by(NutritionPlan.created_at.desc()).first()
        
        # Get recent chat activity
        recent_chats = ChatHistory.query.filter(
            ChatHistory.user_id == patient.user_id,
            ChatHistory.created_at >= datetime.utcnow() - timedelta(days=7)
        ).count()
        
        summary = {
            'patient_name': patient.user.name,
            'age': patient.age,
            'gender': patient.gender,
            'last_health_checkup': latest_record.created_at.isoformat() if latest_record else None,
            'last_nutrition_plan': latest_plan.created_at.isoformat() if latest_plan else None,
            'recent_activity': {
                'chat_interactions_this_week': recent_chats,
                'engagement_status': 'Active' if recent_chats > 0 else 'Inactive'
            },
            'health_status': 'Under care' if latest_record else 'No recent records',
            'nutrition_status': 'Has plan' if latest_plan else 'No nutrition plan'
        }
        
        return jsonify({
            'message': 'Patient summary retrieved successfully',
            'summary': summary
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get patient summary', 'details': str(e)}), 500
