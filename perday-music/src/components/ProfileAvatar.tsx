import { useState } from 'react';
import { useAppStore } from '../store/store';
import { User } from 'lucide-react';

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProfileAvatar({ size = 'md', className = '' }: ProfileAvatarProps) {
  const { settings } = useAppStore();
  const [imageError, setImageError] = useState(false);
  
  const userName = settings.userName || 'Producer';
  const initials = userName
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  // For now, we'll use initials since we don't have Google avatar integration
  // In the future, this could check for a Google avatar URL in settings
  const hasGoogleAvatar = false; // settings.googleAvatarUrl

  if (hasGoogleAvatar && !imageError) {
    return (
      <img
        src={''} // settings.googleAvatarUrl would go here
        alt={`${userName}'s avatar`}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className={`rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-semibold ${sizeClasses[size]} ${className}`}>
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  );
}
