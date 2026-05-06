<div align="center">

# Entregas Hub — Backend

**REST API for tracking package deliveries with AI-powered recipient extraction.**

Node.js + Express backend that powers the [`entregas_hub`](https://gitlab.com/mikaeldavidlopes/entregas_hub) Flutter monorepo. Stores delivery records in MongoDB, hosts uploaded label photos, and uses Google Gemini to read the recipient's name straight from the image.

[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A514-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini%201.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

</div>

---

## Overview

`entregas_hub_back_end` is the server side of **Entregas Hub** — a delivery tracking solution for building managers, doormen, and small logistics operations. The companion Flutter app (`entregas_hub`) lets the user snap a photo of a package label; this backend stores the photo, persists the delivery record in MongoDB, and calls Google Gemini Vision to extract the recipient's name automatically — eliminating manual typing.

### Key Features

- **Package CRUD** — list, create, and update delivery records via a clean REST surface
- **Image Uploads** — randomized, collision-safe filenames stored locally and exposed under `/uploads`
- **AI Recipient Extraction** — Google Gemini 1.5 Flash reads the destination name directly from label photos
- **MongoDB Atlas Storage** — persistent, schemaless storage for delivery documents
- **CORS-enabled** — ready to be consumed by the Flutter client or a local web frontend
- **ES Modules** — modern Node.js with native `import`/`export`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Node.js](https://nodejs.org) (>= 14) |
| Framework | [Express 4](https://expressjs.com) |
| Database | [MongoDB](https://www.mongodb.com) (Atlas-ready) via [`mongodb`](https://www.npmjs.com/package/mongodb) driver |
| File Uploads | [`multer`](https://www.npmjs.com/package/multer) with `diskStorage` |
| AI / Vision | [`@google/generative-ai`](https://www.npmjs.com/package/@google/generative-ai) — Gemini 1.5 Flash |
| Auth helpers | [`firebase`](https://www.npmjs.com/package/firebase) + [`firebase-admin`](https://www.npmjs.com/package/firebase-admin) |
| Misc | `cors`, `body-parser`, `dotenv` |

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Route                | Description                                                   |
|--------|----------------------|---------------------------------------------------------------|
| GET    | `/api/packages`      | List every delivery in the `delivery-hub` database            |
| POST   | `/api/packages`      | Create a new delivery from JSON body                          |
| POST   | `/api/upload`        | Upload a label image (multipart `image` field) and get its URL|
| PUT    | `/api/upload/:id`    | Re-process an uploaded image with Gemini and update the record|
| GET    | `/uploads/<file>`    | Static access to any uploaded image                           |

### Sample response — `GET /api/packages`

```json
{
  "status": 200,
  "data": [
    {
      "_id": "65f0...",
      "destination": "John Doe",
      "trackingCode": "BR123456789",
      "creationDate": "2025-04-01",
      "imgUrl": "http://mikaeldavid.online/uploads/9f8d7c6a2b1d4e5f.png",
      "alt": ""
    }
  ]
}
```

## Companion App

This backend is paired with the Flutter monorepo **[`entregas_hub`](https://gitlab.com/mikaeldavidlopes/entregas_hub)**. The mobile/web client handles photo capture, list rendering, and the user experience; this repository handles storage, file hosting, and the AI step. Run both side by side for the full product.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 14 and npm >= 6
- A MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas))
- A [Google Gemini API key](https://ai.google.dev)

### Installation

```bash
git clone https://gitlab.com/mikaeldavidlopes/entregas_hub_back_end.git
cd entregas_hub_back_end
npm install
```

### Configuration

Create a `.env` file at the project root:

```bash
STRING_CONEXAO=mongodb+srv://<user>:<password>@<cluster>/?retryWrites=true&w=majority
GEMINI_API_KEY=your_google_gemini_api_key
```

The MongoDB driver expects a database called `delivery-hub` containing a `deliveries` collection.

### Running

```bash
npm run dev
```

The server starts on `http://localhost:3000` with `--watch` enabled (auto-reload on file changes).

## Project Structure

```
entregas_hub_back_end/
├── server.js                       # App entrypoint — boots Express on :3000
├── default                         # Reference Nginx site config (for VPS deploy)
├── uploads/                        # Local image storage (served as /uploads)
└── src/
    ├── config/
    │   └── db_config.js            # MongoDB connection helper
    ├── routes/
    │   └── deliveries_routes.js    # Multer + CORS setup, endpoint registration
    ├── controller/
    │   └── deliveries_controller.js # Request handlers (list, create, upload, update)
    ├── models/
    │   └── deliveries_model.js     # MongoDB queries against `delivery-hub.deliveries`
    └── services/
        └── gemini_service.js       # Gemini 1.5 Flash recipient-name extraction
```

## Deployment Notes

The repo includes a reference Nginx server block (`default`) intended to be dropped into `/etc/nginx/sites-available/` on the production VPS. The static `/uploads` route and the `/api/*` proxy can be fronted by Nginx with TLS termination. Public image URLs are currently hardcoded to `http://mikaeldavid.online/...` — adjust in `deliveries_controller.js` and `deliveries_model.js` before deploying elsewhere.

## License

Released under the **AGPL v3** license. See [LICENSE](https://www.gnu.org/licenses/agpl-3.0) for details.

---

<div align="center">
Built by <a href="https://github.com/MikaelDDavidd">Mikael David</a>
</div>
