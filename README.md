# 👗 ClosetApp — Digital Wardrobe & Outfit Generator

A full-stack wardrobe management web application that lets users upload and organise their clothing, automatically generate outfit combinations, and save favourite looks for later.

**Live App:** https://closet-app-pi.vercel.app  
**Repository:** https://github.com/SIMONAB7/closetApp

---

## 📖 About the Project

ClosetApp was created to make choosing an outfit quicker and less stressful.

Instead of trying to remember everything in your wardrobe, users can build a digital collection of their own clothing. Each item can be uploaded with an image, name, category and custom tags. The application can then use the saved wardrobe to generate outfit combinations, which can be reshuffled until the user finds a look they like.

Generated outfits can also be saved, creating a personal collection of looks that can be revisited later.

The project demonstrates full-stack web development using **React, Node.js, Express and MongoDB**, including persistent database storage and deployment of separate frontend and backend services.

---

## ✨ Features

### 👕 Digital Wardrobe

Users can create a visual wardrobe containing their own clothing.

Each piece can include:

- An uploaded image
- Item name
- Clothing category
- Custom tags

Clothing can also be removed from the wardrobe when it is no longer needed.

### 📸 Image Upload

Items can be added through an upload modal.

The interface supports:

- Selecting an image from the device
- Drag-and-drop image upload
- Image preview before saving
- Item information and tagging

### 🗂️ Clothing Categories

Items can be organised into categories including:

- Tops
- Bottoms
- Dresses
- Shoes
- Accessories
- Bags

The wardrobe can be filtered by category, making larger collections easier to browse.

### 🏷️ Custom Tags

Users can add their own comma-separated tags to clothing, for example:

`casual`, `beige`, `oversized`

These provide additional information about each piece beyond its main category.

### 🎲 Outfit Generator

The **Today's Look** generator creates an outfit using clothing already stored in the wardrobe.

It attempts to build a look from available outfit slots such as:

- Tops
- Bottoms
- Shoes
- Outerwear
- Accessories

A random item from each available category is selected to create the combination.

Users can generate another combination using the **Reshuffle** option.

> The current generator uses category-based random selection rather than an AI/ML recommendation model.

### ❤️ Saved Outfits

When a generated combination works well, it can be saved as a look.

Saved outfits include:

- Outfit name
- Clothing pieces used
- Clothing categories
- Date saved

Saved looks are displayed separately from the main wardrobe and can be removed when no longer required.

### 📊 Wardrobe Overview

The application header provides a simple overview showing:

- Number of clothing pieces
- Number of saved looks

### 💾 Persistent Storage

Wardrobe items and saved outfits are stored through the backend rather than existing only in React state.

This means the application can retrieve previously saved data when it loads again.

---

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React |
| Language | JavaScript |
| Backend | Node.js |
| API | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Styling | CSS |
| Configuration | dotenv |
| Cross-Origin Requests | CORS |
| Frontend Deployment | Vercel |
| Backend Deployment | Railway |

---

## 🏗️ Architecture

ClosetApp follows a simple full-stack client/server architecture:

```text
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│ Wardrobe │ Generator │ Looks │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│      Node.js + Express       │
│          REST API            │
│                              │
│   GET /api/:key              │
│   POST /api/:key             │
└──────────────┬───────────────┘
               │
               │ Mongoose
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│                              │
│ Wardrobe items + outfits     │
└──────────────────────────────┘
```

The React frontend sends requests to the Express API. The backend uses Mongoose to communicate with MongoDB and persist the wardrobe data.

---

## 🗄️ Data Storage

The backend uses a flexible Mongoose schema:

```text
Wardrobe
├── key
└── data
```

The `key` identifies the type of stored collection, such as:

```text
items
outfits
```

The `data` field stores the corresponding array.

The frontend therefore communicates with endpoints such as:

```text
GET  /api/items
POST /api/items

GET  /api/outfits
POST /api/outfits
```

