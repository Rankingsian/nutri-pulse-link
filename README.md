# NutriPulse - Healthcare & Nutrition Care System

A modern, secure healthcare platform connecting nurses and patients through intelligent care coordination, medication management, and real-time health monitoring.

![NutriPulse](https://img.shields.io/badge/NutriPulse-Healthcare%20Platform-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue)
![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-green)

## 🌟 Features

### For Patients
- **Medication Management**: Smart reminders and tracking for prescribed medications
- **Meal Logging**: Easy-to-use nutrition tracking with meal categorization
- **Vital Signs Monitoring**: Record and track blood pressure, blood sugar, temperature, and symptoms
- **Secure Communication**: HIPAA-compliant messaging with healthcare providers
- **Health Dashboard**: Comprehensive overview of health metrics and progress
- **Appointment Tracking**: View upcoming appointments and receive reminders

### For Nurses
- **Patient Overview**: Centralized dashboard with all patient information
- **Health Analytics**: Visual charts and trends for patient monitoring
- **Medication Adherence**: Track patient compliance with prescribed treatments
- **Alert System**: Real-time notifications for critical health events
- **Care Coordination**: Streamlined communication and care plan management
- **Patient Management**: Efficient tools for managing multiple patients

### Security & Compliance
- 🔒 HIPAA-compliant data handling
- 🛡️ Secure authentication and authorization
- 🔐 End-to-end encrypted communications
- 📱 Responsive design for mobile and desktop

## 🚀 Quick Start

### For Users

1. **Visit the Application**: Navigate to the NutriPulse platform
2. **Choose Your Portal**: 
   - **Patients**: Click "Patient Portal" to access your health dashboard
   - **Nurses**: Click "Nurse Portal" to access professional tools
3. **Login or Register**: Use existing credentials or create a new patient account
4. **Start Managing Health**: Begin tracking medications, meals, and vital signs

### For Developers

#### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git

#### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

#### Environment Setup
The application is built with Vite and requires no additional environment variables for basic functionality.

## 🏗️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: React hooks and context
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite
- **Package Manager**: npm/yarn

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   └── LandingPage.tsx     # Main landing page component
├── pages/
│   ├── Index.tsx           # Home page
│   ├── PatientDashboard.tsx # Patient portal
│   ├── NurseDashboard.tsx  # Nurse portal
│   ├── Chat.tsx            # Communication interface
│   ├── ForgotPassword.tsx  # Password recovery
│   └── ResetPassword.tsx   # Password reset
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── assets/                 # Images and static files
└── index.css              # Global styles and design tokens
```

## 🎨 Design System

NutriPulse uses a carefully crafted design system built on Tailwind CSS:

- **Color Palette**: Healthcare-focused soft blues and greens
- **Typography**: Clean, readable fonts optimized for medical content
- **Components**: Consistent, accessible UI components
- **Responsive**: Mobile-first design approach
- **Dark Mode**: Full dark mode support

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow React best practices and hooks patterns
- Implement responsive design with Tailwind CSS
- Use semantic HTML for accessibility

### Component Structure
```tsx
// Example component structure
import { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  // Add proper TypeScript types
}

const MyComponent = ({ title }: MyComponentProps) => {
  return (
    <div className="semantic-tailwind-classes">
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### Styling Guidelines
- Use design system tokens from `index.css`
- Avoid hard-coded colors - use semantic tokens
- Implement proper hover and focus states
- Ensure high contrast for accessibility

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler check
```

## 📱 Responsive Design

NutriPulse is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Adapted layouts for medium screens
- **Mobile**: Touch-optimized interface for on-the-go access

## 🔐 Security Features

- **Authentication**: Secure login system with password recovery
- **Authorization**: Role-based access (Patient/Nurse)
- **Data Protection**: HIPAA-compliant data handling practices
- **Secure Communication**: Encrypted messaging between users
- **Session Management**: Secure session handling and timeout

## 🤝 Contributing

We welcome contributions to improve NutriPulse! Please follow these guidelines:

1. **Fork the repository** and create your feature branch
2. **Follow the coding standards** outlined above
3. **Test thoroughly** across different devices and browsers
4. **Submit a pull request** with a clear description of changes

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git commit -m "Add: description of your feature"

# Push and create pull request
git push origin feature/your-feature-name
```

## 📋 User Guide

### Getting Started as a Patient
1. **Register**: Click "New patient? Register here" on the homepage
2. **Login**: Use your credentials to access the Patient Portal
3. **Set Up Profile**: Complete your health information
4. **Add Medications**: Input your prescribed medications
5. **Track Health**: Regular log meals, vitals, and symptoms
6. **Communicate**: Use the chat feature to contact your nurse

### Getting Started as a Nurse
1. **Login**: Access the Nurse Portal with your credentials
2. **Patient Management**: View and manage your assigned patients
3. **Monitor Health**: Review patient data and trends
4. **Respond to Alerts**: Address critical health notifications
5. **Communicate**: Provide guidance through secure messaging

## 🆘 Support

For technical support or questions:
- **Users**: Contact your healthcare provider's IT support
- **Developers**: Create an issue in the project repository

## 🚀 Deployment

### Using Lovable (Recommended)
Simply open [Lovable](https://lovable.dev/projects/8f92aad3-a0af-405d-a232-1221872a0d4c) and click on Share → Publish.

### Custom Domain
To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.
Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 📄 License

This project is proprietary software for healthcare institutions. Unauthorized distribution is prohibited.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed with healthcare professionals and patients in mind
- Compliant with healthcare data protection standards

---

**NutriPulse** - Caring for Your Health, Together 💙

*Last updated: 2024*
