# MERN E-commerce Product Catalog

A full-stack product catalog application built with the **MERN** stack. Products and
categories are stored in **MongoDB** and served through a **REST API** built with
**Express**, then rendered in a **React (Vite)** frontend that also ships a fully
functional **shopping cart**.

---

## Features

### Backend
- REST API built with Express 4 and Mongoose 8
- **Relational modelling in NoSQL** — `Product.category` stores a MongoDB
  `ObjectId` reference to the `Category` collection (`ref: 'Category'`)
- Mongoose `.populate()` to resolve category references into readable names
- Reverse lookup on `Category` via a Mongoose virtual (`products`)
- Filtering (`?category=`), full-text search (`?search=`), sorting and validation
- Full CRUD for products (`GET` / `POST` / `PUT` / `DELETE`)
- Centralised error responses with consistent `{ success, message, data }` shape
- Seeder script for repeatable demo data
- Standalone DB verification script (raw driver + Mongoose comparison)

### Frontend
- Product grid fetched live from the Express API (no hard-coded/mock data)
- Live search across product name and description
- Category filter chips driven by the database
- Slide-in shopping cart drawer
  - add / remove items
  - increase / decrease quantity (with stock limit checks)
  - subtotal, shipping and grand total calculation
  - free-shipping threshold hint
- Rating stars, low-stock badges, "added to cart" toast
- Loading, error and empty states
- Responsive layout with automatic dark-mode support

---

## Tech Stack

| Layer     | Technology                                       |
| --------- | ------------------------------------------------ |
| Frontend  | React 19, Vite 8, plain CSS                       |
| Backend   | Node.js, Express 4                                |
| Database  | MongoDB with Mongoose 8 (ObjectId relations)      |
| Tooling   | ESLint, Nodemon, dotenv, CORS                     |

---

## Project Structure

```
mern-ecommerce-product-catalog/
├── backend/
│   ├── config/
│   │   └── db.js                  # Mongoose connection
│   ├── controllers/
│   │   ├── productController.js   # Product CRUD handlers
│   │   └── categoryController.js  # Category handlers
│   ├── data/
│   │   ├── seed.js                # Wipes + inserts demo data
│   │   └── verify.js              # Verifies what is actually in MongoDB
│   ├── models/
│   │   ├── Product.js             # Product schema (category -> ObjectId ref)
│   │   └── Category.js            # Category schema + products virtual
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── categoryRoutes.js
│   ├── .env.example               # Environment template (copy to .env)
│   ├── package.json
│   └── server.js                  # Express app entry point
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx / Header.css
│   │   ├── ProductCard.jsx / ProductCard.css
│   │   └── Cart.jsx / Cart.css
│   ├── data/
│   │   └── products.js            # Legacy mock data (no longer imported)
│   ├── App.jsx                    # Data fetching, filters, cart state
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js                 # Dev server + /api proxy config
└── README.md
```

---

## Data Model

Two collections in the `mern_catalog` database.

### `categories`

| Field         | Type   | Notes                     |
| ------------- | ------ | ------------------------- |
| `name`        | String | required, unique, max 50  |
| `description` | String | optional, max 200         |
| `createdAt` / `updatedAt` | Date | added by `timestamps: true` |

Virtual: `products` — lists every product whose `category` points at this document.

### `products`

| Field         | Type       | Notes                                  |
| ------------- | ---------- | -------------------------------------- |
| `name`        | String     | required, max 100                      |
| `description` | String     | required, max 500                      |
| `price`       | Number     | required, min 0                        |
| `category`    | ObjectId   | **required, `ref: 'Category'`, indexed** |
| `image`       | String     | required image URL                     |
| `stock`       | Number     | required, min 0, default 0             |
| `rating`      | Number     | 0–5, default 0                         |
| `createdAt` / `updatedAt` | Date | added by `timestamps: true` |

A text index on `name` + `description` powers the search endpoint.

> **Why ObjectId references instead of embedding?** Categories are shared by many
> products and change independently, so a reference keeps a single source of truth
> and avoids duplicating category data inside every product document.

---

## Prerequisites

- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017`
  (or a MongoDB Atlas connection string)
- npm

---

## Setup & Installation

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd mern-ecommerce-product-catalog

# frontend dependencies
npm install

# backend dependencies
cd backend
npm install
```

### 2. Configure the backend environment

Copy the template and adjust the values:

```bash
cd backend
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
```

