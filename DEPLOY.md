# 🚀 5-Minute Production Deployment Guide

This guide details exactly how to deploy this application to **Render** using GitHub Integration, Docker, and MongoDB Atlas.

---

## 🛠️ Option A: Automatic Deploy with Blueprints (Recommended)

1. Commit and push all newly generated configuration files to your GitHub repository:
   ```bash
   git add .
   git commit -m "chore: setup docker and production render configurations"
   git push origin main
   ```
2. Log into the [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub Repository and select it.
5. Render will automatically parse the `render.yaml` file, spin up your web service, generate your database, and provision a secure `JWT_SECRET`.

---

## 🛠️ Option B: Manual Deploy using Docker

If you prefer to connect your own external database (like MongoDB Atlas Free Tier):

1. **Create Web Service:**
   - On Render Dashboard, click **New +** -> **Web Service**.
   - Connect your Repository.
   - Set **Runtime** to `Docker`.
   - Set **Docker Command** to empty (it will default to the instruction inside the `Dockerfile`).

2. **Configure Environment Variables:**
   Add these keys in the **Environment** tab:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `run-openssl-rand-base64-32-to-generate`
   - `CORS_ORIGIN`: `your-render-url-assigned-after-creation`

---

## ⚡ Local Verification and Testing

To test the exact production multi-stage container locally on your machine before pushing to the cloud:

```bash
# 1. Run local stack with DB and Server automatically built
docker-compose up --build

# 2. Check health status
curl -I http://localhost:10000/health