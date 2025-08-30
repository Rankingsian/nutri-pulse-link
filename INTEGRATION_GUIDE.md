# Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the Flask backend for the NutriPulse Health & Nutrition System.

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Edit .env with your database and API credentials

# Initialize database
python manage.py init-db

# Create sample data (optional)
python manage.py create-sample-data

# Start backend server
python app.py
```

The backend will be running at `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (root of project)
cd ..

# Install dependencies
npm install

# Configure environment
cp env.example .env.local
# Edit .env.local with your API URL

# Start frontend development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🔧 Configuration

### Backend Environment (.env)

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

### Frontend Environment (.env.local)

```env
VITE_API_URL=http://localhost:5000
```

## 🔐 Authentication Flow

1. **Registration**: Users can register as either nurses or patients
2. **Login**: JWT tokens are stored in localStorage
3. **Protected Routes**: Role-based access control
4. **Auto-logout**: Invalid tokens are cleared automatically

### Sample API Calls

```typescript
// Login
const response = await api.login({
  email: "user@example.com",
  password: "password123"
});

// Register
const response = await api.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "patient",
  age: 30,
  gender: "male",
  medical_history: "None",
  nutrition_needs: "Balanced diet"
});

// Get patient data
const patient = await api.getPatient(1);
const records = await api.getPatientRecords(1);
const plans = await api.getNutritionPlans(1);
```

## 📱 Frontend Components

### Authentication Context

The `AuthContext` manages user state throughout the application:

```typescript
const { user, patientData, nurseData, login, register, logout } = useAuth();
```

### Protected Routes

Routes are protected based on authentication and role:

```typescript
<ProtectedRoute requiredRole="patient">
  <PatientDashboard />
</ProtectedRoute>
```

### API Integration

All API calls are handled through the `api` service:

```typescript
import { api } from '@/lib/api';
```

## 🔄 Data Flow

1. **User Registration/Login** → Backend validates → JWT token returned
2. **Protected Routes** → Check JWT token → Load user data
3. **API Calls** → Include JWT token → Backend validates → Return data
4. **Real-time Updates** → Frontend polls or uses WebSocket (future)

## 🧪 Testing

### Backend Testing

```bash
cd backend
python test_api.py
```

### Frontend Testing

```bash
npm run test
```

### Manual Testing

1. Register a new user (nurse or patient)
2. Login with credentials
3. Navigate to dashboard
4. Test API endpoints
5. Verify role-based access

## 🚨 Common Issues

### CORS Errors

Ensure the backend has CORS enabled:

```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

### Database Connection

Check MySQL is running and credentials are correct in `.env`

### JWT Token Issues

- Clear localStorage if tokens are invalid
- Check JWT_SECRET_KEY is set
- Verify token expiration

### API Endpoint Errors

- Ensure backend is running on correct port
- Check VITE_API_URL in frontend environment
- Verify endpoint paths match

## 📊 Sample Data

The backend includes sample data for testing:

- **Nurse**: sarah.johnson@hospital.com (password: password123)
- **Patient**: john.smith@email.com (password: password123)

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **JWT Tokens**: Store securely, implement refresh tokens
3. **Input Validation**: Both frontend and backend validation
4. **HTTPS**: Use in production
5. **Rate Limiting**: Implement on backend
6. **SQL Injection**: Use parameterized queries (SQLAlchemy handles this)

## 🚀 Production Deployment

### Backend

1. Set `FLASK_ENV=production`
2. Use production WSGI server (Gunicorn)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Use production database

### Frontend

1. Build for production: `npm run build`
2. Serve static files
3. Configure environment variables
4. Set up CDN for assets

## 📞 Support

For integration issues:

1. Check the console for errors
2. Verify environment configuration
3. Test API endpoints directly
4. Review authentication flow
5. Check database connectivity

## 🔄 Future Enhancements

- Real-time notifications (WebSocket)
- File upload for medical documents
- Mobile app integration
- Advanced analytics dashboard
- Multi-language support
- Offline capability
