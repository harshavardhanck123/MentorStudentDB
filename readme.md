# Student Mentor Management API

This is a RESTful API built using Express.js and Mongoose for managing students and mentors. The API allows creating, updating, and retrieving information about students and mentors, and supports assigning students to mentors.

## Prerequisites

- Node.js
- MongoDB
- npm or yarn

## Getting Started

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB URI:
    ```
    MONGODB_URI=<your-mongodb-uri>
    PORT=3000 # Optional, default is 3000
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### Create Mentor

- **URL:** `/mentors`
- **Method:** `POST`
- **Body:**
    ```json
    {
        "name": "Mentor Name",
        "email": "mentor@example.com"
    }
    ```
- **Response:**
    ```json
    {
        "_id": "mentorId",
        "name": "Mentor Name",
        "email": "mentor@example.com"
    }
    ```

### Create Student

- **URL:** `/students`
- **Method:** `POST`
- **Body:**
    ```json
    {
        "name": "Student Name",
        "email": "student@example.com"
    }
    ```
- **Response:**
    ```json
    {
        "_id": "studentId",
        "name": "Student Name",
        "email": "student@example.com"
    }
    ```

### Assign a Student to a Mentor

- **URL:** `/assign-student/:mentorId/:studentId`
- **Method:** `PUT`
- **Response:**
    ```json
    {
        "_id": "studentId",
        "name": "Student Name",
        "email": "student@example.com",
        "mentor": "mentorId"
    }
    ```

### Add Multiple Students to a Mentor

- **URL:** `/add-students/:mentorId`
- **Method:** `PUT`
- **Body:**
    ```json
    {
        "students": ["studentId1", "studentId2"]
    }
    ```
- **Response:**
    ```json
    {
        "acknowledged": true,
        "modifiedCount": 2
    }
    ```

### Get Students Without Mentors

- **URL:** `/newstudents`
- **Method:** `GET`
- **Response:**
    ```json
    [
        {
            "_id": "studentId",
            "name": "Student Name",
            "email": "student@example.com"
        }
    ]
    ```

### Change Mentor for a Student

- **URL:** `/change-mentor/:studentId/:newMentorId`
- **Method:** `PUT`
- **Response:**
    ```json
    {
        "_id": "studentId",
        "name": "Student Name",
        "email": "student@example.com",
        "mentor": "newMentorId"
    }
    ```

### Assign Mentor to a Student

- **URL:** `/assign-mentor/:studentId/:mentorId`
- **Method:** `PUT`
- **Response:**
    ```json
    {
        "_id": "studentId",
        "name": "Student Name",
        "email": "student@example.com",
        "mentor": "mentorId"
    }
    ```

### Get All Students for a Mentor

- **URL:** `/mentor-students/:mentorId`
- **Method:** `GET`
- **Response:**
    ```json
    [
        {
            "_id": "studentId",
            "name": "Student Name",
            "email": "student@example.com",
            "mentor": "mentorId"
        }
    ]
    ```

### Get Previous Mentor for a Student

- **URL:** `/previous-mentor/:studentId`
- **Method:** `GET`
- **Response:**
    ```json
    {
        "_id": "mentorId",
        "name": "Previous Mentor Name",
        "email": "previous.mentor@example.com"
    }
    ```

## Error Handling

All endpoints will return appropriate HTTP status codes and error messages in the following format if an error occurs:
```json
{
    "error": "Error message"
}

