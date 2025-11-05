# Contributing to Healthcare Booking System

Thank you for your interest in contributing to the Healthcare Booking System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node.js version)

### Suggesting Features

1. **Open a feature request** issue
2. **Describe the feature** in detail
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### Code Contributions

#### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/healthcare-booking-system.git
   cd healthcare-booking-system
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install
   ```

#### Development Guidelines

##### Code Style

- **JavaScript/React**: Follow ESLint configuration
- **CSS**: Use Tailwind CSS utility classes
- **File naming**: Use camelCase for files, PascalCase for components
- **Comments**: Write clear, concise comments for complex logic

##### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add password reset functionality
fix(booking): resolve appointment time conflict
docs(readme): update installation instructions
```

##### Testing

- **Write tests** for new features
- **Update existing tests** when modifying functionality
- **Ensure all tests pass** before submitting PR

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

##### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure code passes linting**
   ```bash
   npm run lint
   ```
4. **Create detailed PR description**
5. **Link related issues**
6. **Request review** from maintainers

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🏗️ Development Setup

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- Git

### Environment Setup

1. **Database Setup**
   ```bash
   createdb healthcare_booking_dev
   psql -d healthcare_booking_dev -f database/schema.sql
   ```

2. **Environment Variables**
   
   Create `.env` files in both `backend/` and `frontend/` directories:
   
   **backend/.env**
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_NAME=healthcare_booking_dev
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=dev-secret-key
   ```
   
   **frontend/.env**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 🧪 Testing Guidelines

### Backend Testing

- Use **Jest** for unit tests
- Test API endpoints with **Supertest**
- Mock external dependencies
- Aim for >80% code coverage

### Frontend Testing

- Use **React Testing Library**
- Test user interactions
- Mock API calls
- Test component rendering

### Test Structure

```javascript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Test implementation
  });

  afterEach(() => {
    // Cleanup
  });
});
```

## 📝 Documentation

### Code Documentation

- **JSDoc comments** for functions
- **README updates** for new features
- **API documentation** for new endpoints
- **Component documentation** for complex components

### Documentation Style

```javascript
/**
 * Books an appointment for a patient
 * @param {Object} appointmentData - The appointment details
 * @param {string} appointmentData.doctorId - Doctor's ID
 * @param {string} appointmentData.patientId - Patient's ID
 * @param {Date} appointmentData.dateTime - Appointment date and time
 * @returns {Promise<Object>} The created appointment
 */
async function bookAppointment(appointmentData) {
  // Implementation
}
```

## 🔒 Security Guidelines

### Sensitive Data

- **Never commit** sensitive information
- **Use environment variables** for secrets
- **Sanitize user inputs**
- **Validate all data** on both client and server

### Authentication

- **Implement proper JWT handling**
- **Use secure password hashing**
- **Validate user permissions**
- **Implement rate limiting**

## 🚀 Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing done

## 🎯 Areas for Contribution

### High Priority

- **Mobile responsiveness** improvements
- **Accessibility** enhancements
- **Performance** optimizations
- **Test coverage** improvements

### Medium Priority

- **Advanced search** functionality
- **Calendar integrations**
- **Multi-language support**
- **Advanced analytics**

### Low Priority

- **Theme customization**
- **Advanced notifications**
- **Third-party integrations**
- **Mobile app development**

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: maintainer@healthcare-booking.com

### Response Times

- **Critical bugs**: 24 hours
- **Feature requests**: 1 week
- **General questions**: 3-5 days

## 🏆 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making healthcare more accessible! 🏥❤️