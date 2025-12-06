import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Client for Client Components
export const createClientComponentClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Client for Server Components (e.g., for fetching data)
// This is a simplified version. For full server-side auth, we'd use
// createServerComponentClient from @supabase/auth-helpers-nextjs or @supabase/ssr
// which requires a 'cookies' object. I'll create a helper for that in a separate file.

// For now, I'll export the basic createClient for server-side use where cookies are not needed
// (e.g., in API routes or server actions that don't rely on the user's session cookie).
// However, for the app to work, we need the one that reads the session from cookies.

// Let's stick to the recommended pattern for Next.js App Router using createBrowserClient
// for client components and createServerComponentClient for server components.
// Since createServerComponentClient requires a dynamic import of 'cookies', I'll create a
// separate helper for server components.

// This file will only contain the client component client.
