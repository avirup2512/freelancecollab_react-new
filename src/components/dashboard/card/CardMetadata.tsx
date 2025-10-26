import { useEffect, useState } from 'react';
import { Calendar, Flag, User2, Clock, X, UserPlus, Bell, Plus, UserIcon } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/_popover';
import { Calendar as CalendarComponent } from '../../ui/_calendar';
import { Avatar, AvatarFallback } from '../../ui/_avatar';
import { Input } from '../../ui/_input';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/_select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/_dialog';
import { toast } from 'sonner';
import { PriorityList } from '../../../constant/App';
import { UserAddModal } from '../../sharedComponent/UserAddModal/UserAddModal';
import type { User } from '../../../interfaces/components/User';
import UserListCircleIcon from '../../sharedComponent/UserListCircleIcon/UserListCircleIcon';

interface Assignee {
  id: string;
  name: string;
  initials: string;
  email?: string;
}

interface TaskMetadataProps {
  dueDate?: Date;
  reminderDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignees: User[];
  onDueDateChange: (date: Date | undefined) => void;
  onReminderDateChange: (date: Date | undefined) => void;
  onPriorityChange: (priority: string) => void;
  onAssigneesChange: (assignees: User[]) => void;
}

function CardMetadata({
  dueDate,
  reminderDate,
  priority,
  assignees,
  onDueDateChange,
  onReminderDateChange,
  onPriorityChange,
  onAssigneesChange,
}: TaskMetadataProps) {
    const [userAddModal, setUserAddModal] = useState<{ isOpen: boolean; id: number | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  useEffect(() => {
    console.log(assignees);
    
  },[assignees])

  const getDaysUntilDue = () => {
    if (!dueDate) return null;
    const now = new Date();
    const diff = new Date(dueDate).getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: `${Math.abs(days)} days overdue`, color: 'text-red-600' };
    if (days === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (days === 1) return { text: 'Due tomorrow', color: 'text-yellow-600' };
    return { text: `${days} days left`, color: 'text-muted-foreground' };
  };

  const handleUnassignUser = (userId: string) => {
    const updatedAssignees = assignees.filter((a) => a.id !== userId);
    onAssigneesChange(updatedAssignees);
    const removedUser = assignees.find((a) => a.id === userId);
    toast.success(`${removedUser?.name} has been unassigned`);
  };

  const handleAddUser = (users:User[]) => {
    console.log(users);
    onAssigneesChange(users);
    toast.success(`${newUserName} has been assigned`);
    setNewUserName('');
    setNewUserEmail('');
    // setIsAddUserOpen(false);
  };

  const daysInfo = getDaysUntilDue();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Due Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {dueDate ? (
                  <div className="flex items-center justify-between w-full">
                    <span>{format(dueDate, 'MMM dd, yyyy')}</span>
                    {daysInfo && (
                      <span className={`text-xs ${daysInfo.color}`}>
                        {daysInfo.text}
                      </span>
                    )}
                  </div>
                ) : (
                  'Select date'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dueDate}
                onSelect={onDueDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Reminder Date */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Reminder Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {reminderDate ? (
                  <div className="flex items-center justify-between w-full">
                    <span>{format(reminderDate, 'MMM dd, yyyy')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReminderDateChange(undefined);
                        toast.success('Reminder removed');
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  'Set reminder'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={reminderDate}
                onSelect={(date) => {
                  onReminderDateChange(date);
                  if (date) {
                    toast.success('Reminder set successfully');
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <Flag className="h-3 w-3" />
            Priority
          </label>
          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger>
              <SelectValue>
                <div className="flex items-center gap-2">
                  {/* <span>{PriorityList[priority]}</span>
                  <span>{PriorityList[priority]}</span> */}
                  {
                    PriorityList.map((e:any,i:number) => {
                      return <span key={i}>{(e.id == priority) ? e.value : ""}</span>
                    })
                  }
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {
                PriorityList.map((e:any,i:number) => {
                  return <>
                    <SelectItem value={e} key={i} className="gap-2">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      {e.value} Priority
                    </div>
                  </SelectItem>
                  </>
                })
              }
            </SelectContent>
          </Select>
        </div>

        {/* Assignees */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <User2 className="h-3 w-3" />
            Assignees ({assignees.length})
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {assignees.length > 0 ? (
              <>
                <UserListCircleIcon showPlusButton={false} id={0} name={""} users={assignees || []} handleOpenUserAddModal={()=>{}}/>
                {/* {assignees.map((assignee:any) => (
                  <div
                    key={assignee.id}
                    className="group relative"
                  >

                    <Avatar className="h-8 w-8 border-2 border-white cursor-pointer hover:border-primary transition-colors">
                      <AvatarFallback className="text-xs">{assignee.name ? assignee.name[0] : assignee.first_name ? assignee.first_name[0]:""}</AvatarFallback>
                    </Avatar>
                    {
                      !assignee.creator &&
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleUnassignUser(assignee.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    }
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {assignee.name}
                      {assignee.email && (
                        <div className="text-gray-300">{assignee.email}</div>
                      )}
                    </div>
                  </div>
                ))} */}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">No assignees yet</span>
            )}
            <Button onClick={()=>{console.log(assignees);
             setUserAddModal({ isOpen: true, id: null, name: '' });}} size="sm" className="shrink-0">
              <UserIcon className="h-4 w-4" /> Manage User and Role
            </Button>
            <UserAddModal
            open={userAddModal.isOpen}
            onOpenChange={(open) => {
              if (!open) {
                setUserAddModal({ isOpen: false, id: null, name: '' });
              }
            }}
            onAddUsers={handleAddUser}
            name={userAddModal.name}
            existingAssignees={assignees} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default CardMetadata;
