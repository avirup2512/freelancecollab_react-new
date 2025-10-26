import { Activity as ActivityIcon, CheckCircle2, AlertCircle, Plus, Edit, Tag } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../ui/_avatar';
import { Button } from '../../ui/_button';
import { ScrollArea } from '../../ui/_scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
}

function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (action: string) => {
    if (action.includes('created')) {
      return <Plus className="h-3 w-3 text-green-600" />;
    }
    if (action.includes('incomplete') || action.includes('deleted')) {
      return <AlertCircle className="h-3 w-3 text-red-600" />;
    }
    if (action.includes('changed') || action.includes('updated')) {
      return <Edit className="h-3 w-3 text-blue-600" />;
    }
    if (action.includes('added') || action.includes('tag')) {
      return <Tag className="h-3 w-3 text-purple-600" />;
    }
    return <CheckCircle2 className="h-3 w-3 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ActivityIcon className="h-4 w-4" />
            <h3 className="font-medium">Activity</h3>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            View All
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="p-4 space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-3 relative">
              <div className="relative flex flex-col items-center">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {index < activities.length - 1 && (
                  <div className="absolute top-10 w-px h-full bg-border" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{activity.user}</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full">
                        {getActivityIcon(activity.action)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
export default ActivityFeed;