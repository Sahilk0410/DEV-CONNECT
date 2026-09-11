# DevConnect 🚀

A RESTful backend API for a developer community platform.

## Features

* JWT authentication with access & refresh tokens
* User profiles and avatar uploads
* Create, update and delete posts
* Likes, comments, follow/unfollow
* Multer + Cloudinary image uploads
* Protected routes & authorization
* Centralized API error handling

## Tech Stack

**Node.js • Express.js • MongoDB • Mongoose • JWT • bcrypt • Multer • Cloudinary**

## Setup

```bash
git clone https://github.com/Sahilk0410/devconnect.git
cd devconnect
npm install
npm run dev
```

Create a `.env` file with your MongoDB, JWT and Cloudinary credentials.

## Project Structure

```text
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── app.js
└── index.js
```
