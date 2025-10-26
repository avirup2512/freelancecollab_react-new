import { CardContent, CardHeader } from '../../ui/_card';
import { Badge } from '../../ui/_badge';
import { Button } from '../../ui/_button';
import { MoreHorizontal, Calendar, User, Edit, Trash2, Copy, ArrowRight, Flag, Clock, UserPlus, Archive, Star, Eye, MessageSquare, Paperclip, Tag, AlertTriangle, CheckSquare, PlayCircle, PauseCircle, BarChart3, Download, Link, BookOpen, Bookmark, Target, Timer } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '../../ui/_dropdown-menu';
import { Avatar, AvatarFallback } from '../../ui/_avatar';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Card, Priority } from '../../../interfaces/components/Card';



interface CardItemProps {
  listId:number,
  card: Card;
  onOpen: (cardId: number, listId:any | undefined) => void;
  onEdit: (card: Card, listId:number) => void;
  onDelete: (cardId: number, listId:number  ) => void;
  onDuplicate?: (card: Card) => void;
  onMove?: (cardId: number, direction: 'left' | 'right') => void;
  onChangePriority?: (cardId: number, priority: Priority) => void;
}
function CardItem({ listId,card,onOpen, onEdit, onDelete, onDuplicate, onMove, onChangePriority }: CardItemProps) {
  const [isDragging , setIsDragging] = useState(false)
  const priorityColors = {
    4: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    3: 'bg-amber-50 text-amber-700 border-amber-200',
    1: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  const priorityIcons = {
    low: '🟢',
    medium: '🟡', 
    high: '🔴'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (date < today) {
      return 'Overdue';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <div 
      className={`group cursor-move transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/60 bg-card border border-border/60 rounded-sm ${
        isDragging ? 'opacity-50 rotate-2 scale-105 shadow-xl' : 'hover:scale-[1.02]'
      } ${isOverdue ? 'bg-red-50/80 border-red-200' : 'bg-card hover:bg-card/80'} ${
        card.priority === 1 ? 'border-l-4 border-l-red-500' : 
        card.priority === 3 ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-emerald-500'
      }`}
    >
      <div className="p-4 pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1">
            <h4 onClick={()=> {onOpen(card?.id, listId)}} className="font-medium leading-snug cursor-pointer line-clamp-2 group-hover:text-blue-700 transition-colors">
              {card.name}
            </h4>
            {card.description && (
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {card.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 opacity-30 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 rounded-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onEdit(card, listId)} className="gap-2.5">
                <Edit className="h-4 w-4" />
                Edit Card
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(card)} className="gap-2.5">
                  <Copy className="h-4 w-4" />
                  Duplicate Card
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* Quick Actions */}
              <DropdownMenuItem className="gap-2.5">
                <Star className="h-4 w-4" />
                Add to Favorites
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5">
                <Eye className="h-4 w-4" />
                Watch Card
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5">
                <CheckSquare className="h-4 w-4" />
                Mark Complete
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Card Management */}
              {onChangePriority && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2.5">
                    <Flag className="h-4 w-4" />
                    Change Priority
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onChangePriority(card.id, 'high')} className="gap-2.5">
                      <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
                      High Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangePriority(card.id, 'medium')} className="gap-2.5">
                      <div className="w-2 h-2 bg-amber-500 rounded-sm"></div>
                      Medium Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangePriority(card.id, 'low')} className="gap-2.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-sm"></div>
                      Low Priority
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5">
                  <User className="h-4 w-4" />
                  Assignee
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="gap-2.5">
                    <UserPlus className="h-4 w-4" />
                    Assign to Me
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <User className="h-4 w-4" />
                    Change Assignee
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <UserPlus className="h-4 w-4" />
                    Add Collaborator
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5">
                  <Calendar className="h-4 w-4" />
                  Dates
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="gap-2.5">
                    <Calendar className="h-4 w-4" />
                    Set Due Date
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <Calendar className="h-4 w-4" />
                    Set Start Date
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <AlertTriangle className="h-4 w-4" />
                    Add Reminder
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5">
                  <Tag className="h-4 w-4" />
                  Labels & Tags
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="gap-2.5">
                    <Tag className="h-4 w-4" />
                    Add Label
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <Bookmark className="h-4 w-4" />
                    Create Custom Tag
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <Target className="h-4 w-4" />
                    Set Category
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              
              {/* Organization */}
              {onMove && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2.5">
                    <ArrowRight className="h-4 w-4" />
                    Move Card
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onMove(card.id, 'left')} className="gap-2.5">
                      ← Move to Previous Column
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMove(card.id, 'right')} className="gap-2.5">
                      → Move to Next Column
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2.5">
                      <ArrowRight className="h-4 w-4" />
                      Move to Specific Column
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5">
                  <BookOpen className="h-4 w-4" />
                  Convert To
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="gap-2.5">
                    <BookOpen className="h-4 w-4" />
                    Template
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <Target className="h-4 w-4" />
                    Milestone
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <Flag className="h-4 w-4" />
                    Epic
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              
              {/* Productivity */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5">
                  <Timer className="h-4 w-4" />
                  Time Tracking
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="gap-2.5">
                    <PlayCircle className="h-4 w-4" />
                    Start Timer
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <PauseCircle className="h-4 w-4" />
                    Log Time
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <BarChart3 className="h-4 w-4" />
                    View Time Report
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="gap-2.5">
                    <Paperclip className="h-4 w-4" />
                    Add File
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <Link className="h-4 w-4" />
                    Add Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5">
                    <Download className="h-4 w-4" />
                    Download All
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuItem className="gap-2.5">
                <MessageSquare className="h-4 w-4" />
                Add Comment
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Actions */}
              <DropdownMenuItem className="gap-2.5">
                <Archive className="h-4 w-4" />
                Archive Card
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(card.id)}
                className="text-destructive gap-2.5"
              >
                <Trash2 className="h-4 w-4" />
                Delete Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="px-4 pb-4 pt-0 space-y-3">
        {/* <div className="flex items-center justify-between">
          <span 
            className={`inline-flex items-center text-xs font-medium px-2.5 py-1 border rounded-sm ${
              card.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
              card.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-sm mr-1.5 ${
              card.priority === 'high' ? 'bg-red-500' :
              card.priority === 'medium' ? 'bg-amber-500' :
              'bg-emerald-500'
            }`}></div>
            {card?.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
          </span>
          {isOverdue && (
            <span className="inline-flex items-center text-xs animate-pulse px-2 py-1 bg-red-100 text-red-700 border border-red-200 rounded-sm">
              <Clock className="h-3 w-3 mr-1" />
              Overdue
            </span>
          )}
        </div> */}
        
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {card.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors rounded-sm border border-slate-200">
                {tag?.tagName}
              </span>
            ))}
            {card.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-sm border border-slate-200">
                +{card.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-1">
          {card.assignee && (
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-sm border border-border/60 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-medium text-xs flex items-center justify-center">
                {getInitials(card.assignee)}
              </div>
              <span className="text-xs text-muted-foreground font-medium truncate max-w-[90px]">
                {card.assignee}
              </span>
            </div>
          )}
          {card.dueDate && (
            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-sm border font-medium ${
              isOverdue 
                ? 'text-red-700 bg-red-50 border-red-200' 
                : 'text-slate-600 bg-slate-50 border-slate-200'
            }`}>
              <Calendar className="h-3 w-3" />
              <span>{formatDate(card.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default CardItem