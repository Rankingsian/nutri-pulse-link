# NutriPulse Health & Nutrition System - Backend

A comprehensive Flask-based backend system for Nurse-Patient Health & Nutrition Interaction, supporting **SDG 2 (Zero Hunger)** and **SDG 3 (Good Health and Well-being)**.

## 🏥 System Overview

This backend provides a complete API for managing health records, nutrition plans, and AI-powered health consultations between nurses and patients. The system promotes preventive healthcare and nutrition awareness through an intelligent chatbot.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **Patient Management** - Complete patient profiles with health and nutrition information
- **Health Records** - Nurses can create and manage patient health records
- **Nutrition Planning** - Personalized nutrition plans and dietary recommendations
- **AI Chatbot** - Intelligent health and nutrition advice using external AI APIs
- **Comprehensive Reporting** - Detailed health and nutrition reports with SDG alignment
- **Mobile-Friendly API** - JSON responses with CORS support

## 🛠 Tech Stack

- **Framework**: Flask 2.3.3
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: Flask-JWT-Extended
- **Migrations**: Flask-Migrate
- **CORS**: Flask-CORS
- **Validation**: Marshmallow
- **AI Integration**: OpenAI API (configurable)

## 📋 Prerequisites

- Python 3.8+
- MySQL 8.0+
- OpenAI API key (for chatbot functionality)

## 🚀 Installation & Setup

### 1. Clone and Navigate
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE nutri_pulse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Environment Configuration
Copy the example environment file and configure it:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nutri_pulse_db
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=3600

# AI API Configuration
AI_API_KEY=your_openai_api_key_here
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-3.5-turbo

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-super-secret-flask-key-change-this-in-production
```

### 6. Initialize Database
```bash
python manage.py init-db
```

### 7. Create Sample Data (Optional)
```bash
python manage.py create-sample-data
```

### 8. Run the Application
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "age": 35,
  "gender": "male",
  "medical_history": "No major issues",
  "nutrition_needs": "Balanced diet"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <jwt_token>
```

### Patient Management

#### Get Patient Profile
```http
GET /patients/{id}
Authorization: Bearer <jwt_token>
```

#### Get Patient Health Records
```http
GET /patients/{id}/records
Authorization: Bearer <jwt_token>
```

#### Add Health Record (Nurses Only)
```http
POST /patients/{id}/records
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "checkup_notes": "Patient shows good health",
  "prescriptions": "Multivitamin recommended"
}
```

#### Get Nutrition Plans
```http
GET /patients/{id}/nutrition
Authorization: Bearer <jwt_token>
```

#### Add Nutrition Plan (Nurses Only)
```http
POST /patients/{id}/nutrition
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "diet_plan": "High protein diet with vegetables"
}
```

### AI Chatbot

#### Send Message
```http
POST /chatbot/chat
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "What should I eat for better nutrition?"
}
```

#### Get Chat History
```http
GET /chatbot/history
Authorization: Bearer <jwt_token>
```

#### Clear Chat History
```http
DELETE /chatbot/clear-history
Authorization: Bearer <jwt_token>
```

### Reports

#### Generate Patient Report
```http
GET /reports/{id}
Authorization: Bearer <jwt_token>
```

#### Get Patient Summary
```http
GET /reports/{id}/summary
Authorization: Bearer <jwt_token>
```

## 🔐 Role-Based Access Control

### Nurse Permissions
- View and manage all patient profiles
- Create and update health records
- Assign nutrition plans
- Generate comprehensive reports
- Access chatbot for health guidance

### Patient Permissions
- View own profile and records
- Access own nutrition plans
- Use chatbot for health queries
- View own reports and summaries

## 🤖 AI Chatbot Features

The AI chatbot provides:
- **Health Awareness** - General health information and preventive care
- **Nutrition Advice** - Dietary recommendations and meal planning
- **Educational Content** - Health and nutrition education
- **Preventive Care** - Wellness tips and lifestyle recommendations

**Important**: The chatbot provides educational content only and does not offer medical diagnosis or treatment.

## 📊 SDG Alignment

### SDG 2: Zero Hunger
- Nutrition planning and dietary recommendations
- Food security awareness
- Healthy eating education
- Nutritional needs assessment

### SDG 3: Good Health and Well-being
- Health monitoring and records
- Preventive care recommendations
- Health awareness education
- Wellness promotion

## 🧪 Testing

### Sample Data
The system includes sample data for testing:
- **Nurse**: sarah.johnson@hospital.com (password: password123)
- **Patient**: john.smith@email.com (password: password123)

### API Testing
Use tools like Postman or curl to test the endpoints:

```bash
# Test health check
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"patient","age":30,"gender":"male"}'
```

## 🔧 Management Commands

```bash
# Initialize database
python manage.py init-db

# Drop database (WARNING: deletes all data)
python manage.py drop-db

# Create sample data
python manage.py create-sample-data
```

## 🚀 Deployment

### Production Setup
1. Set `FLASK_ENV=production` in `.env`
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Use environment-specific database credentials

### Environment Variables
- `FLASK_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `DB_*`: Database configuration
- `JWT_*`: JWT configuration
- `AI_*`: AI API configuration

## 📝 Error Handling

The API includes comprehensive error handling:
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server-side error

## 🔒 Security Features

- Password hashing with Werkzeug
- JWT token authentication
- Role-based access control
- Input validation with Marshmallow
- CORS configuration
- Environment variable protection

## 📈 Monitoring

### Health Check
```http
GET /health
```

Returns system status and version information.

### Logging
Configure logging for production monitoring and debugging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review error logs
- Test with sample data
- Contact the development team

---

**NutriPulse Health & Nutrition System** - Empowering healthcare through technology and nutrition awareness.
