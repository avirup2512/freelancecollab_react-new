import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/_card';
import { Button } from '../../ui/_button';
import { Plus, ChevronRight, Trash2, Calendar, FileText } from 'lucide-react';
import TaskService from '../../../services/auth/TaskService';

export interface TaskItem {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  selectedDates?: Set<string>;
  createdAt?: Date;
}

interface TaskListProps {
  tasks?: TaskItem[];
  onDeleteTask?: (taskId: string) => void;
  onTaskSelect?: (taskId: string) => void;
}

export function TaskList({ tasks = [], onDeleteTask, onTaskSelect }: TaskListProps) {
  const taskService = new TaskService();
  const navigate = useNavigate();
//   const [localTasks, setLocalTasks] = useState<TaskItem[]>(tasks);
const [localTasks, setLocalTasks] = useState([]);
  useEffect(()=>{
    getList();
  },[]);

  const getList = async ()=>{
    const getList = await taskService.getList(localStorage.getItem("token"));
    if(getList.success)
    {
        setLocalTasks(getList.tasks)
    }
  }

  const handleAddTask = () => {
    navigate('../task-creator');
  };

  const handleTaskClick = (taskId: any) => {
    onTaskSelect?.(taskId);
    navigate(`../task-grid/${taskId}/${'daily'}`);
  };

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?'+taskId+'')) {
        const deletedTask = await taskService.deleteTask(localStorage.getItem("token"),taskId);
        setLocalTasks(localTasks.filter((task) => task.id !== taskId));
        onDeleteTask?.(taskId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskStatus = (task: TaskItem) => {
    const now = new Date();
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);

    if (now < start) {
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (now > end) {
      return { label: 'Completed', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track your tasks with interactive date selection
          </p>
        </div>
        <Button
          onClick={handleAddTask}
          variant="default"
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </Button>
      </div>

      {/* Tasks Grid/List */}
      {localTasks.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-border">
          <div className="flex flex-col items-center gap-4">
            <FileText className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold text-foreground mb-2">No tasks yet</p>
              <p className="text-muted-foreground mb-4">Create your first task to get started</p>
              <Button
                onClick={handleAddTask}
                variant="default"
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localTasks.map((task) => {
            const duration = calculateDuration(task.start_date, task.end_date);
            const status = getTaskStatus(task);
            const selectedCount = task.selectedDates?.size || 0;

            return (
              <Card
                key={task.id}
                className="p-6 border border-border hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="space-y-4">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {task.name}
                      </h3>
                      <span
                        className={`inline-block text-xs font-medium px-2 py-1 rounded mt-2 ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2 -mr-2 -mt-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Date Information */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(task.start_date)} - {formatDate(task.end_date)}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 bg-accent/40 p-3 rounded-md">
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold text-foreground">{duration} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Selected</p>
                      <p className="font-semibold text-foreground">{selectedCount} days</p>
                    </div>
                  </div>

                  {/* Click to View Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-between group/btn"
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Task Count */}
      {localTasks.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Showing {localTasks.length} task{localTasks.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
