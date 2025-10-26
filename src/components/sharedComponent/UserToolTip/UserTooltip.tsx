import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import { Badge } from '../../ui/_badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/_tooltip';
import { Mail, Clock, Briefcase, User } from 'lucide-react';

interface UserData {
  first_name: string;
  avatar?: string;
  email?: string;
  role?: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
}

interface UserTooltipProps {
  user?: UserData;
  users?: UserData[];
  children: React.ReactNode;
  trigger?: 'hover' | 'click';
  side?: 'top' | 'bottom' | 'left' | 'right';
  isGroupTooltip?: boolean;
  groupLabel?: string;
}

const StatusIndicator = ({ status }: { status?: 'online' | 'offline' | 'away' }) => {
  if (!status) return null;
  
  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online' },
    away: { color: 'bg-yellow-500', label: 'Away' },
    offline: { color: 'bg-gray-400', label: 'Offline' }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-xs text-gray-500">{config.label}</span>
    </div>
  );
};

const UserCard = ({ user, isCompact = false }: { user: UserData; isCompact?: boolean }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="relative">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar} alt={user.first_name} />
            <AvatarFallback className="text-xs bg-blue-50 text-blue-700">
              {getInitials(user.first_name)}
            </AvatarFallback>
          </Avatar>
          {user.status && (
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              user.status === 'online' ? 'bg-green-500' : 
              user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
            }`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">{user.first_name}</p>
          {user.role && (
            <p className="text-xs text-gray-500 truncate">{user.role}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar} alt={user.first_name} />
            <AvatarFallback className="text-sm bg-blue-50 text-blue-700">
              {getInitials(user.first_name)}
            </AvatarFallback>
          </Avatar>
          {user.status && (
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              user.status === 'online' ? 'bg-green-500' : 
              user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
            }`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-base leading-tight">{user.first_name}</h4>
          {user.role && (
            <div className="flex items-center gap-1 mt-1">
              <Briefcase className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-600">{user.role}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 border-t border-gray-100 pt-3">
        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-600">{user.email}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <StatusIndicator status={user.status} />
          {user.lastActive && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{user.lastActive}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function UserTooltip({
  user,
  users,
  children,
  trigger = 'hover',
  side = 'top',
  isGroupTooltip = false,
  groupLabel = 'Team Members'
}: UserTooltipProps) {
  const renderContent = () => {
    if (isGroupTooltip && users) {
      return (
        <div className="space-y-3 min-w-[280px] max-w-[320px]">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <User className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-sm text-gray-900">{groupLabel}</h3>
            <Badge variant="secondary" className="text-xs">
              {users.length}
            </Badge>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {users.map((user, index) => (
              <UserCard key={index} user={user} isCompact />
            ))}
          </div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="min-w-[260px] max-w-[300px]">
          <UserCard user={user} />
        </div>
      );
    }

    return null;
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="p-4 shadow-lg border border-gray-200 bg-white"
          sideOffset={8}
        >
          {renderContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}