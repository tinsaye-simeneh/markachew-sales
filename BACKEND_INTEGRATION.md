# Backend Integration Setup

This document describes the backend integration setup for the Markachew Sales application using the Employee Marketplace API.

## API Base URL

The application is configured to use the following base URL:
- **Production**: `https://employee.luckbingogames.com`

## Environment Configuration

Create a `.env.local` file in the root directory with the following configuration:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://employee.luckbingogames.com
```

## API Services

The following API services have been implemented:

### Authentication Service (`src/lib/api/auth.ts`)
- User registration and login
- Admin authentication
- Token management and refresh
- User profile management

### Core Services (`src/lib/api/services.ts`)
- **Jobs Service**: Create, read, update, delete jobs
- **Houses Service**: Create, read, update, delete house listings
- **Applications Service**: Job application management
- **Categories Service**: Category management
- **Profiles Service**: User profile management
- **Payments Service**: Payment processing
- **Ratings Service**: User rating system

### API Client (`src/lib/api/client.ts`)
- HTTP client with automatic token management
- Request/response interceptors
- Error handling and retry logic
- Form data support for file uploads

## API Endpoints

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/refresh` - Token refresh
- `POST /api/users/logout` - User logout
- `GET /api/users/me` - Get current user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/create` - Create admin user
- `POST /api/admin/refresh` - Admin token refresh
- `POST /api/admin/logout` - Admin logout

### Job Endpoints
- `POST /api/jobs` - Create job (Employer only)
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `PUT /api/jobs/:id` - Update job (Employer only)
- `DELETE /api/jobs/:id` - Delete job (Employer only)

### House Endpoints
- `POST /api/houses` - Create house listing (Seller only)
- `GET /api/houses` - Get all houses
- `GET /api/houses/:id` - Get single house
- `PUT /api/houses/:id` - Update house (Seller only)
- `DELETE /api/houses/:id` - Delete house (Seller only)

### Application Endpoints
- `POST /api/applications` - Create application (Employee only)
- `GET /api/applications` - Get applications
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id` - Update application (Employee only)
- `DELETE /api/applications/:id` - Delete application (Employee only)
- `PUT /api/applications/:id/restore` - Restore application

### Category Endpoints
- `POST /api/categories` - Create category (Seller only)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `PUT /api/categories/:id` - Update category (Seller only)
- `DELETE /api/categories/:id` - Delete category (Seller only)

### Profile Endpoints
- `POST /api/profile` - Create profile
- `GET /api/profile/:id` - Get profile
- `PUT /api/profile/:id` - Update profile
- `DELETE /api/profile/:id` - Delete profile

### Payment Endpoints
- `POST /api/payments` - Create payment (Buyer only)
- `GET /api/payments` - Get payments
- `GET /api/payments/:id` - Get single payment
- `PUT /api/payments/:id` - Update payment (Buyer only)
- `DELETE /api/payments/:id` - Delete payment (Buyer only)

### Rating Endpoints
- `POST /api/ratings` - Create rating
- `GET /api/ratings` - Get ratings
- `GET /api/ratings/:id` - Get single rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

## User Types

The API supports the following user types:
- `EMPLOYER` - Can create and manage jobs
- `EMPLOYEE` - Can apply for jobs
- `SELLER` - Can create and manage house listings
- `BUYER` - Can browse and purchase houses
- `ADMIN` - Administrative access
- `SUPER_ADMIN` - Full administrative access

## Authentication Flow

1. User registers with email, password, and user type
2. System returns access token and refresh token
3. Access token is stored in localStorage
4. All API requests include the access token in the Authorization header
5. When access token expires, the refresh token is used to get a new access token
6. On logout, both tokens are cleared

## Error Handling

The API client includes comprehensive error handling:
- Network errors
- Authentication errors (401)
- Authorization errors (403)
- Validation errors (400)
- Server errors (500)
- Request timeouts

## File Upload Support

The API supports file uploads for:
- Job images
- House images and videos
- Profile photos
- Documents and licenses

Files are uploaded using FormData with the appropriate content type headers.

## Usage Examples

### Login
```typescript
import { authService } from '@/lib/api'

const login = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password })
    console.log('User logged in:', response.user)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

### Fetch Jobs
```typescript
import { useJobs } from '@/hooks/useApi'

const JobsList = () => {
  const { jobs, loading, error } = useJobs(1, 10)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  )
}
```

### Create Job
```typescript
import { useCreateJob } from '@/hooks/useApi'

const CreateJobForm = () => {
  const { createJob, loading, error } = useCreateJob()
  
  const handleSubmit = async (jobData: any) => {
    try {
      const newJob = await createJob(jobData)
      console.log('Job created:', newJob)
    } catch (error) {
      console.error('Failed to create job:', error)
    }
  }
  
  return (
    // Form JSX
  )
}
```

## Testing

The API integration can be tested using the provided Postman collection:
- File: `Employee Marketplace API Tests.postman_collection.json`
- Base URL: `https://employee.luckbingogames.com`

## Security Considerations

- All API requests use HTTPS
- Access tokens are stored in localStorage (consider using httpOnly cookies for production)
- Refresh tokens are used to maintain session security
- Role-based access control is enforced on the backend
- File uploads are validated on the server

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the API server allows requests from your domain
2. **Authentication Errors**: Check if tokens are properly stored and sent
3. **File Upload Issues**: Verify FormData is being sent with correct headers
4. **Network Timeouts**: Check network connectivity and API server status

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

This will log all API requests and responses to the console.