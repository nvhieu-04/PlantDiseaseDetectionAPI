# Plant Disease Detection REST API

A comprehensive Node.js REST API for plant disease detection and management, featuring user authentication, room-based plant organization, file upload capabilities, and access to agricultural datasets.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based authentication system with signup/login
- **Plant Management**: CRUD operations for plants with health status tracking
- **Room Organization**: Organize plants by rooms/locations with floor information
- **File Upload**: Support for uploading plant images and PyTorch models
- **Dataset Access**: Pre-configured access to 32+ agricultural disease datasets

### Technical Features
- **RESTful API**: Clean, organized API endpoints
- **MongoDB Integration**: Mongoose ODM for database operations
- **File Handling**: Multer-based file upload with validation
- **Security**: Password hashing with bcrypt, JWT authentication
- **Error Handling**: Comprehensive error handling and validation
- **Static File Serving**: Direct access to uploaded images and models

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **Development**: nodemon for auto-restart

## 📁 Project Structure

```
restAPIdisease/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── config/
│   ├── db.js             # MongoDB connection configuration
│   └── constants.js      # Application constants
├── models/
│   ├── User.js           # User data model
│   ├── Plant.js          # Plant data model
│   ├── Room.js           # Room data model
│   └── Dataset.js        # Dataset data model
├── routes/
│   ├── user.js           # User and plant management routes
│   └── datasets.js       # Dataset management routes
├── middlewares/
│   └── auth.js           # JWT authentication middleware
├── images/               # Uploaded plant images storage
└── modelsPytorch/        # Uploaded PyTorch models storage
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restAPIdisease
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/plantdisease
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=2days
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📊 Database Models

### User Model
- `username`: String (required)
- `email`: String (required, unique)
- `password`: String (hashed)
- `img`: String (profile image)
- `createdAt`: Date

### Plant Model
- `namePlant`: String (required)
- `nameRoom`: String (required)
- `healthStatus`: String (required)
- `userID`: String (required)
- `imagePlant`: String
- `id`: UUID
- `createdAt`: Date

### Room Model
- `nameRoom`: String (required)
- `idUser`: String (required)
- `imageRoom`: String (required)
- `floor`: String (required)
- `id`: UUID
- `createdAt`: Date

### Dataset Model
- `nameDataset`: String (required)
- `url`: String (required)
- `createdAt`: Date

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/signup` | Register new user | No |
| POST | `/user/login` | User login | No |
| GET | `/user/me` | Get current user | Yes |

### Plant Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/createPlant` | Create new plant | No |
| GET | `/user/getPlant` | Get all plants | Yes |
| PUT | `/user/updatePlant/:id` | Update plant | Yes |
| DELETE | `/user/deletePlant/:id` | Delete plant | Yes |

### Room Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/createRoom` | Create new room | No |
| GET | `/user/getRoom` | Get all rooms | Yes |
| PUT | `/user/updateRoom/:id` | Update room | No |
| DELETE | `/user/deleteRoom/:id` | Delete room | Yes |

### File Upload
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/uploadImage` | Upload plant image | No |
| POST | `/user/uploadModel` | Upload PyTorch model | No |
| DELETE | `/user/deleteImage` | Delete image file | No |
| DELETE | `/user/deleteModel` | Delete model file | No |

### Dataset Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/datasets/link` | Get all available datasets | No |
| POST | `/datasets/download` | Save dataset reference | No |
| GET | `/datasets/download` | Get dataset URL | No |
| DELETE | `/datasets/download` | Remove dataset reference | No |

## 📋 Available Datasets

The API provides access to 32+ agricultural disease datasets including:

- **Citrus**: Citrus fruits and leaves datasets
- **Corn**: Multiple corn disease datasets (leaf diseases, infections)
- **Rice**: Various rice disease image datasets
- **Cotton**: Cotton leaf disease datasets
- **Potato**: Potato leaf datasets
- **Wheat**: Wheat disease and fungi datasets
- **Sugarcane**: Red rot and general disease datasets
- **Tomato**: Tomato leaf image datasets
- **PlantVillage**: Comprehensive plant disease dataset
- And many more...

All datasets are hosted and accessible via direct download links.

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: express-validator for request validation
- **File Type Validation**: Restricted file uploads (images: PNG/JPG/JPEG, models: PT/PTL/PTH)
- **File Size Limits**: 1MB for images, 100MB for models
- **Error Handling**: Sanitized error responses

## 🧪 Usage Examples

### User Registration
```bash
curl -X POST http://localhost:3000/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create Plant
```bash
curl -X POST http://localhost:3000/user/createPlant \
  -H "Content-Type: application/json" \
  -d '{
    "namePlant": "Tomato Plant 1",
    "nameRoom": "Greenhouse A",
    "healthStatus": "Healthy",
    "userID": "user_id_here",
    "imagePlant": "plant_image.jpg"
  }'
```

### Upload Plant Image
```bash
curl -X POST http://localhost:3000/user/uploadImage \
  -F "image=@plant_photo.jpg"
```

## 🚀 Deployment

### Production Considerations
1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2
3. Set up reverse proxy (nginx)
4. Configure SSL/TLS certificates
5. Use cloud MongoDB service (MongoDB Atlas)
6. Set up proper logging and monitoring
7. Configure file storage (AWS S3, Google Cloud Storage)

### Docker Deployment (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🔮 Future Enhancements

- [ ] Add machine learning model integration for disease prediction
- [ ] Implement real-time notifications
- [ ] Add plant care scheduling
- [ ] Include weather data integration
- [ ] Add mobile app support
- [ ] Implement plant growth tracking
- [ ] Add export functionality for plant data
- [ ] Include plant care recommendations

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: This is a backend API project. For frontend integration, ensure proper CORS configuration and API endpoint consumption in your client application.
