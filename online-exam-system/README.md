# Online Examination System

A comprehensive frontend application for an online examination system with role-based dashboards for Students, Teachers, Admins, and Proctors. Built with React, Material-UI, and modern web technologies.

## 🚀 Features

### General Features
- **Unified Login System**: Single login page with role selection
- **Role-Based Access Control**: Separate dashboards for different user roles
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with Material-UI components
- **Real-time Updates**: Live data updates and notifications
- **Cross-browser Compatibility**: Works on all modern browsers

### Student Dashboard
- **Exam Management**: View available exams with details (subject, time, duration)
- **Exam Interface**: Start exams with active/inactive states
- **Results Dashboard**: View completed exam results with grades and scores
- **Progress Tracking**: Visual progress indicators and performance metrics
- **Clean Interface**: Minimalistic design to reduce distractions

### Teacher Dashboard
- **Exam Creation**: Create new exams with customizable fields
- **Exam Management**: Edit, delete, and manage existing exams
- **Student Monitoring**: View and monitor student submissions
- **Performance Analytics**: Charts and graphs for performance metrics
- **Submission Review**: Detailed view of student submissions and scores

### Admin Dashboard
- **User Management**: Add, edit, delete users across all roles
- **Advanced Filtering**: Search, sort, and filter user data
- **System Reports**: Generate comprehensive system usage reports
- **Platform Operations**: Oversee platform settings and operations
- **Analytics Dashboard**: User distribution and activity trends

### Proctor Dashboard
- **Live Monitoring**: Real-time webcam feeds of active students
- **Suspicious Activity Detection**: Flag and report suspicious behavior
- **Activity Logs**: Real-time logging of student activities
- **Exam Overview**: Monitor ongoing and upcoming examinations
- **Alert System**: Visual and audio alerts for policy violations

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router DOM
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Material-UI Icons, Lucide React
- **Styling**: Material-UI Theme System

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-exam-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 🔐 Authentication

The application currently uses a mock authentication system for development purposes. 

### Demo Credentials
You can use the following credentials to test different roles:
- **Username**: demo
- **Password**: demo123

Simply select the desired role (Student, Teacher, Admin, or Proctor) and use the demo credentials to log in.

### Backend Integration
To integrate with a real backend:
1. Update the `API_BASE_URL` in `src/services/authService.js`
2. Replace the mock authentication logic with actual API calls
3. Update the token handling and user management logic

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   └── ProtectedRoute.js # Route protection component
├── context/             # React Context providers
│   └── AuthContext.js   # Authentication context
├── pages/               # Page components (dashboards)
│   ├── LoginPage.js     # Unified login page
│   ├── StudentDashboard.js
│   ├── TeacherDashboard.js
│   ├── AdminDashboard.js
│   └── ProctorDashboard.js
├── services/            # API services
│   └── authService.js   # Authentication service
└── utils/               # Utility functions
```

## 🎨 Design System

### Color Coding by Role
- **Students**: Blue (#1976d2) - Trust and learning
- **Teachers**: Green (#388e3c) - Growth and knowledge
- **Admins**: Orange (#f57c00) - Authority and management
- **Proctors**: Purple (#7b1fa2) - Security and monitoring

### UI/UX Principles
- **Consistency**: Unified design language across all dashboards
- **Accessibility**: WCAG compliant design with proper contrast ratios
- **Performance**: Optimized components and lazy loading
- **Responsiveness**: Mobile-first design approach

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WEBSOCKET_URL=ws://localhost:3001
```

### Theme Customization
The Material-UI theme can be customized in `src/App.js`. You can modify:
- Color palette
- Typography
- Component styles
- Breakpoints

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full dashboard experience with sidebar navigation
- **Tablet**: Adaptive layout with collapsible navigation
- **Mobile**: Mobile-optimized interface with bottom navigation

## 🔒 Security Features

- **Role-Based Access Control**: Users can only access their designated dashboards
- **Route Protection**: Protected routes prevent unauthorized access
- **Token Management**: Secure token storage and validation
- **Session Management**: Automatic logout on token expiration

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Deploy with zero configuration
- **AWS S3**: Static website hosting
- **Docker**: Containerized deployment

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For coverage report:
```bash
npm test -- --coverage
```

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading of dashboard components
- **Memoization**: React.memo for expensive components
- **Bundle Analysis**: Webpack Bundle Analyzer integration
- **Image Optimization**: Compressed images and lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation wiki
- Contact the development team

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Role-based dashboards
- ✅ Authentication system
- ✅ Responsive design
- ✅ Basic CRUD operations

### Phase 2 (Upcoming)
- [ ] Real-time notifications
- [ ] Advanced proctoring features
- [ ] Video/audio recording
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 3 (Future)
- [ ] AI-powered cheating detection
- [ ] Biometric authentication
- [ ] Advanced reporting
- [ ] Integration APIs
- [ ] Multi-language support

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Built with ❤️ for educational institutions worldwide**
