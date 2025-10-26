import { Card, CardContent, CardHeader, CardTitle } from "../../ui/_card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/_avatar";
import { Activity, CheckCircle, FileText, MessageSquare, Users } from "lucide-react";

function ActivityTimeline() {
  const activities = [
    {
      id: 1,
      type: "created",
      user: "Avriup Chakraborty",
      action: "has created the card",
      timestamp: "2025-08-27T05:09:51.000Z",
      icon: FileText
    },
    {
      id: 2,
      type: "status",
      user: "Avriup Chakraborty",
      action: "has changed the status to completed",
      timestamp: "2025-09-24T19:32:34.000Z",
      icon: CheckCircle
    },
    {
      id: 3,
      type: "status",
      user: "Avriup Chakraborty",
      action: "has changed the status to completed",
      timestamp: "2025-09-24T19:32:37.000Z",
      icon: CheckCircle
    },
    {
      id: 4,
      type: "status",
      user: "Avriup Chakraborty",
      action: "has changed the status to incomplete",
      timestamp: "2025-09-24T19:32:50.000Z",
      icon: Activity
    },
    {
      id: 5,
      type: "checklist",
      user: "Avriup Chakraborty",
      action: "has added a checklist",
      timestamp: "2025-09-24T19:33:30.000Z",
      icon: CheckCircle
    },
    {
      id: 6,
      type: "checklist",
      user: "Avriup Chakraborty",
      action: "has added a checklist",
      timestamp: "2025-09-24T19:38:25.000Z",
      icon: CheckCircle
    },
    {
      id: 7,
      type: "comment",
      user: "Avriup Chakraborty",
      action: "added a comment",
      timestamp: "2025-09-24T19:38:12.000Z",
      icon: MessageSquare
    }
  ];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'text-blue-500';
      case 'status':
        return 'text-green-500';
      case 'checklist':
        return 'text-purple-500';
      case 'comment':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-80 p-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Card Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getIconColor(activity.type)}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default ActivityTimeline;