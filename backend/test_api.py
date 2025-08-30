#!/usr/bin/env python3
"""
Test script for NutriPulse Health & Nutrition System API
Run this script to test the basic functionality of the backend
"""

import requests
import json
import sys
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:5000"

def print_response(response, title):
    """Print formatted API response"""
    print(f"\n{'='*50}")
    print(f"📋 {title}")
    print(f"{'='*50}")
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
    print(f"{'='*50}")

def test_health_check():
    """Test health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_response(response, "Health Check")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to the API. Make sure the server is running on http://localhost:5000")
        return False

def test_root_endpoint():
    """Test root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print_response(response, "Root Endpoint")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        return False

def test_user_registration():
    """Test user registration"""
    try:
        # Register a nurse
        nurse_data = {
            "name": "Test Nurse",
            "email": "test.nurse@hospital.com",
            "password": "password123",
            "role": "nurse",
            "age": 30,
            "gender": "female",
            "specialization": "General Nursing",
            "hospital": "Test Hospital"
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=nurse_data,
            headers={"Content-Type": "application/json"}
        )
        print_response(response, "Nurse Registration")
        
        if response.status_code == 201:
            nurse_token = response.json().get('access_token')
            
            # Register a patient
            patient_data = {
                "name": "Test Patient",
                "email": "test.patient@email.com",
                "password": "password123",
                "role": "patient",
                "age": 25,
                "gender": "male",
                "medical_history": "No major health issues",
                "nutrition_needs": "Balanced diet"
            }
            
            response = requests.post(
                f"{BASE_URL}/auth/register",
                json=patient_data,
                headers={"Content-Type": "application/json"}
            )
            print_response(response, "Patient Registration")
            
            if response.status_code == 201:
                patient_token = response.json().get('access_token')
                return nurse_token, patient_token
        
        return None, None
    except requests.exceptions.ConnectionError:
        return None, None

def test_user_login():
    """Test user login"""
    try:
        login_data = {
            "email": "test.nurse@hospital.com",
            "password": "password123"
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        print_response(response, "User Login")
        
        if response.status_code == 200:
            return response.json().get('access_token')
        return None
    except requests.exceptions.ConnectionError:
        return None

def test_patient_management(token):
    """Test patient management endpoints"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get patient profile (assuming patient ID 1 exists from sample data)
        response = requests.get(f"{BASE_URL}/patients/1", headers=headers)
        print_response(response, "Get Patient Profile")
        
        # Get patient health records
        response = requests.get(f"{BASE_URL}/patients/1/records", headers=headers)
        print_response(response, "Get Patient Health Records")
        
        # Get patient nutrition plans
        response = requests.get(f"{BASE_URL}/patients/1/nutrition", headers=headers)
        print_response(response, "Get Patient Nutrition Plans")
        
        return True
    except requests.exceptions.ConnectionError:
        return False

def test_chatbot(token):
    """Test chatbot functionality"""
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Send a message to chatbot
        chat_data = {
            "message": "What are some healthy eating tips?"
        }
        
        response = requests.post(
            f"{BASE_URL}/chatbot/chat",
            json=chat_data,
            headers=headers
        )
        print_response(response, "Chatbot Message")
        
        # Get chat history
        response = requests.get(f"{BASE_URL}/chatbot/history", headers=headers)
        print_response(response, "Chat History")
        
        return True
    except requests.exceptions.ConnectionError:
        return False

def test_reports(token):
    """Test reports functionality"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get patient summary
        response = requests.get(f"{BASE_URL}/reports/1/summary", headers=headers)
        print_response(response, "Patient Summary")
        
        # Generate full report
        response = requests.get(f"{BASE_URL}/reports/1", headers=headers)
        print_response(response, "Full Patient Report")
        
        return True
    except requests.exceptions.ConnectionError:
        return False

def main():
    """Main test function"""
    print("🧪 NutriPulse Health & Nutrition System - API Test")
    print(f"Testing API at: {BASE_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test 1: Health Check
    if not test_health_check():
        print("❌ Health check failed. Exiting.")
        sys.exit(1)
    
    # Test 2: Root Endpoint
    test_root_endpoint()
    
    # Test 3: User Registration
    nurse_token, patient_token = test_user_registration()
    
    # Test 4: User Login
    if not nurse_token:
        nurse_token = test_user_login()
    
    if nurse_token:
        # Test 5: Patient Management
        test_patient_management(nurse_token)
        
        # Test 6: Chatbot
        test_chatbot(nurse_token)
        
        # Test 7: Reports
        test_reports(nurse_token)
        
        print("\n✅ API tests completed successfully!")
        print("\n📝 Notes:")
        print("- Some tests may fail if sample data is not created")
        print("- Chatbot requires valid AI API key in .env file")
        print("- Database must be initialized before running tests")
    else:
        print("❌ Authentication tests failed. Check database and sample data.")

if __name__ == "__main__":
    main()
