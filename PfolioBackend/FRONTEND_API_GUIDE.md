# Portfolio Backend API Documentation for Frontend Integration

## 🚨 BREAKING CHANGES - MongoDB to MySQL Migration

### ⚠️ Critical Change: ID Type Migration

**IMPORTANT:** All entity IDs have changed from `String` (MongoDB ObjectId) to `number` (MySQL auto-increment).

**Before (MongoDB):**
```typescript
interface Project {
  id: string;  // "507f1f77bcf86cd799439011"
}
```

**After (MySQL):**
```typescript
interface Project {
  id: number;  // 1, 2, 3, etc.
}
```

---

## 📋 Table of Contents

1. [Admin APIs](#1-admin-apis)
2. [Projects APIs](#2-projects-apis)
3. [Certifications APIs](#3-certifications-apis)
4. [Skills APIs](#4-skills-apis)
5. [Contact APIs](#5-contact-apis)
6. [Message APIs](#6-message-apis)
7. [TypeScript Interfaces](#7-typescript-interfaces)
8. [React/Angular Examples](#8-react-examples)
9. [Error Handling](#9-error-handling)

---

## 1. Admin APIs

### Base URL: `/admin`

### 1.1 Admin Login

**Endpoint:** `POST /admin/checkadminlogin`

**Description:** Authenticate admin user

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "password": "hashedPassword"
}
```

**Error Responses:**
- `401`: Invalid Username or Password
- `500`: Login failed: {error message}

**TypeScript Example:**
```typescript
const loginAdmin = async (username: string, password: string) => {
  try {
    const response = await axios.post('/admin/checkadminlogin', {
      username,
      password
    });
    return response.data; // Admin object with id as number
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid credentials');
    }
    throw error;
  }
};
```

### 1.2 Update Password

**Endpoint:** `POST /admin/updatepassword`

**Description:** Update admin password

**Request Body:**
```json
{
  "username": "admin",
  "currentPassword": "oldPassword123",
  "newPassword": "NewPassword123!"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

**Success Response (200):**
```json
"Password updated successfully"
```

**Error Responses:**
- `400`: Validation errors (missing fields, weak password)
- `401`: Current password is incorrect
- `500`: Password update failed

**TypeScript Example:**
```typescript
const updatePassword = async (
  username: string,
  currentPassword: string,
  newPassword: string
) => {
  const response = await axios.post('/admin/updatepassword', {
    username,
    currentPassword,
    newPassword
  });
  return response.data;
};
```

---

## 2. Projects APIs

### Base URL: `/projects`

### 2.1 Get All Projects

**Endpoint:** `GET /projects/viewAll`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "Portfolio Website",
    "description": "Personal portfolio",
    "fdescription": "Full description here...",
    "category": "Web Development",
    "sdate": "2024-01-15",
    "edate": "2024-03-20",
    "technologies": "React, Spring Boot, MySQL",
    "gitlink": "https://github.com/user/portfolio",
    "liveurl": "https://portfolio.com",
    "imgurl": "https://cloudinary.com/image.jpg"
  }
]
```

### 2.2 Add Project

**Endpoint:** `POST /projects/add`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `project` (JSON string or object):
```json
{
  "title": "New Project",
  "description": "Short description",
  "fdescription": "Full description",
  "category": "Web Development",
  "sdate": "2024-01-15",
  "edate": "2024-03-20",
  "technologies": "React, Node.js",
  "gitlink": "https://github.com/user/project",
  "liveurl": "https://project.com"
}
```
- `image` (File, optional): Project screenshot

**Success Response (201):**
```json
{
  "id": 5,
  "title": "New Project",
  "imgurl": "https://cloudinary.com/uploaded-image.jpg",
  ...
}
```

**React Example:**
```tsx
const addProject = async (projectData: any, imageFile: File | null) => {
  const formData = new FormData();
  formData.append('project', JSON.stringify(projectData));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await axios.post('/projects/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
```

### 2.3 Update Project

**Endpoint:** `PUT /projects/update/{id}`

**⚠️ CHANGE:** Path parameter is now `number` instead of `string`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "title": "Updated Project Title",
  "description": "Updated description",
  "technologies": "React, TypeScript, MySQL"
}
```

**Note:** Only include fields you want to update

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Updated Project Title",
  ...
}
```

**Error Responses:**
- `404`: Project not found
- `500`: Update failed

**TypeScript Example:**
```typescript
// BEFORE (MongoDB):
const updateProject = async (id: string, data: Partial<Project>) => {
  await axios.put(`/projects/update/${id}`, data);
};

// AFTER (MySQL):
const updateProject = async (id: number, data: Partial<Project>) => {
  await axios.put(`/projects/update/${id}`, data);
};
```

### 2.4 Delete Project

**Endpoint:** `DELETE /projects/del/{id}`

**⚠️ CHANGE:** Path parameter is now `number` instead of `string`

**Success Response (204):** No content

**Error Response (404):** Project not found

**TypeScript Example:**
```typescript
// BEFORE (MongoDB):
const deleteProject = async (id: string) => {
  await axios.delete(`/projects/del/${id}`);
};

// AFTER (MySQL):
const deleteProject = async (id: number) => {
  await axios.delete(`/projects/del/${id}`);
};
```

### 2.5 Count Projects

**Endpoint:** `GET /projects/countprojects`

**Success Response (200):**
```json
15
```

---

## 3. Certifications APIs

### Base URL: `/certifications`

### 3.1 Get All Certifications

**Endpoint:** `GET /certifications/viewAll`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "AWS Certified Developer",
    "issuer": "Amazon Web Services",
    "issueDate": "2024-01-15",
    "expDate": "2027-01-15",
    "credentialId": "AWS-123456",
    "credentialUrl": "https://aws.amazon.com/verify",
    "description": "Cloud development certification",
    "status": "Active",
    "imgUrl": "https://cloudinary.com/cert.jpg"
  }
]
```

### 3.2 Add Certification

**Endpoint:** `POST /certifications/add`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `certification` (JSON or object)
- `image` (File, optional)

**TypeScript Example:**
```typescript
const addCertification = async (certData: any, imageFile: File | null) => {
  const formData = new FormData();
  formData.append('certification', JSON.stringify(certData));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await axios.post('/certifications/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

### 3.3 Update Certification

**Endpoint:** `PUT /certifications/update/{id}`

**⚠️ CHANGE:** Path parameter is now `number`

**Content-Type:** `multipart/form-data`

### 3.4 Delete Certification

**Endpoint:** `DELETE /certifications/delete/{id}`

**⚠️ CHANGE:** Path parameter is now `number`

**Success Response (204):** No content

### 3.5 Count Certifications

**Endpoint:** `GET /certifications/countcertifications`

**Success Response (200):** `number`

---

## 4. Skills APIs

### Base URL: `/skills`

### 4.1 Get All Skills

**Endpoint:** `GET /skills/all`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "skillname": "React",
    "category": "Frontend",
    "iconUrl": "https://cloudinary.com/react-icon.png",
    "description": "JavaScript library for building UIs",
    "learningtype": "Self-taught"
  }
]
```

### 4.2 Add Skill

**Endpoint:** `POST /skills/add`

**Request Body:**
```json
{
  "skillname": "TypeScript",
  "category": "Programming Language",
  "iconUrl": "https://cloudinary.com/ts-icon.png",
  "description": "Typed superset of JavaScript",
  "learningtype": "Online Course"
}
```

**Success Response (200):**
```json
"Skill Added Successfully"
```

### 4.3 Update Skill

**Endpoint:** `PUT /skills/update/{name}`

**⚠️ NOTE:** Uses skill name, not ID

**Request Body:**
```json
{
  "skillname": "TypeScript",
  "category": "Programming Language",
  "description": "Updated description"
}
```

### 4.4 Delete Skill

**Endpoint:** `DELETE /skills/delete/{name}`

**⚠️ NOTE:** Uses skill name, not ID

### 4.5 Get Skills by Category

**Endpoint:** `GET /skills/category/{category}`

**Example:** `GET /skills/category/Frontend`

### 4.6 Count Skills

**Endpoint:** `GET /skills/countskills`

---

## 5. Contact APIs

### Base URL: `/contacts`

### 5.1 Get All Contacts

**Endpoint:** `GET /contacts/all`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry",
    "message": "Hello, I'd like to discuss..."
  }
]
```

### 5.2 Add Contact

**Endpoint:** `POST /contacts/add`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I would like to discuss a potential project..."
}
```

**Success Response (200):**
```json
{
  "id": 15,
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I would like to discuss..."
}
```

### 5.3 Delete Contact

**Endpoint:** `DELETE /contacts/delete/{id}`

**⚠️ CHANGE:** Path parameter is now `number`

**Success Response (200):**
```json
"Contact with ID 1 has been deleted."
```

### 5.4 Count Messages

**Endpoint:** `GET /contacts/countmessages`

---

## 6. Message APIs

### Base URL: `/message`

### 6.1 Send Reply Message

**Endpoint:** `POST /message/reply`

**Request Body:**
```json
{
  "email": "user@example.com",
  "subject": "Re: Your Inquiry",
  "message": "Thank you for reaching out..."
}
```

**Success Response (200):**
```json
"Reply sent successfully"
```

### 6.2 Save Message

**Endpoint:** `POST /message/save`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "subject": "New Message",
  "message": "Message content here",
  "status": "NEW"
}
```

### 6.3 Get All Messages

**Endpoint:** `GET /message/all`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "subject": "Inquiry",
    "message": "Hello...",
    "createdAt": "2024-11-27T10:30:00",
    "status": "NEW"
  }
]
```

---

## 7. TypeScript Interfaces

### Complete TypeScript Type Definitions

```typescript
// ============================================
// UPDATED INTERFACES (MySQL with number IDs)
// ============================================

export interface Admin {
  id: number;  // Changed from string
  username: string;
  password: string;
}

export interface Project {
  id: number;  // Changed from string
  title: string;
  description: string;
  fdescription: string;
  category: string;
  sdate: string;  // ISO date string or Date
  edate: string;  // ISO date string or Date
  technologies: string;
  gitlink: string;
  liveurl: string;
  imgurl: string;
}

export interface Certification {
  id: number;  // Changed from string
  title: string;
  issuer: string;
  issueDate: string;  // ISO date string
  expDate: string;    // ISO date string
  credentialId: string;
  credentialUrl: string;
  description: string;
  status: string;
  imgUrl: string;
}

export interface Skill {
  id: number;  // Changed from string
  skillname: string;
  category: string;
  iconUrl: string;
  description: string;
  learningtype: string;
}

export interface Contact {
  id: number;  // Changed from string
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Message {
  id: number;  // Changed from string
  email: string;
  subject: string;
  message: string;
  createdAt: string;  // ISO datetime string
  status: 'NEW' | 'READ' | 'REPLIED';
}

// API Response Types
export interface ApiError {
  message: string;
  status: number;
}

export interface LoginResponse {
  admin: Admin;
  token?: string;
}
```

---

## 8. React Examples

### 8.1 Complete API Service (TypeScript)

```typescript
// api/portfolioApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:2420';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// PROJECTS API
// ============================================

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects/viewAll'),
  
  getCount: () => api.get<number>('/projects/countprojects'),
  
  add: (project: Omit<Project, 'id'>, image?: File) => {
    const formData = new FormData();
    formData.append('project', JSON.stringify(project));
    if (image) {
      formData.append('image', image);
    }
    return api.post<Project>('/projects/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // ⚠️ CHANGED: id is now number
  update: (id: number, project: Partial<Project>) => 
    api.put<Project>(`/projects/update/${id}`, project),
  
  // ⚠️ CHANGED: id is now number
  delete: (id: number) => 
    api.delete(`/projects/del/${id}`),
};

// ============================================
// CERTIFICATIONS API
// ============================================

export const certificationsApi = {
  getAll: () => api.get<Certification[]>('/certifications/viewAll'),
  
  getCount: () => api.get<number>('/certifications/countcertifications'),
  
  add: (cert: Omit<Certification, 'id'>, image?: File) => {
    const formData = new FormData();
    formData.append('certification', JSON.stringify(cert));
    if (image) formData.append('image', image);
    return api.post<Certification>('/certifications/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // ⚠️ CHANGED: id is now number
  update: (id: number, cert: Partial<Certification>, image?: File) => {
    const formData = new FormData();
    formData.append('certification', JSON.stringify(cert));
    if (image) formData.append('image', image);
    return api.put<Certification>(`/certifications/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // ⚠️ CHANGED: id is now number
  delete: (id: number) => 
    api.delete(`/certifications/delete/${id}`),
};

// ============================================
// SKILLS API
// ============================================

export const skillsApi = {
  getAll: () => api.get<Skill[]>('/skills/all'),
  
  getCount: () => api.get<number>('/skills/countskills'),
  
  getByCategory: (category: string) => 
    api.get<Skill[]>(`/skills/category/${category}`),
  
  add: (skill: Omit<Skill, 'id'>) => 
    api.post<string>('/skills/add', skill),
  
  // Note: Uses skill name, not ID
  update: (name: string, skill: Partial<Skill>) => 
    api.put<string>(`/skills/update/${name}`, skill),
  
  // Note: Uses skill name, not ID
  delete: (name: string) => 
    api.delete<string>(`/skills/delete/${name}`),
};

// ============================================
// CONTACTS API
// ============================================

export const contactsApi = {
  getAll: () => api.get<Contact[]>('/contacts/all'),
  
  getCount: () => api.get<number>('/contacts/countmessages'),
  
  add: (contact: Omit<Contact, 'id'>) => 
    api.post<Contact>('/contacts/add', contact),
  
  // ⚠️ CHANGED: id is now number
  delete: (id: number) => 
    api.delete<string>(`/contacts/delete/${id}`),
};

// ============================================
// MESSAGES API
// ============================================

export const messagesApi = {
  getAll: () => api.get<Message[]>('/message/all'),
  
  save: (message: Omit<Message, 'id' | 'createdAt'>) => 
    api.post<string>('/message/save', message),
  
  reply: (message: { email: string; subject: string; message: string }) => 
    api.post<string>('/message/reply', message),
};

// ============================================
// ADMIN API
// ============================================

export const adminApi = {
  login: (username: string, password: string) => 
    api.post<Admin>('/admin/checkadminlogin', { username, password }),
  
  updatePassword: (
    username: string,
    currentPassword: string,
    newPassword: string
  ) => 
    api.post<string>('/admin/updatepassword', {
      username,
      currentPassword,
      newPassword,
    }),
};

export default api;
```

### 8.2 React Hook Example

```typescript
// hooks/useProjects.ts
import { useState, useEffect } from 'react';
import { projectsApi } from '../api/portfolioApi';
import { Project } from '../types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getAll();
      setProjects(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>, image?: File) => {
    try {
      const response = await projectsApi.add(project, image);
      setProjects([...projects, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  // ⚠️ UPDATED: id is now number
  const updateProject = async (id: number, updates: Partial<Project>) => {
    try {
      const response = await projectsApi.update(id, updates);
      setProjects(projects.map(p => p.id === id ? response.data : p));
      return response.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  // ⚠️ UPDATED: id is now number
  const deleteProject = async (id: number) => {
    try {
      await projectsApi.delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  };
};
```

### 8.3 Component Example

```typescript
// components/ProjectCard.tsx
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (id: number) => void;     // Changed from string
  onDelete: (id: number) => void;   // Changed from string
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="project-card">
      <img src={project.imgurl} alt={project.title} />
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="technologies">{project.technologies}</div>
      
      <div className="actions">
        <button onClick={() => onEdit(project.id)}>Edit</button>
        <button onClick={() => onDelete(project.id)}>Delete</button>
      </div>
      
      <div className="links">
        <a href={project.gitlink} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={project.liveurl} target="_blank" rel="noopener noreferrer">
          Live Demo
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
```

---

## 9. Error Handling

### Standard Error Response Format

```typescript
// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return `Validation Error: ${data}`;
      case 401:
        return `Unauthorized: ${data}`;
      case 404:
        return `Not Found: ${data}`;
      case 500:
        return `Server Error: ${data}`;
      default:
        return `Error ${status}: ${data}`;
    }
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    return `Error: ${error.message}`;
  }
};

// Usage in component
try {
  await projectsApi.delete(projectId);
  toast.success('Project deleted successfully');
} catch (error) {
  const errorMessage = handleApiError(error);
  toast.error(errorMessage);
}
```

---

## 10. Migration Checklist for Frontend

### ✅ Update These in Your Frontend Code:

#### 1. Type Definitions
```typescript
// BEFORE
interface Project {
  id: string;
}

// AFTER
interface Project {
  id: number;
}
```

#### 2. API Calls
```typescript
// BEFORE
axios.delete(`/projects/del/${projectId}`);  // projectId: string

// AFTER
axios.delete(`/projects/del/${projectId}`);  // projectId: number
```

#### 3. State Management (Redux/Context)
```typescript
// BEFORE
const [selectedId, setSelectedId] = useState<string>('');

// AFTER
const [selectedId, setSelectedId] = useState<number | null>(null);
```

#### 4. Local Storage
```typescript
// BEFORE
localStorage.setItem('projectId', projectId);  // "507f..."

// AFTER
localStorage.setItem('projectId', projectId.toString());  // "1"
```

#### 5. URL Parameters
```typescript
// React Router BEFORE
const { id } = useParams<{ id: string }>();

// React Router AFTER
const { id } = useParams<{ id: string }>();
const numericId = Number(id);  // Convert to number
```

#### 6. Comparisons
```typescript
// BEFORE
if (project.id === selectedId) { }

// AFTER
if (project.id === selectedId) { }  // Both are numbers now
```

---

## 11. Complete Example: CRUD Operations

```typescript
// Example: Complete Project Management Component
import React, { useState, useEffect } from 'react';
import { projectsApi } from './api/portfolioApi';
import { Project } from './types';

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Load projects
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsApi.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create
  const handleAdd = async (projectData: Omit<Project, 'id'>, image?: File) => {
    try {
      const response = await projectsApi.add(projectData, image);
      setProjects([...projects, response.data]);
      alert('Project added successfully!');
    } catch (error) {
      alert('Failed to add project');
    }
  };

  // Update - ⚠️ ID is now number
  const handleUpdate = async (id: number, updates: Partial<Project>) => {
    try {
      const response = await projectsApi.update(id, updates);
      setProjects(projects.map(p => p.id === id ? response.data : p));
      alert('Project updated successfully!');
    } catch (error) {
      alert('Failed to update project');
    }
  };

  // Delete - ⚠️ ID is now number
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectsApi.delete(id);
      setProjects(projects.filter(p => p.id !== id));
      alert('Project deleted successfully!');
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  return (
    <div>
      <h1>Projects</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <button onClick={() => handleUpdate(project.id, { 
                title: 'Updated Title' 
              })}>
                Edit
              </button>
              <button onClick={() => handleDelete(project.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
```

---

## 12. Testing with Axios Interceptors

```typescript
// api/interceptors.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2420',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## Summary of Changes for Frontend

### 🔴 Breaking Changes:
1. **All ID types changed from `string` to `number`**
2. **API paths remain the same, but parameter types differ**

### ✅ What Stays the Same:
1. **Base URLs** - No change
2. **Endpoint paths** - No change
3. **Request/Response structure** - Only ID fields changed
4. **CORS settings** - Still enabled for all origins

### 📋 Action Items:
- [ ] Update all TypeScript interfaces (change `id: string` to `id: number`)
- [ ] Update API service functions (parameter types)
- [ ] Update component props (ID parameters)
- [ ] Update state management (Redux/Context)
- [ ] Update URL parameter handling
- [ ] Test all CRUD operations
- [ ] Update local storage handling
- [ ] Check comparison operators
- [ ] Test with new backend API

---

**API Base URL:** `http://localhost:2420`  
**Backend Version:** MySQL Migration (Nov 2025)  
**Documentation Version:** 1.0  

For backend setup instructions, see `QUICK_START.md`
