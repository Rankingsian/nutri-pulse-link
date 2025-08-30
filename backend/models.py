from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and role management"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('nurse', 'patient'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = db.relationship('Patient', backref='user', uselist=False, cascade='all, delete-orphan')
    nurse = db.relationship('Nurse', backref='user', uselist=False, cascade='all, delete-orphan')
    chat_messages = db.relationship('ChatHistory', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Patient(db.Model):
    """Patient model with health and nutrition information"""
    __tablename__ = 'patients'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.Enum('male', 'female', 'other'), nullable=False)
    medical_history = db.Column(db.Text)
    nutrition_needs = db.Column(db.Text)
    
    # Relationships
    health_records = db.relationship('HealthRecord', backref='patient', lazy='dynamic')
    nutrition_plans = db.relationship('NutritionPlan', backref='patient', lazy='dynamic')
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'age': self.age,
            'gender': self.gender,
            'medical_history': self.medical_history,
            'nutrition_needs': self.nutrition_needs,
            'user': self.user.to_dict() if self.user else None
        }

class Nurse(db.Model):
    """Nurse model with specialization and hospital information"""
    __tablename__ = 'nurses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    specialization = db.Column(db.String(100), nullable=False)
    hospital = db.Column(db.String(200), nullable=False)
    
    # Relationships
    health_records = db.relationship('HealthRecord', backref='nurse', lazy='dynamic')
    nutrition_plans = db.relationship('NutritionPlan', backref='nurse', lazy='dynamic')
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'specialization': self.specialization,
            'hospital': self.hospital,
            'user': self.user.to_dict() if self.user else None
        }

class HealthRecord(db.Model):
    """Health records model for patient checkups and prescriptions"""
    __tablename__ = 'health_records'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    nurse_id = db.Column(db.Integer, db.ForeignKey('nurses.id'), nullable=False)
    checkup_notes = db.Column(db.Text, nullable=False)
    prescriptions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'nurse_id': self.nurse_id,
            'checkup_notes': self.checkup_notes,
            'prescriptions': self.prescriptions,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'nurse': self.nurse.to_dict() if self.nurse else None
        }

class NutritionPlan(db.Model):
    """Nutrition plans model for patient diet recommendations"""
    __tablename__ = 'nutrition_plans'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    nurse_id = db.Column(db.Integer, db.ForeignKey('nurses.id'), nullable=False)
    diet_plan = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'nurse_id': self.nurse_id,
            'diet_plan': self.diet_plan,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'nurse': self.nurse.to_dict() if self.nurse else None
        }

class ChatHistory(db.Model):
    """Chat history model for AI chatbot conversations"""
    __tablename__ = 'chat_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.Enum('user', 'assistant'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'role': self.role,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
