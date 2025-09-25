# 👗 Fashion Swap Platform

A full-stack web application for swapping, selling, and donating fashion items. Users can create cultural posts, comment, send messages, and manage swap requests in a community-driven fashion marketplace.

> **🚀 Live Demo**: [https://fashion-swap-production.up.railway.app](https://fashion-swap-production.up.railway.app)

---

## 🧪 **Try the API Instantly**

### **Interactive Testing**
**📋 Postman Collection**: [Test All Endpoints](https://peter-5800517.postman.co/workspace/Peter's-Workspace~2df473a8-e544-43d1-8068-98f3f60c92d7/collection/43612780-f1be958b-e393-4fcd-85cd-b9533fa7ae6c?action=share&creator=43612780&active-environment=43612780-5c8e54c2-8ce3-495b-b79e-31c1fd7c180f)

**How to Test:**
1. Click the Postman link above
2. Fork/Import the collection 
3. Test the complete user journey:
   - 👤 Register → Login → Get auth token
   - 👗 Create fashion items
   - 🔄 Send swap requests  
   - 📝 Create cultural posts
   - 💬 Send messages

### **Quick API Verification**
```bash
# Test if API is running
curl https://fashion-swap-production.up.railway.app/api/items

# Register a test user
curl -X POST https://fashion-swap-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login and get auth token
curl -X POST https://fashion-swap-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## ✨ **Features**

### **Core Functionality**
- 🔐 **JWT Authentication** - Secure user registration and login
- 👤 **User Profiles** - Avatar upload and profile management
- 🛍️ **Fashion Item Management** - CRUD operations for clothing items
- 🔄 **Smart Swap System** - Request, approve, and complete item swaps
- 📝 **Cultural Posts** - Community content with comments system
- 💬 **Messaging System** - Direct communication between users
- 📊 **Admin Controls** - Content moderation and user management

### **Technical Highlights**
- RESTful API architecture
- PostgreSQL database with Sequelize ORM
- JWT-based authentication
- File upload handling with Multer
- Comprehensive error handling
- Input validation and sanitization

---

## 🏗️ **Architecture & Design**

### **Project Structure**
```
fashion-swap/
├── src/
│   ├── controllers/     # Request handlers & business logic
│   ├── models/         # Database models (Sequelize)
│   ├── routes/         # API route definitions
│   ├── middlewares/    # Authentication, validation, error handling
│   ├── app.js          # Express app configuration
│   └── server.js       # Server startup and port listening
├── config/             # Database and app configuration
├── migrations/         # Database schema changes
├── tests/             # Jest test suites
├── uploads/           # File upload storage
├── screenshots/       # Application screenshots
├── seeders/          # Database seed data
└── fashion-swap-frontend/  # Frontend HTML/CSS/JS files
```

### **Database Schema**
- **Users** - Authentication and profile data
- **Items** - Fashion item catalog
- **Swaps** - Swap request management
- **Posts** - Cultural content system
- **Messages** - User communication
- **Comments** - Post interactions

### **API Design Principles**
- **RESTful endpoints** with clear HTTP methods
- **Consistent JSON responses** with proper status codes
- **JWT authorization** for protected routes
- **Input validation** on all endpoints
- **Error handling** with descriptive messages

---

## ⚙️ **Technology Stack**

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Primary database
- **Sequelize** - ORM and database migrations
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling

### **Frontend** 
- **HTML5/CSS3** - Structure and styling
- **Vanilla JavaScript** - Client-side logic
- **Axios** - HTTP client for API calls

### **DevOps & Deployment**
- **Railway** - Cloud hosting platform
- **GitHub** - Version control and CI/CD
- **Jest + Supertest** - Testing framework
- **Postman** - API documentation and testing

---

## 📡 **API Documentation**

### **🔑 Authentication Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| GET | `/api/auth/user/:id` | Get user by ID | ✅ |
| PUT | `/api/auth/user/update` | Update user profile | ✅ |
| DELETE | `/api/auth/user/:id` | Delete user account | ✅ |

### **👗 Fashion Items**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/items/create` | Create new item | ✅ |
| GET | `/api/items` | Get all items | ❌ |
| GET | `/api/items/:id` | Get item by ID | ❌ |
| PUT | `/api/items/update/:id` | Update item | ✅ |
| DELETE | `/api/items/:id` | Delete item | ✅ |

### **🔄 Swap Management**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/swaps/create` | Send swap request | ✅ |
| GET | `/api/swaps` | Get user's swaps | ✅ |
| PUT | `/api/swaps/:id/respond` | Accept/decline swap | ✅ |
| PUT | `/api/swaps/:id/complete` | Mark swap complete | ✅ |

### **📝 Cultural Posts**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/post/create` | Create new post | ✅ |
| GET | `/api/post` | Get all posts | ❌ |
| GET | `/api/post/:id` | Get post details | ❌ |
| PUT | `/api/post/:id` | Update post | ✅ |
| DELETE | `/api/post/:id` | Delete post | ✅ |

### **💬 Comments & Messages**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/post/:id/comments` | Add comment | ✅ |
| GET | `/api/post/:id/comments` | Get post comments | ❌ |
| DELETE | `/api/post/:id/comments/:commentId` | Delete comment | ✅ |
| POST | `/api/messages/send` | Send message | ✅ |
| GET | `/api/messages/inbox` | Get inbox messages | ✅ |

---

## 🚀 **Local Development Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

### **Installation**
```bash
# Clone the repository
git clone https://github.com/eesuola/fashion-swap.git
cd fashion-swap

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx sequelize-cli db:migrate

# Start development server
npm run dev
```

### **Environment Variables**
```env
# Database
DB_HOST=localhost
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=fashion_swap_dev

# Authentication
JWT_SECRET=your_jwt_secret_key

# Server
PORT=8000
NODE_ENV=development
```

---

## 🧪 **Testing**

### **Run Tests**
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- user.test.js
```

### **Test Structure**
- `tests/auth.test.js` - Authentication endpoints
- `tests/items.test.js` - Fashion item CRUD
- `tests/swaps.test.js` - Swap request flow
- `tests/posts.test.js` - Cultural posts
- `tests/messages.test.js` - Messaging system

---

## 🚢 **Deployment**

This application is deployed on Railway with:
- **Automatic deployments** from the main branch
- **PostgreSQL database** with SSL
- **Environment variable** management
- **Custom domain** support

### **Production URL**
**https://fashion-swap-production.up.railway.app**

---

## 📈 **Future Enhancements**

- [ ] Real-time messaging with WebSockets
- [ ] Image optimization and CDN integration
- [ ] Advanced search and filtering
- [ ] Email notifications for swaps
- [ ] Mobile app development
- [ ] Payment integration for premium features
- [ ] AI-powered item recommendations

---

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📝 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Peter Eesuola**
- GitHub: [@eesuola](https://github.com/eesuola)


## 🙏 **Acknowledgments**

- Built with modern Node.js and Express.js
- Database powered by PostgreSQL
- Deployed on Railway platform
- Tested with Jest and Supertest

---

*Built with ❤️ for sustainable fashion and community sharing*