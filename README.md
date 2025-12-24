# Order App - Best Nepali Food 🍛

A Next.js application for ordering Nepali food with cart functionality and MicroCMS integration.

## Features

- Menu display with images from MicroCMS
- Shopping cart functionality
- Order confirmation
- Responsive design

## Environment Variables

Before deploying or running locally, set up your environment variables:

1. Create a `.env.local` file at the project root
2. Add your MicroCMS API key (server-side only):
   ```
   MICROCMS_API_KEY=your_actual_api_key
   ```
   This is read by the Next.js API route at `app/api/menu/route.ts`. Do not expose this key as a public env var.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Windows PowerShell)

1. Install Vercel CLI:

   ```powershell
   npm install -g vercel
   ```

2. Login to Vercel:

   ```powershell
   vercel login
   ```

3. Deploy:

   ```powershell
   vercel
   ```

4. Add an environment variable in Vercel Dashboard:
   - Project Settings → Environment Variables
   - Add `MICROCMS_API_KEY` with your API key (Production and Preview)

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable `MICROCMS_API_KEY` in the project settings (Production and Preview)
6. Click "Deploy"

## Important Notes

- Make sure your `.env.local` file is NOT committed to Git (it's in `.gitignore`)
- Always add environment variables in Vercel project settings before deploying
- The build command is `npm run build`
- The project uses Next.js 14.2.3

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
