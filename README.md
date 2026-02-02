
# CRUDTASK - Academic Task Management System

## 📋 Description

Full-stack simulation for the **CRUDTASK** platform, a specialized system for managing academic tasks. This project implements a complete workflow including authentication, role-based access control (User/Admin), and real-time data simulation using a mock API.
The design is strictly based on the provided [Figma specification](https://www.figma.com/design/K3PmKIOlfEsjnbwP54Yc2x/Sin-t%C3%ADtulo?nodeid=33-2&t=Q7CZdp6XFatVh7wZ-1).

## 📁 File Structure

```text
CRUDTASK/
├── assets/                 # Recursos estáticos
│   ├── css/
│   │   └── styles.css      # Estilos globales y personalizados
│   ├── img/                # Imágenes y logos
│   └── js/                 # Lógica del frontend
│       ├── api/
│       │   └── client.js   # Configuración de Fetch/Axios para JSON Server
│       ├── auth/
│       │   ├── login.js    # Lógica de inicio de sesión
│       │   └── register.js # Lógica de registro
│       ├── modules/
│       │   ├── admin/
│       │   │   ├── dashboard.js
│       │   │   └── manage-tasks.js
│       │   └── user/
│       │       ├── tasks.js
│       │       └── profile.js
│       └── utils/
│           ├── storage.js  # Helpers para LocalStorage/SessionStorage
│           └── guards.js   # Protección de rutas por rol
├── pages/                  # Vistas HTML (excepto index.html)
│   ├── admin/
│   │   ├── dashboard.html
│   │   └── manage-tasks.html
│   └── user/
│       ├── tasks.html
│       └── profile.html
├── data/
│   └── db.json             # Tu base de datos para JSON Server
├── index.html              # Punto de entrada (Login/Registro)
├── .gitignore              # Ignorar node_modules y otros
└── README.md            # Mock Database

```

## 🎨 Views Included

### 1. Login & Registration

* **Unified Login:** Credential validation against JSON Server.
* **Auto-Role Assignment:** New sign-ups are automatically assigned the `user` role.
* **Session Persistence:** Keeps user logged in using `localStorage`.

### 2. User Module (`role: user`)

* **Task Management:** Create, Read, Update, and Delete (CRUD) personal tasks.
* **Status Tracking:** Toggle between `pending`, `in progress`, and `completed`.
* **Personal Profile:** View user data and secure logout.

### 3. Admin Module (`role: admin`)

* **System Dashboard:** Global metrics (Total, Pending, and Completed tasks).
* **Global Supervision:** View and manage tasks from all users.
* **Role Security:** Restricted access to administrative tools.

## 🎯 Design Features

✅ **Core Requirements**

* **Semantic HTML5:** Proper use of navigation, main, and section tags.
* **Framework Integration:** Modern UI built with **Tailwind CSS / Bootstrap 5**.
* **Role-Based Access Control (RBAC):** Users cannot access admin views and vice-versa.
* **API Integration:** Full communication with **JSON Server**.

✅ **UI/UX System**

* **Responsive:** Fully adapted for Mobile, Tablet, and Desktop.
* **Figma-to-Code:** High-fidelity implementation of defined components.
* **Feedback:** Visual alerts for errors, success, and loading states.

## 🛠️ Tech Stack

* **HTML5 & CSS3:** Structural foundation and custom styling.
* **JavaScript (Vanilla):** Core logic without external frameworks.
* **CSS Framework:** Tailwind CSS / Bootstrap 5 / Materialize.
* **Backend Simulation:** JSON Server (Mock API).
* **Storage:** LocalStorage/SessionStorage for session management.

## 🚀 How to Use

### 1. Start the Mock API

Ensure you have Node.js installed, then run:

```bash
# Install json-server if you haven't
npm install -g json-server

# Run the database
json-server --watch db.json --port 3000

```

### 2. Launch the Application

Open `public/index.html` in your browser using a local server (like Live Server in VS Code).

## ⚖️ Security & Business Rules

> **Important:**
> * **Route Protection:** If no session is detected, the app redirects to Login.
> * **Data Privacy:** A user can **only** see their own tasks.
> * **Admin Power:** Only admins can see the dashboard and edit any system task.
> 
> 

## 📝 Technical Notes

* **API Base:** `http://localhost:3000`
* **State Management:** Session handled via encrypted-like objects in `localStorage`.
* **Responsive Breakpoints:** Mobile-first approach for all management tables.

---
