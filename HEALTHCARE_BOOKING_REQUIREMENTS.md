# Healthcare Patient Appointment Booking System - Development Requirements

## Role
Act as a Guide and Mentor on Software Development. You possess extensive software development knowledge and expertise in programming languages including React, Angular, and several other related frameworks.

## Task
I am building software for the Healthcare industry. You will help me develop a module specifically for patient appointment bookings with a complete full-stack implementation.

## Instructions

### Programming Languages & Frameworks
- **Frontend**: ReactJS with Redux Toolkit and Tailwind CSS framework
- **Typography**: 
  - Headings: DM Sans font family
  - Body and text: Source Sans 3 font family
- **Color Theme**:
  - Primary: Teal Blue (#007C91)
  - Accent/Secondary: Sky Blue (#00B8D4)
  - Background (Light Mode): Off-White/Cool Gray (#F5F7FA)
  - Text Primary: Charcoal Gray (#2E3A59)

### Business Logic
This software will be used online by patients who want to book appointments. The workflow includes:
1. Patients visit the web portal
2. Login through a simple and clean form using Formik and Yup validations
3. Select their preferred date and time for appointments
4. Complete the booking process
5. The system maintains a database of all bookings
6. Display available time slots for selected doctors on specific dates
7. Prevent double-booking scenarios

### Frontend Requirements
- **Design Philosophy**: Simple, intuitive, and clean interface
- **User Experience**: So user-friendly that even a 7-8 year old can navigate and book appointments
- **Components**: Drop-downs and data entry fields
- **Responsiveness**: Fully responsive design for all devices (mobile, tablet, desktop)
- **Form Handling**: Formik forms with Yup validation

### Backend Requirements
- **Architecture**: Node.js + Express + PostgreSQL
- **Database**: Supabase PostgreSQL for data persistence
- **Modularity**: Backend designed for reusability across multiple modules:
  - Doctor's portal (future)
  - Patient management (future)
  - Test management (future)
  - Additional healthcare modules (future)
- **API Design**: RESTful APIs with proper error handling and validation

### Core Features Required
1. **Authentication System**:
   - JWT-based authentication and authorization
   - Secure login/logout functionality

2. **Booking Management**:
   - Appointment scheduling with date/time selection
   - Double-booking prevention system
   - Appointment cancellation capability
   - Appointment rescheduling functionality

3. **Email Integration**:
   - Simple SMTP-based email service
   - Automated email notifications to both doctor and patient upon booking completion
   - Email templates for different scenarios (booking confirmation, cancellation, etc.)

4. **Schedule Management**:
   - Weekly schedule view for doctors
   - Available time slot management
   - Appointment history and tracking

### Integration Requirements
- Complete codebase for seamless frontend-backend integration
- API documentation and endpoint specifications
- Database schema and migration scripts
- Email service configuration and templates

### Layout Components
- Navigation bar (Navbar)
- Sidebar navigation
- Appointment booking form
- Schedule view component
- Responsive grid layouts using Tailwind CSS

## Data

### Master Data Requirements
Based on healthcare industry standards, the following master data is essential:

**User Management**:
- User profiles (patients, doctors, administrators)
- Authentication credentials
- Role-based permissions

**Doctor Information**:
- Doctor profiles and specializations
- Available working hours and days
- Consultation fees and duration
- Contact information

**Appointment Categories**:
- Consultation types
- Duration templates
- Priority levels

### Transaction Data Requirements
**Appointment Records**:
- Booking details (date, time, duration)
- Patient and doctor associations
- Appointment status (scheduled, completed, cancelled, rescheduled)
- Cancellation/rescheduling reasons
- Payment information (if applicable)

**Communication Logs**:
- Email notification history
- SMS notifications (future scope)
- System-generated alerts

**Audit Trail**:
- User activity logs
- System access records
- Data modification history

## Examples

### Sample User Flow
1. **Patient Registration/Login**:
   ```
   Patient visits portal → Login form → Dashboard
   ```

2. **Appointment Booking**:
   ```
   Select Doctor → Choose Date → Pick Available Time → Confirm Booking → Email Confirmation
   ```

3. **Doctor Schedule View**:
   ```
   Doctor Login → Weekly Calendar → View Appointments → Manage Schedule
   ```

### API Endpoint Examples
```
POST /api/auth/login
GET /api/doctors/available-slots
POST /api/appointments/book
PUT /api/appointments/:id/cancel
GET /api/appointments/weekly-schedule
```

### Database Schema Example
```sql
Users (id, email, password, role, created_at)
Doctors (id, user_id, specialization, available_hours)
Appointments (id, patient_id, doctor_id, date, time, status)
```

## Tone and Style

### Code Quality Standards
- **Professional-level code** with enterprise-grade architecture
- **Comprehensive documentation** with inline comments explaining functionality
- **Easy debugging capabilities** with proper error handling and logging
- **Modular and maintainable** code structure
- **Industry best practices** for security, performance, and scalability

### Documentation Requirements
- Clear inline code comments for complex logic
- API documentation with request/response examples
- Database schema documentation
- Setup and deployment instructions
- Testing guidelines and examples

### Code Organization
- **Clean Architecture**: Separation of concerns with proper layering
- **Reusable Components**: Modular frontend components
- **Scalable Backend**: Microservice-ready architecture
- **Type Safety**: Proper validation and error handling
- **Performance Optimized**: Efficient database queries and frontend rendering

---

## Confirmation Questions

Before proceeding with the implementation, please confirm:

1. **Database Preference**: Should I proceed with Supabase PostgreSQL as specified, or would you prefer a different database solution?

2. **Authentication Flow**: Do you need social login options (Google, Facebook) in addition to email/password authentication?

3. **Email Service**: Do you have a preferred SMTP provider (Gmail, SendGrid, AWS SES), or should I provide configuration for multiple options?

4. **Deployment Target**: What is your preferred deployment platform (Vercel, Netlify, AWS, etc.)?

5. **Additional Features**: Are there any specific healthcare compliance requirements (HIPAA, data encryption) that need to be considered?

Do you understand and approve of these refined requirements? Please let me know if you need any clarifications or modifications before I proceed with the implementation.