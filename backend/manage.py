#!/usr/bin/env python3
"""
Management script for NutriPulse Health & Nutrition System
Handles database migrations and other administrative tasks
"""

import os
import sys
from flask.cli import FlaskGroup
from app import create_app
from models import db

# Create Flask CLI group
cli = FlaskGroup(create_app=create_app)

@cli.command()
def init_db():
    """Initialize the database with all tables"""
    try:
        db.create_all()
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        sys.exit(1)

@cli.command()
def drop_db():
    """Drop all database tables (WARNING: This will delete all data!)"""
    try:
        db.drop_all()
        print("✅ Database tables dropped successfully!")
    except Exception as e:
        print(f"❌ Error dropping database tables: {e}")
        sys.exit(1)

@cli.command()
def create_sample_data():
    """Create sample data for testing"""
    try:
        from models import User, Patient, Nurse, HealthRecord, NutritionPlan
        
        # Create sample users
        nurse_user = User(
            name="Dr. Sarah Johnson",
            email="sarah.johnson@hospital.com",
            role="nurse"
        )
        nurse_user.set_password("password123")
        
        patient_user = User(
            name="John Smith",
            email="john.smith@email.com",
            role="patient"
        )
        patient_user.set_password("password123")
        
        db.session.add(nurse_user)
        db.session.add(patient_user)
        db.session.flush()
        
        # Create nurse profile
        nurse = Nurse(
            user_id=nurse_user.id,
            specialization="Nutrition and Dietetics",
            hospital="City General Hospital"
        )
        
        # Create patient profile
        patient = Patient(
            user_id=patient_user.id,
            age=35,
            gender="male",
            medical_history="No major health issues",
            nutrition_needs="Balanced diet with focus on protein"
        )
        
        db.session.add(nurse)
        db.session.add(patient)
        db.session.flush()
        
        # Create sample health record
        health_record = HealthRecord(
            patient_id=patient.id,
            nurse_id=nurse.id,
            checkup_notes="Patient shows good overall health. Blood pressure normal.",
            prescriptions="Multivitamin supplement recommended"
        )
        
        # Create sample nutrition plan
        nutrition_plan = NutritionPlan(
            patient_id=patient.id,
            nurse_id=nurse.id,
            diet_plan="High protein diet with lean meats, fish, and legumes. Include plenty of vegetables and whole grains."
        )
        
        db.session.add(health_record)
        db.session.add(nutrition_plan)
        db.session.commit()
        
        print("✅ Sample data created successfully!")
        print(f"   Nurse: {nurse_user.email} (password: password123)")
        print(f"   Patient: {patient_user.email} (password: password123)")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating sample data: {e}")
        sys.exit(1)

if __name__ == '__main__':
    cli()
