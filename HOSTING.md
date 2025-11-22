# Hosting Guide (Vercel)

Since Supabase is currently under maintenance, you can use this guide to deploy your application once it's back online.

## 1. Preparation

Ensure your code is committed to a Git repository (GitHub, GitLab, or Bitbucket).

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 2. Deploy to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** > **"Project"**.
3.  Import your `sam-app` repository.
4.  In the **Configure Project** screen, expand **Environment Variables**.
5.  Add the following variables (copy values from your `.env.local`):
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6.  Click **"Deploy"**.

## 3. Post-Deployment Configuration (Required)

Once your app is deployed, you'll get a production URL (e.g., `https://sam-app.vercel.app`). You must update Supabase and Google to trust this URL.

### A. Update Supabase Auth
1.  Go to your **Supabase Dashboard** > **Authentication** > **URL Configuration**.
2.  Add your Vercel URL to **Site URL** or **Redirect URLs**.
    *   Example: `https://sam-app.vercel.app/auth/v1/callback`
3.  Click **Save**.

### B. Update Google OAuth
1.  Go to **Google Cloud Console** > **APIs & Services** > **Credentials**.
2.  Edit your **OAuth 2.0 Client ID**.
3.  Add the same Vercel URL to **Authorized redirect URIs**.
    *   Example: `https://sam-app.vercel.app/auth/v1/callback`
4.  Click **Save**.

## 4. Verify

Visit your deployed URL and try signing in with Google. If configured correctly, you should be redirected back to your app and logged in!