`.env` contents:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_catalog
NODE_ENV=development
```

> The database name (`/mern_catalog`) must be present in `MONGO_URI`. Without it,
> Mongoose silently connects to the default `test` database and `populate()` will
> return empty category references.

### 3. Seed the database

```bash
cd backend
npm run seed
```

This clears the `categories` and `products` collections and inserts 6 categories
plus 8 products, wiring each product to a real category `ObjectId`.

### 4. Verify what is stored in MongoDB

```bash
cd backend
node data/verify.js
```

Prints the active database name, collections, raw documents and the same records
fetched through Mongoose with `populate()` applied.

---

## Running the Application

Open **two terminals**.

**Terminal 1 — backend API**

```bash
cd backend
npm run dev          # nodemon on http://localhost:5000
# or: npm start
```

**Terminal 2 — frontend**

```bash
npm run dev          # Vite on http://localhost:5173
```

Open <http://localhost:5173>. Vite proxies every `/api/*` request to
`http://localhost:5000`, so no CORS configuration is needed in development.

---

## API Reference

Base URL: `http://localhost:5000`

| Method   | Endpoint                        | Description                              |
| -------- | ------------------------------- | ---------------------------------------- |
| `GET`    | `/`                             | API metadata and endpoint list           |
| `GET`    | `/api/health`                   | Health check                             |
| `GET`    | `/api/products`                 | List all products (category populated)   |
| `GET`    | `/api/products?category=Electronics` | Filter products by category name     |
| `GET`    | `/api/products?search=watch`    | Search name and description              |
| `GET`    | `/api/products/:id`             | Get one product by ObjectId              |
| `POST`   | `/api/products`                 | Create a product                         |
| `PUT`    | `/api/products/:id`             | Update a product                         |
| `DELETE` | `/api/products/:id`             | Delete a product                         |
| `GET`    | `/api/categories`               | List categories (plus `raw` documents)   |
| `POST`   | `/api/categories`               | Create a category                        |

### Example requests

Create a product — `category` must be a real category `ObjectId`:

```http
POST /api/products
Content-Type: application/json

{
  "name": "Wireless Mouse Pro",
  "description": "Ergonomic RGB wireless gaming mouse, 6 buttons, 16000 DPI",
  "price": 49.99,
  "category": "<category ObjectId from GET /api/categories>",
  "image": "https://example.com/mouse.jpg",
  "stock": 75,
  "rating": 4.4
}
```

Update a product (send only the fields you want to change):

```http
PUT /api/products/<product ObjectId>
Content-Type: application/json

{ "price": 39.99, "stock": 200 }
```

Successful responses follow this shape:

```json
{
  "success": true,
  "count": 8,
  "data": []
}
```

---

## Testing with Postman

1. `GET /api/products` — note the baseline `count`.
2. `GET /api/categories` — copy an `_id` from the `raw` array.
3. `POST /api/products` with the body above — a new `_id` is returned.
4. `PUT /api/products/<new _id>` — change `price` and `stock`.
5. `GET /api/products/<new _id>` — the returned values match step 4, which confirms
   the write was persisted in MongoDB and not just held in memory.
6. `GET /api/products` — the count is now one higher.
7. Optional: `DELETE /api/products/<new _id>` and confirm the count drops back.

---

## npm Scripts

### Root (frontend)

| Script            | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the Vite dev server         |
| `npm run build`   | Production build into `dist/`     |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Run ESLint                        |

### `backend/`

| Script          | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start API with nodemon            |
| `npm start`     | Start API with plain node         |
| `npm run seed`  | Reset and insert demo data        |

---

## Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| `{"success":false,"message":"Route GET / not found"}` | Server still running the old code | Stop the process on port 5000 and restart the backend |
| Frontend shows "Backend connection failed" | API not running | Start the backend (`cd backend; npm run dev`) |
| Category shows as `NO REF!` / empty | `MONGO_URI` missing the database name, so data landed in `test` | Add `/mern_catalog` to `MONGO_URI`, re-run `npm run seed` |
| Changes to backend code have no effect | Only non-nodemon processes were restarted | Restart the running server process |

---

## Notes

- `src/data/products.js` is leftover mock data from the first frontend-only
  iteration. It is no longer imported anywhere — the UI reads exclusively from the
  database through the API.
- `backend/.env` is git-ignored. Only `.env.example` is committed.

---

## License

Created for educational purposes.
