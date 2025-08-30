from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from marshmallow import Schema, fields, ValidationError
from models import db, User, Patient, Nurse
import re

auth_bp = Blueprint('auth', __name__)

class UserRegistrationSchema(Schema):
    """Schema for user registration validation"""
    name = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 2)
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 6)
    role = fields.Str(required=True, validate=lambda x: x in ['nurse', 'patient'])
    age = fields.Int(required=True, validate=lambda x: 0 < x < 150)
    gender = fields.Str(required=True, validate=lambda x: x in ['male', 'female', 'other'])
    
    # Nurse-specific fields
    specialization = fields.Str(required=False)
    hospital = fields.Str(required=False)
    
    # Patient-specific fields
    medical_history = fields.Str(required=False)
    nutrition_needs = fields.Str(required=False)

class UserLoginSchema(Schema):
    """Schema for user login validation"""
    email = fields.Email(required=True)
    password = fields.Str(required=True)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user (nurse or patient)"""
    try:
        # Validate input data
        schema = UserRegistrationSchema()
        data = schema.load(request.get_json())
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create user
        user = User(
            name=data['name'],
            email=data['email'],
            role=data['role']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.flush()  # Get the user ID
        
        # Create role-specific profile
        if data['role'] == 'patient':
            patient = Patient(
                user_id=user.id,
                age=data['age'],
                gender=data['gender'],
                medical_history=data.get('medical_history', ''),
                nutrition_needs=data.get('nutrition_needs', '')
            )
            db.session.add(patient)
        else:  # nurse
            if not data.get('specialization') or not data.get('hospital'):
                return jsonify({'error': 'Specialization and hospital are required for nurses'}), 400
            
            nurse = Nurse(
                user_id=user.id,
                specialization=data['specialization'],
                hospital=data['hospital']
            )
            db.session.add(nurse)
        
        db.session.commit()
        
        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    try:
        # Validate input data
        schema = UserLoginSchema()
        data = schema.load(request.get_json())
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        profile_data = user.to_dict()
        
        # Add role-specific data
        if user.role == 'patient' and user.patient:
            profile_data['patient_data'] = user.patient.to_dict()
        elif user.role == 'nurse' and user.nurse:
            profile_data['nurse_data'] = user.nurse.to_dict()
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get profile', 'details': str(e)}), 500
