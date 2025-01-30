# 🏺 Kalakriti: Empowering Indian Artisans Digital Marketplace

## 🌟 Project Overview

Kalakriti is a comprehensive mobile application designed to bridge the gap between traditional Indian artisans and modern consumers. The platform aims to preserve, promote, and provide sustainable livelihood opportunities for rural craftspeople by creating a digital ecosystem that supports their craft.

## 🚀 Key Features

### For Artisans
- 📦 Product Management
- 💰 Earnings Tracking
- 🎨 Design Idea Generation
- 📚 Skill Development Resources
- 📊 Performance Analytics

### For Buyers
- 🛒 Handcrafted Product Marketplace
- 🔍 Category-based Product Browsing
- 🤝 Direct Artisan Interaction
- 📱 Augmented Reality Product Visualization
- 🛍️ Wishlist and Cart Management

## 🛠 Tech Stack

### Frontend
- React Native
- Expo
- Redux (State Management)
- React Navigation
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM

### Key Integrations
- Gemini AI (Design Generation)
- Cloudinary (Image Management)
- Razorpay (Payment Gateway)

## 📦 Prerequisites

- Node.js (v16+)
- npm or Yarn
- Expo CLI
- MongoDB
- Android Studio / Xcode

## 🔧 Installation

### Clone the Repository
```bash
git clone https://github.com/yourusername/kalakriti.git
cd kalakriti
```

### Install Dependencies
```bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
```

### Environment Setup
Create `.env` files in both backend and frontend directories with necessary configurations:

#### Backend `.env`
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend `.env`
```
API_BASE_URL=http://your_backend_url
```

## 🚀 Running the Application

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
expo start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `POST /api/products`

### Orders
- `GET /api/orders`
- `POST /api/orders`

## 🎨 Design Principles

- User-Centric Design
- Multilingual Support (English & Hindi)
- Accessibility
- Performance Optimization
- Responsive UI

## 🔒 Security Features

- JWT Authentication
- Password Hashing
- Role-Based Access Control
- Input Validation
- Secure API Endpoints

## 📊 Performance Metrics

- Lighthouse Score: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <2s

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/yourusername/kalakriti](https://github.com/yourusername/kalakriti)

## 🙏 Acknowledgements

- React Native Community
- Expo
- MongoDB
- Cloudinary
- Gemini AI
- Indian Artisan Communities

---

**Built with ❤️ to support and empower Indian Artisans**