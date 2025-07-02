'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '../../../providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function VerifyPage() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (user?.email_confirmed_at) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email || '',
      });

      if (error) throw error;

      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send verification email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please check your email for a verification link.
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={handleResendVerification}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Resend verification email
          </button>
        </div>
      </div>
    </div>
  );
} 