'use client';

import { useMemo } from 'react';
import { PasswordValidation } from '@/types/auth';

export function usePasswordValidation(password: string): PasswordValidation {
  return useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber,
    };
  }, [password]);
}