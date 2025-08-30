from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from models import db, User, Patient, Nurse, HealthRecord, NutritionPlan
from functools import wraps

patients_bp = Blueprint('patients', __name__)

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

class HealthRecordSchema(Schema):
    """Schema for health record validation"""
    checkup_notes = fields.Str(required=True, validate=lambda x: len(x.strip()) > 0)
    prescriptions = fields.Str(required=False)

class NutritionPlanSchema(Schema):
    """Schema for nutrition plan validation"""
    diet_plan = fields.Str(required=True, validate=lambda x: len(x.strip()) > 0)

@patients_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
@patient_access_required
def get_patient(id):
    """Get patient profile by ID"""
    try:
        patient = Patient.query.get(id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        return jsonify(patient.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get patient', 'details': str(e)}), 500

@patients_bp.route('/<int:id>/records', methods=['GET'])
@jwt_required()
@patient_access_required
def get_patient_records(id):
    """Get health records for a patient"""
    try:
        patient = Patient.query.get(id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        records = patient.health_records.order_by(HealthRecord.created_at.desc()).all()
        
        return jsonify({
            'patient_id': id,
            'records': [record.to_dict() for record in records]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get records', 'details': str(e)}), 500

@patients_bp.route('/<int:id>/records', methods=['POST'])
@jwt_required()
@nurse_required
def add_health_record(id):
    """Add a new health record for a patient (nurses only)"""
    try:
        # Validate input data
        schema = HealthRecordSchema()
        data = schema.load(request.get_json())
        
        # Check if patient exists
        patient = Patient.query.get(id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Get current nurse
        user_id = get_jwt_identity()
        nurse = Nurse.query.filter_by(user_id=user_id).first()
        
        if not nurse:
            return jsonify({'error': 'Nurse profile not found'}), 404
        
        # Create health record
        record = HealthRecord(
            patient_id=id,
            nurse_id=nurse.id,
            checkup_notes=data['checkup_notes'],
            prescriptions=data.get('prescriptions', '')
        )
        
        db.session.add(record)
        db.session.commit()
        
        return jsonify({
            'message': 'Health record added successfully',
            'record': record.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add record', 'details': str(e)}), 500

@patients_bp.route('/<int:id>/nutrition', methods=['GET'])
@jwt_required()
@patient_access_required
def get_nutrition_plans(id):
    """Get nutrition plans for a patient"""
    try:
        patient = Patient.query.get(id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        plans = patient.nutrition_plans.order_by(NutritionPlan.created_at.desc()).all()
        
        return jsonify({
            'patient_id': id,
            'plans': [plan.to_dict() for plan in plans]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get nutrition plans', 'details': str(e)}), 500

@patients_bp.route('/<int:id>/nutrition', methods=['POST'])
@jwt_required()
@nurse_required
def add_nutrition_plan(id):
    """Add a new nutrition plan for a patient (nurses only)"""
    try:
        # Validate input data
        schema = NutritionPlanSchema()
        data = schema.load(request.get_json())
        
        # Check if patient exists
        patient = Patient.query.get(id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Get current nurse
        user_id = get_jwt_identity()
        nurse = Nurse.query.filter_by(user_id=user_id).first()
        
        if not nurse:
            return jsonify({'error': 'Nurse profile not found'}), 404
        
        # Create nutrition plan
        plan = NutritionPlan(
            patient_id=id,
            nurse_id=nurse.id,
            diet_plan=data['diet_plan']
        )
        
        db.session.add(plan)
        db.session.commit()
        
        return jsonify({
            'message': 'Nutrition plan added successfully',
            'plan': plan.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add nutrition plan', 'details': str(e)}), 500

@patients_bp.route('/<int:id>/update', methods=['PUT'])
@jwt_required()
@patient_access_required
def update_patient(id):
    """Update patient information"""
    try:
        patient = Patient.query.get(id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'age' in data:
            patient.age = data['age']
        if 'gender' in data:
            patient.gender = data['gender']
        if 'medical_history' in data:
            patient.medical_history = data['medical_history']
        if 'nutrition_needs' in data:
            patient.nutrition_needs = data['nutrition_needs']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Patient updated successfully',
            'patient': patient.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update patient', 'details': str(e)}), 500
