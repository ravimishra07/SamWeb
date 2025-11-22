# Supabase Integration Guide

This guide details how to set up the backend for the SAM App using Supabase.

## 1. Project Setup

1.  Create a new project on [Supabase](https://supabase.com/).
2.  Copy the `Project URL` and `anon` public key from **Project Settings > API**.
3.  Add them to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://udpzfzscvuztwzpitkxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCo
```

## 2. Database Setup

Run the following SQL in the **SQL Editor** of your Supabase dashboard to create the schema, RLS policies, and storage bucket.

**Dashboard SQL Editor:** [https://supabase.com/dashboard/project/udpzfzscvuztwzpitkxq/sql/new](https://supabase.com/dashboard/project/udpzfzscvuztwzpitkxq/sql/new)

```sql
-- Copy content from supabase/schema.sql
```

(See `supabase/schema.sql` in this repo for the full script)

## 3. Auth Setup (Google)

1.  Go to **Authentication > Providers**.
2.  Enable **Google**.
3.  You will need a Google Cloud Project with OAuth credentials.
4.  Add the **Authorized Redirect URIs** in your Google Cloud Console:
    *   `https://<your-project-ref>.supabase.co/auth/v1/callback`
5.  Add the Client ID and Secret to Supabase.
6.  In Supabase **Authentication > URL Configuration**, add your app's redirect URLs:
    *   `http://localhost:3000/auth/v1/callback`
    *   `https://your-production-domain.com/auth/v1/callback`

## 4. Edge Function Setup

This function is required for secure file uploads.

1.  Install Supabase CLI: `brew install supabase/tap/supabase` (MacOS)
2.  Login: `supabase login`
3.  Deploy the function:

```bash
supabase functions deploy get-signed-upload-url --project-ref <your-project-ref>
```

## 5. RLS Verification Checklist

- [ ] **Select**: Try fetching logs with a different `user_id` (should return empty).
- [ ] **Insert**: Try inserting a log with a different `user_id` (should fail).
- [ ] **Storage**: Try listing files in `attachments` bucket without auth (should fail).

## 6. Troubleshooting

### Redirect Mismatch
*   **Error**: `redirect_uri_mismatch`
*   **Fix**: Ensure the URL in `signInWithOAuth` (`window.location.origin + ...`) exactly matches one of the **Redirect URLs** in Supabase Auth settings.

### JWT/Auth Failing
*   **Error**: `AuthSessionMissingError`
*   **Fix**: Check if `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY` are correct. Ensure cookies are not blocked by the browser.

### RLS Errors
*   **Error**: `new row violates row-level security policy`
*   **Fix**: Ensure you are sending the `user_id` that matches the currently logged-in user's `auth.uid()`. The `logService.ts` handles this automatically.
