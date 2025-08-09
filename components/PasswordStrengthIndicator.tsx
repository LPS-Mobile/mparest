'use client';

import { PasswordValidation } from '@/types/auth';

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidation;
}

export default function PasswordStrengthIndicator({ validation }: PasswordStrengthIndicatorProps) {
  const validCount = Object.values(validation).slice(0, 4).filter(Boolean).length;
  
  let strengthClass = '';
  let strengthText = '';
  
  if (validCount <= 2) {
    strengthClass = 'bg-red-500';
    strengthText = 'Weak';
  } else if (validCount === 3) {
    strengthClass = 'bg-yellow-500';
    strengthText = 'Medium';
  } else if (validCount === 4) {
    strengthClass = 'bg-green-500';
    strengthText = 'Strong';
  }
  
  const widthClass = validCount <= 2 ? 'w-1/3' : validCount === 3 ? 'w-2/3' : 'w-full';

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Password strength</span>
        <span className={`text-xs font-medium ${
          validCount <= 2 ? 'text-red-600' : 
          validCount === 3 ? 'text-yellow-600' : 
          'text-green-600'
        }`}>
          {strengthText}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${strengthClass} ${widthClass}`}
        />
      </div>
    </div>
  );
}