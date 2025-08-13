'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');

  // Helper function for Google OAuth sign-in with hardcoded redirect
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://mparest.vercel.app/auth-redirect'
      }
    });
  };

  // Helper function for password reset with hardcoded redirect
  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://mparest.vercel.app/auth-redirect'
    });
  };

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        setStatus('Exchanging code for session...');
        
        // Use PKCE flow - exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('PKCE exchange error:', error);
          setStatus('Authentication failed. Redirecting to login...');
          setTimeout(() => {
            router.replace('/login?error=oauth');
          }, 2000);
          return;
        }
        
        if (data.session) {
          console.log('PKCE auth successful:', data.session.user);
          setStatus('Authentication successful! Redirecting...');
          
          // Get the original mobile redirect URL
          const urlParams = new URLSearchParams(window.location.search);
          const originalRedirect = urlParams.get('original_redirect');
          
          // Detect platform
          const userAgent = navigator.userAgent.toLowerCase();
          const isMobile = /iphone|ipad|android|mobile/i.test(userAgent);
          const isInAppBrowser = /expo|react-native/i.test(userAgent);
          
          console.log('Platform detection:', {
            isMobile,
            isInAppBrowser,
            originalRedirect,
            userAgent: userAgent.substring(0, 100)
          });
          
          // Determine if this should redirect to mobile app
          const shouldRedirectToMobile = originalRedirect && (
            originalRedirect.startsWith('exp://') || 
            originalRedirect.startsWith('your-prayer-app://')
          );
          
          if (shouldRedirectToMobile) {
            setStatus('Redirecting back to mobile app...');
            
            // For PKCE, we don't need to pass tokens in URL since session is stored
            // Just redirect to mobile app with success indicator
            const mobileUrl = `${originalRedirect}?auth_success=true`;
            
            console.log('Redirecting to mobile app:', mobileUrl);
            window.location.href = mobileUrl;
            
            setTimeout(() => {
              setStatus('Please return to your mobile app. If it didn\'t open automatically, please return manually.');
            }, 3000);
            
          } else {
            // Handle web app redirect
            setStatus('Redirecting to dashboard...');
            setTimeout(() => {
              router.replace('/dashboard');
            }, 1000);
          }
        } else {
          console.log('No session found, redirecting to login');
          setStatus('No session found. Redirecting to login...');
          setTimeout(() => {
            router.replace('/login');
          }, 2000);
        }
        
      } catch (error) {
        console.error('Error in PKCE auth redirect:', error);
        setStatus('Authentication error occurred. Redirecting to login...');
        setTimeout(() => {
          router.replace('/login?error=oauth');
        }, 2000);
      }
    };

    // Small delay to ensure the URL is fully loaded
    const timer = setTimeout(handleRedirect, 100);
    
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Completing sign in...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {status}
          </p>
        </div>
        
        {/* Loading spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        {/* Fallback instructions */}
        <div className="text-center text-xs text-gray-500">
          <p>Please wait while we redirect you back to the app.</p>
        </div>
      </div>
    </div>
  );
}