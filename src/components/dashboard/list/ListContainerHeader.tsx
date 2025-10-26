import React, { useState } from 'react';
import { Input } from '../../ui/_input';
import { Plus, Settings, Search, Filter, MoreHorizontal, Users, Clock, Target, BarChart3 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../../ui/_dropdown-menu';
import { Button } from '../../ui/_button';
import  Task from '../card/CardDetails';
import type { Column } from './ListItem';
import { Badge } from '../../ui/_badge';

interface ListContainerHeaderProps {
    title?: string;
    actions?: React.ReactNode;
}

const ListContainerHeader: React.FC<ListContainerHeaderProps> = () => {

    const [columns, setColumns] = useState<Column[]>([]);
    const [showAddColumn, setShowAddColumn] = useState(false);
    const [editingColumn, setEditingColumn] = useState<Column | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<string>('all');
      // Calculate statistics
        const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0);
        const completedTasks = columns.find(col => col.title.toLowerCase().includes('done'))?.tasks.length || 0;
        const highPriorityTasks = columns.reduce((acc, col) => 
            acc + col.tasks.filter(task => task.priority === 'high').length, 0
        );
        const overdueTasks = columns.reduce((acc, col) => 
            acc + col.tasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date()).length, 0
        );
    const handleAddColumn = () => {
        setEditingColumn(undefined);
        setShowAddColumn(true);
    };
    return (
              <div className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  Project Board
                </h1>
                <p className="text-muted-foreground text-sm">Manage your team's workflow with ease</p>
              </div>
              
              {/* Statistics */}
              <div className="hidden lg:flex items-center gap-6 ml-8 px-6 py-3 bg-card rounded-xl border shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
                    <Target className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Total Tasks</p>
                    <p className="text-sm font-medium">{totalTasks}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-sm font-medium">{completedTasks}</p>
                  </div>
                </div>
                {highPriorityTasks > 0 && (
                  <>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground">High Priority</p>
                        <p className="text-sm font-medium">{highPriorityTasks}</p>
                      </div>
                    </div>
                  </>
                )}
                {overdueTasks > 0 && (
                  <>
                    <div className="w-px h-8 bg-border"></div>
                    <Badge variant="destructive" className="text-xs px-2.5 py-1">
                      <Clock className="h-3 w-3 mr-1.5" />
                      {overdueTasks} Overdue
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem className="gap-2.5">
                    <Users className="h-4 w-4" />
                    Manage Team
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2.5">
                    <Settings className="h-4 w-4" />
                    Board Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleAddColumn} size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm">
                <Plus className="h-4 w-4" />
                Add Column
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mt-6">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, assignees, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-card border-border/60 focus:border-blue-300 focus:ring-blue-100 rounded-lg shadow-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 min-w-[140px] justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {filterPriority === 'all' ? 'All Priorities' : `${filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}`}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => setFilterPriority('all')}>
                  All Priorities
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterPriority('high')} className="gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('medium')} className="gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('low')} className="gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Low Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
    );
};

export default ListContainerHeader;