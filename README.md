# Simple E-Commerce API  

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen) ![Express](https://img.shields.io/badge/Express-4.21.1-lightgrey) ![MongoDB](https://img.shields.io/badge/MongoDB-8.8-green) ![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## Description  
A **lightweight Node.js API** for agricultural supplies e-commerce with:  
- Product catalog management 
- Product rating functionality  
- User authentication  
- Image upload capabilities  

## Key Features  
- 🔐 **JWT authentication** with `bcryptjs` hashing  
- 🛒 **Product CRUD operations**  
- 📁 **Image uploads** via `multer`  
- 🌐 **CORS-enabled** for frontend integration  

## Tech Stack  
- **Core**: Node.js + Express.js  
- **Database**: MongoDB (Mongoose 8.8)  
- **Auth**: JWT (`jsonwebtoken`)  
- **File Handling**: `multer`  
- **Dev**: `dotenv` for environment management  

## Setup & Installation  
1. **Clone the repository**  
    ```bash
    cd e-commerce
    git clone https://github.com/Eng-Hasan-AlKhateeb/AgriSupplyHub
2. **Install dependencies**  
    ```bash
    npm install
3. **Configure environment variables**
    - Create a .env file with:
        - PORT=3000
        - MONGO_URI=your_mongodb_atlas_connection_string
        - JWT_SECRET=your_jwt_secret_key
4. **Run the server**
    - node app.js

## Ready-to-use Postman collection:

[![Run in Postman](https://run.pstmn.io/button.svg)](./postman/E-commerce.postman_collection.json)

Features included: 

 ✅ All authentication endpoints  
 ✅ Example requests for every route
