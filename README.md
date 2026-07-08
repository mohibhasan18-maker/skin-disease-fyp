# Skin Disease FYP Frontend

Next.js frontend for the skin disease detection and consultation platform.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend API URL

All frontend API calls are centralized in `lib/api-client.ts`.

For local development, create a `.env.local` file:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

When your backend is deployed, change that value to your live backend URL, for example:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
```

On Vercel, add the same variable in:

Project Settings -> Environment Variables -> `NEXT_PUBLIC_API_BASE_URL`

Then redeploy the frontend.

If the variable is missing, the app falls back to `http://localhost:8000/api`.

## Upload To GitHub Manually

If Git is not connected from your computer, upload manually:

1. Create a new repository on GitHub.
2. Upload the project files from this folder.
3. Do not upload `node_modules`, `.next`, `.env.local`, or `.vercel`.
4. Make sure `.env.example`, `package.json`, `package-lock.json`, `app`, `components`, `lib`, `public`, and config files are uploaded.
5. Commit the uploaded files on GitHub.

## Deploy On Vercel

1. Go to Vercel and choose `Add New Project`.
2. Import the GitHub repository.
3. Keep the framework as `Next.js`.
4. Use the default build settings:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: leave empty
5. Add `NEXT_PUBLIC_API_BASE_URL` in Environment Variables.
6. Deploy.

## Backend Connection Later

After your backend is deployed:

1. Copy the backend base API URL.
2. Update `NEXT_PUBLIC_API_BASE_URL` in Vercel.
3. Redeploy the frontend.
4. If API route names change, update only the endpoint paths inside `lib/api-client.ts`.