`GET` retrieves the current data, while `POST` updates the stored collection.

---

## 🔄 Application Flow

```text
User uploads clothing
        ↓
Image + item information entered
        ↓
Item added to React state
        ↓
Frontend sends updated wardrobe to API
        ↓
Express backend
        ↓
MongoDB
        ↓
Wardrobe is available when app reloads
```

For outfit creation:

```text
Saved Wardrobe
      ↓
Group available items by category
      ↓
Random item selected from each outfit slot
      ↓
Generated Look
      ↓
Reshuffle OR Save
      ↓
Saved Outfits
      ↓
MongoDB
```

---

## 📁 Project Structure

```text
closetApp/
│
├── public/
│
├── src/
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   └── setupTests.js
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### `src/App.js`

Contains the main application functionality, including:

- Wardrobe state
- Clothing upload modal
- Clothing cards
- Category filtering
- Outfit generation
- Saved outfit cards
- API communication

### `server.js`

Contains the Express backend, including:

- MongoDB connection
- Mongoose wardrobe model
- CORS configuration
- GET API endpoint
- POST API endpoint
- Health/ping endpoint

---

## 🚀 Running the Project Locally

### Prerequisites

Make sure you have:

- Node.js
- npm
- A MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/SIMONAB7/closetApp.git
cd closetApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
```

Do **not** commit your `.env` file or database credentials to GitHub.

### 4. Start the backend

```bash
npm start
```

The Express server uses port `5001` by default.

### 5. Start the React development server

Open another terminal and run:

```bash
npm run dev
```

The React application should then be available at:

```text
http://localhost:3000
```

By default, the frontend communicates with:

```text
http://localhost:5001/api
```

A different backend can be configured with the `REACT_APP_API_URL` environment variable.

---

## 🌐 Deployment

The application is deployed as separate frontend and backend services.

### Frontend

The React application is deployed using **Vercel**.

### Backend

The Node.js/Express API is deployed using **Railway**.

### Database

MongoDB provides persistent storage for clothing and outfit data.

The production frontend communicates with the deployed API while CORS is configured to allow both the production Vercel application and the local development environment.

---

## 💡 What This Project Demonstrates

ClosetApp demonstrates practical experience with:

- Building interactive interfaces with React
- React state management and hooks
- Creating reusable UI components
- Handling user image uploads with the browser File API
- Drag-and-drop interfaces
- Dynamic filtering
- Algorithmic outfit generation
- Asynchronous JavaScript
- REST API communication using `fetch`
- Building APIs with Node.js and Express
- MongoDB persistence
- Mongoose schemas and database operations
- Environment variables
- CORS configuration
- Full-stack deployment
- Connecting independently deployed frontend and backend services

---

## 🔮 Possible Future Improvements

Potential extensions to ClosetApp include:

- User accounts and authentication
- Separate wardrobes for individual users
- More advanced outfit matching
- Colour-based outfit recommendations
- Weather-aware recommendations
- Occasion-based outfit generation
- Seasonal filtering
- Favourite clothing items
- Search functionality
- Editing existing wardrobe items
- Usage statistics
- Improved image storage
- Mobile optimisation
- AI-assisted outfit recommendations

---

## 🎯 Project Goal

The aim of ClosetApp is simple:

> **Make choosing what to wear easier by turning a user's existing clothes into an organised digital wardrobe and quickly generating outfit ideas from what they already own.**

Rather than suggesting new products to buy, the application focuses on making better use of clothing already available in the user's wardrobe.

---

## 👩‍💻 Author

**Simona Bosilkova**

GitHub: https://github.com/SIMONAB7
If any questions please feel free to contact me! LinkedIn: www.linkedin.com/in/simona-bosilkova-38b52b25a

---

## 🔗 Links

- **Live Application:** https://closet-app-pi.vercel.app
- **Source Code:** https://github.com/SIMONAB7/closetApp
