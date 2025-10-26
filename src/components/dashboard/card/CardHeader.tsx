import { useEffect, useState } from 'react';
import { ArrowLeft, MoreVertical, Star, Share2, Archive } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/_dropdown-menu';
import { Badge } from '../../ui/_badge';
import { toast } from 'sonner';

interface TaskHeaderProps {
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  onTitleChange: (title: string) => void;
  onStatusChange: (status: string) => void;
}

function CardHeader({ title, status, onTitleChange, onStatusChange }: TaskHeaderProps) {
  useEffect(() => {
    setLocalTitle(title)
  },[title])
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);

  const statusConfig = {
    'todo': { label: 'To Do', color: 'bg-gray-100 text-gray-700' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    'review': { label: 'Review', color: 'bg-yellow-100 text-yellow-700' },
    'completed': { label: 'Completed', color: 'bg-green-100 text-green-700' },
  };

  const handleSaveTitle = () => {
    onTitleChange(localTitle);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Badge className={statusConfig[status]?.color}>
              {statusConfig[status]?.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.success('Task duplicated')}>
                  Duplicate Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Link copied')}>
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.success('Task archived')}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Task
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <Input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              className="flex-1"
            />
          ) : (
            <h1
              onClick={() => setIsEditing(true)}
              className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded flex-1"
            >
              {title}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
export default CardHeader;
