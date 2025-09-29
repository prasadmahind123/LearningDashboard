# Student Enrollment System for Learning Paths

## Overview
This system allows teachers to track which students are enrolled in their learning paths, manage progress, and maintain detailed enrollment records.

## Database Models

### 1. Existing Models (Enhanced)
- **Teacher**: Creates learning paths
- **LearningPath**: Educational content created by teachers
- **Learner**: Students who can enroll in learning paths

### 2. New Models
- **Enrollment**: Tracks student enrollments with detailed progress tracking

## API Endpoints

### Enrollment Management
- `POST /api/enrollment/enroll` - Enroll a student in a learning path
- `GET /api/enrollment/learning-path/:learningPathId` - Get all students in a specific learning path
- `GET /api/enrollment/learner/:learnerId` - Get all learning paths a student is enrolled in
- `GET /api/enrollment/teacher/:teacherId` - Get all enrollments for a teacher's learning paths
- `PUT /api/enrollment/progress/:enrollmentId` - Update student progress
- `DELETE /api/enrollment/drop/:enrollmentId` - Drop a student from a learning path

## Usage Examples

### Enroll a Student
```javascript
POST /api/enrollment/enroll
{
  "learnerId": "learner123",
  "learningPathId": "path456"
}
```

### Get Students in a Learning Path
```javascript
GET /api/enrollment/learning-path/path456
```

### Update Progress
```javascript
PUT /api/enrollment/progress/enrollment789
{
  "progress": 75,
  "currentModule": "module3"
}
```

## Database Schema Summary

### Enrollment Collection
- `learner`: Reference to Learner
- `learningPath`: Reference to LearningPath
- `teacher`: Reference to Teacher
- `enrolledAt`: Enrollment date
- `progress`: Detailed progress tracking
- `status`: enrolled/in_progress/completed/dropped
- `completedAt`: Completion date

## Features
- ✅ Prevents duplicate enrollments
- ✅ Tracks detailed progress
- ✅ Supports completion certificates
- ✅ Real-time progress updates
- ✅ Teacher and student dashboards
- ✅ Drop enrollment support

## Testing the System
1. Start the server: `npm start`
2. Use Postman or similar tool to test endpoints
3. Check MongoDB for data persistence
