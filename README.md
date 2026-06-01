# Employee Management System (EMS)

A full-stack, enterprise-grade **Employee Management System (EMS)** built with **Django REST Framework** as the backend and **React (TypeScript)** as the frontend.

The application provides a secure and scalable platform for managing companies, departments, and employees through a robust **Role-Based Access Control (RBAC)** architecture powered by **JSON Web Tokens (JWT)**.

---

## 🚀 Features

### 🔐 Role-Based Access Control (RBAC)

Three distinct user roles with strict permission boundaries:

- **System Administrator**
  - Full access to all companies, departments, and employees.
  - Create, update, and delete any record.

- **HR Manager**
  - Manage departments and employees within assigned companies.
  - Restricted from accessing data outside their company.
  - Cannot create or delete companies.

- **Employee**
  - Read-only access to personal profile information.
  - View employment details and statistics.

### 🔑 Secure Authentication

- JWT-based authentication using `djangorestframework-simplejwt`.
- Secure login and token management.
- Frontend decodes JWT payloads to dynamically render UI elements based on user permissions.

### 🏢 Multi-Tenant Data Isolation

- HR Managers can only access records associated with their assigned companies.
- Strict backend enforcement prevents unauthorized data access.

### 📊 Dynamic Data Processing

- Real-time **Days Employed** calculation on the frontend.
- Backend aggregation for:
  - Department employee counts
  - Company department counts
  - Employee statistics

### 🎨 Modern User Experience

- Responsive design with Tailwind CSS.
- Protected routes and role-based navigation.
- Interactive data tables.
- Toast notifications for user feedback.
- Loading skeletons and smooth user interactions.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- React Router DOM
- Tailwind CSS
- React Hot Toast
- Axios

### Backend

- Django
- Django REST Framework (DRF)
- SimpleJWT
- Django ORM

### Database

- SQLite (Development)
- PostgreSQL (Production Ready)

---

## 🏗️ System Architecture

```text
React (TypeScript)
        │
        ▼
 JWT Authentication
        │
        ▼
 Django REST Framework API
        │
        ▼
 SQLite / PostgreSQL
```

### Security Highlights

- Custom ViewSet permission enforcement.
- Backend-level access restrictions.
- JWT-based authorization.
- Self-deletion protection for active users.
- Secure serializer configurations using `write_only=True`.
- API request validation independent of frontend restrictions.

---

## 📂 Project Structure

```text
EMS/
│
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Django Backend
│   ├── apps/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

---

## 💻 Local Development Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Youssefanter/EMS-Eben

cd employee-management-system
```

---

### 2️⃣ Configure `.gitignore`

Create a `.gitignore` file in the project root:

```plaintext
client/node_modules/
client/build/
client/dist/
client/.env

server/__pycache__/
server/venv/
server/env/
server/*.pyc

.env
```

---

## 🔧 Backend Setup (Django)

Navigate to the server directory:

```bash
cd server
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Linux / macOS:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Migrations

```bash
python manage.py makemigrations

python manage.py migrate
```

### Create System Administrator

```bash
python manage.py createsuperuser
```

### Start Backend Server

```bash
python manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000/
```

---

## ⚛️ Frontend Setup (React)

Open a new terminal:

```bash
cd client
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173/
```

---

## 🔐 Permission Matrix

| Action             | Admin | HR Manager    | Employee    |
| ------------------ | ----- | ------------- | ----------- |
| View Companies     | ✅    | Assigned Only | ❌          |
| Create Company     | ✅    | ❌            | ❌          |
| Edit Company       | ✅    | ❌            | ❌          |
| Delete Company     | ✅    | ❌            | ❌          |
| View Departments   | ✅    | Assigned Only | ❌          |
| Manage Departments | ✅    | Assigned Only | ❌          |
| View Employees     | ✅    | Assigned Only | Own Profile |
| Manage Employees   | ✅    | Assigned Only | ❌          |
| Delete Employees   | ✅    | Assigned Only | ❌          |

---

## 💡 Architectural Highlights

### Custom Permission Enforcement

Django ViewSets implement custom permission checks through:

- `check_permissions()`
- `perform_create()`
- `perform_update()`
- `perform_destroy()`

This ensures unauthorized requests are blocked at the API level.

### Smart Serializers

Leveraging:

- `SerializerMethodField`
- Nested serializers
- `write_only=True`
- Dynamic aggregation logic

for secure and optimized data handling.

### JWT-Based UI Rendering

The React frontend decodes JWT payloads synchronously to:

- Determine user permissions instantly.
- Prevent UI flickering.
- Protect restricted routes.
- Render role-specific navigation menus.

### Self-Deletion Protection

Custom backend safeguards prevent users from deleting their own active accounts, protecting system integrity.

---


## 🔮 Future Enhancements

- Employee attendance tracking
- Leave management system
- Payroll integration
- Audit logging
- Email notifications
- Analytics dashboard
- Docker deployment
- CI/CD pipeline

---

## 👨‍💻 Developer

**Youssef Antar**

Integration Developer | Backend & Full-Stack Enthusiast

Feel free to connect, contribute, or provide feedback to improve the project.
