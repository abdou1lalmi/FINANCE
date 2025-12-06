'use client';

import { createClientComponentClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SupabaseAuthListener() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== undefined) {
        // This is a simple way to trigger a refresh of the server components
        // when the auth state changes (e.g., after login/logout).
        // In a real app, we'd use a dedicated API route to set the cookies
        // for the server-side client, but for this task, a simple router.refresh()
        // after a change is often enough to re-fetch the session on the server.
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return null;
}
