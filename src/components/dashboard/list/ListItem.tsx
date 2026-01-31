import { Card, CardContent, CardHeader } from '../../ui/_card';
import { Button } from '../../ui/_button';
import { Badge } from '../../ui/_badge';
import { Plus, MoreHorizontal, Edit, Trash2, Copy, ArrowLeft, ArrowRight, Settings, SortAsc, Archive, Eye, EyeOff, Palette, Target, Clock, CheckSquare, AlertTriangle, Calendar, User, Filter, Download, Upload, BarChart3 } from 'lucide-react';
import CardItem,{ type Card as CardType } from '../card/CardItem';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '../../ui/_dropdown-menu';
import ConditionalSortableWrapper from '../../sharedComponent/ConditionalSortableWrapper';
import SortableWrapper from '../../sharedComponent/SortableWrapper';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export interface Column {
  id: any;
  name: string;
  color?: string;
  cards: CardType[];
  limit?: number;
  collapsed?: boolean;
  isFixed?: number,
  board_id?: number,
  listColor?:string
}

interface KanbanColumnProps {
  column: Column;
  onOpenCard: (cardId:number,listId: number) => void;
  onAddCard: (listId: number) => void;
  onEditCard: (task: CardType, listId:number) => void;
  onDeleteCard: (cardId: string, listId:number) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (listId: string) => void;
  onMoveCard: (taskId: string, targetColumnId: string) => void;
  onDuplicateCard?: (task: CardType) => void;
  onDuplicateColumn?: (column: Column) => void;
  onMoveColumn?: (listId: string, direction: 'left' | 'right') => void;
  onToggleCollapse?: (listId: string) => void;
  onArchiveColumn?: (listId: string) => void;
  onChangePriority?: (taskId: string, priority: 'low' | 'medium' | 'high') => void;
  onMoveCardInColumn?: (taskId: string, direction: 'left' | 'right') => void;
  isListDragging?:any
}

function ListItem({ 
  column,
  onOpenCard,
  onAddCard, 
  onEditCard, 
  onDeleteCard, 
  onEditColumn, 
  onDeleteColumn, 
  onMoveCard,
  onDuplicateCard,
  onDuplicateColumn,
  onMoveColumn,
  onToggleCollapse,
  onArchiveColumn,
  onChangePriority,
  onMoveCardInColumn,
  isListDragging,
}: KanbanColumnProps) {
  useEffect(() => {
    console.log(isListDragging);
    
  },[isListDragging])
  useEffect(() => {
    // console.log('Column updated:', column);
    if(column.cards && typeof column.cards !== 'object') {
      column.cards = JSON.parse(column.cards as unknown as string);
    }
  }, [column]);
  const dragging = useSelector((e:any) => e.list.dragging);
  const highPriorityCount = column.cards.filter(card => card.priority === 'high').length;
  const overdueTasks = column.cards.filter(card => 
    card.dueDate && new Date(card.dueDate) < new Date()
  ).length;
  const [isOver, setIsOver] = useState(0);
  const isAtLimit = column.limit && column.cards.length >= column.limit;
    const getListStyle = (isDraggingOver:any) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: 8,
    display: "flex",
    "justify-content": "flex-start",
    width: "100%",
    gap: "20px",
  });
  return (
      <ConditionalSortableWrapper
        isListDragging={isListDragging}
        key={`${column.id}-${column.isFixed}`}
        id={"LIST" + column?.id}
        isLock={column?.isFixed == 0 ? true : false}
        >
    <div className="flex-shrink-0 w-80">
        <div
              className={
                "listItem cursor-pointer" +
                (dragging === true ? " DRAGGING" : "")
              }
              data-id={column?.id}
              data-boardid={column?.board_id}
              data-name={column?.name}
              // style={getListStyle(column?.listColor || "")}
        >
          
              <SortableWrapper
                key={`${column.id}-${column.isFixed}`}
                id={"LIST" + column.id}
                isLock={column?.isFixed == 0 ? false : false}
          >
      <Card className={`h-full transition-all duration-300 border-border/60 shadow-sm hover:shadow-md ${
        isOver ? 'ring-2 ring-blue-200 shadow-lg border-blue-200 bg-blue-50/30' : 'bg-background'
      } ${column.collapsed ? 'opacity-75' : ''}`}>
        <CardHeader className="pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">{column.name}</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs font-medium px-2 py-1 ${
                    isAtLimit 
                      ? 'bg-amber-100 text-amber-800 border-amber-200' 
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {column.cards.length}{column.limit ? `/${column.limit}` : ''}
                </Badge>
                {highPriorityCount > 0 && (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 px-2 py-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></div>
                    {highPriorityCount}
                  </Badge>
                )}
                {overdueTasks > 0 && (
                  <Badge variant="destructive" className="text-xs animate-pulse px-2 py-1">
                    {overdueTasks}!
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddCard(column.id)}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-sm"
                disabled={isAtLimit}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 transition-colors rounded-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem onClick={() => onAddCard(column.id)} className="gap-2.5" disabled={isAtLimit}>
                    <Plus className="h-4 w-4" />
                    Add Card
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Column Management */}
                  <DropdownMenuItem onClick={() => onEditColumn(column)} className="gap-2.5">
                    <Edit className="h-4 w-4" />
                    Edit Column
                  </DropdownMenuItem>
                  {onDuplicateColumn && (
                    <DropdownMenuItem onClick={() => onDuplicateColumn(column)} className="gap-2.5">
                      <Copy className="h-4 w-4" />
                      Duplicate Column
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2.5">
                      <Settings className="h-4 w-4" />
                      Column Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem className="gap-2.5">
                        <Target className="h-4 w-4" />
                        Set Task Limit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <Palette className="h-4 w-4" />
                        Change Color
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <CheckSquare className="h-4 w-4" />
                        Auto-Complete Rules
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  {onToggleCollapse && (
                    <DropdownMenuItem onClick={() => onToggleCollapse(column.id)} className="gap-2.5">
                      {column.collapsed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      {column.collapsed ? 'Expand' : 'Collapse'} Column
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  {/* Organization */}
                  {onMoveColumn && (
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="gap-2.5">
                        <ArrowLeft className="h-4 w-4" />
                        Move Column
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => onMoveColumn(column.id, 'left')} className="gap-2.5">
                          <ArrowLeft className="h-4 w-4" />
                          Move Left
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onMoveColumn(column.id, 'right')} className="gap-2.5">
                          <ArrowRight className="h-4 w-4" />
                          Move Right
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  )}
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2.5">
                      <SortAsc className="h-4 w-4" />
                      Sort Cards
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem className="gap-2.5">
                        <AlertTriangle className="h-4 w-4" />
                        By Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <Calendar className="h-4 w-4" />
                        By Due Date
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <User className="h-4 w-4" />
                        By Assignee
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <SortAsc className="h-4 w-4" />
                        Alphabetical
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <Clock className="h-4 w-4" />
                        By Created Date
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2.5">
                      <Filter className="h-4 w-4" />
                      Filter Cards
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem className="gap-2.5">
                        <AlertTriangle className="h-4 w-4" />
                        Show High Priority Only
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <Calendar className="h-4 w-4" />
                        Show Overdue Tasks
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <User className="h-4 w-4" />
                        Show Unassigned
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <CheckSquare className="h-4 w-4" />
                        Show Completed
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Analytics & Actions */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2.5">
                      <BarChart3 className="h-4 w-4" />
                      Analytics
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem className="gap-2.5">
                        <BarChart3 className="h-4 w-4" />
                        Column Statistics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <Clock className="h-4 w-4" />
                        Time Tracking
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <Download className="h-4 w-4" />
                        Export Data
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2.5">
                      <Upload className="h-4 w-4" />
                      Bulk Actions
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem className="gap-2.5">
                        <Copy className="h-4 w-4" />
                        Duplicate All Cards
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <Archive className="h-4 w-4" />
                        Archive All Cards
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5">
                        <CheckSquare className="h-4 w-4" />
                        Mark All Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete All Cards
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Column Actions */}
                  {onArchiveColumn && (
                    <DropdownMenuItem onClick={() => onArchiveColumn(column.id)} className="gap-2.5">
                      <Archive className="h-4 w-4" />
                      Archive Column
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDeleteColumn(column.id)}
                    className="text-destructive gap-2.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {isAtLimit && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                Column limit reached
              </div>
            </div>
          )}
        </CardHeader>
        {!column.collapsed && (
          <CardContent className="pt-0">
            <div
              // ref={drop}
              className={`space-y-3 min-h-[240px] transition-all duration-300 rounded-lg ${
                isOver ? 'bg-blue-50/50 border-2 border-dashed border-blue-300 p-3' : 'p-1'
              }`}
            >
              {column.cards.map((card) => (
                <CardItem
                  listId={column.id}
                  key={card.id}
                  card={card}
                  onOpen={onOpenCard}
                  onEdit={onEditCard}
                  onDelete={onDeleteCard}
                  onDuplicate={onDuplicateCard}
                  onMove={onMoveCardInColumn}
                  onChangePriority={onChangePriority}
                />
              ))}
              {column.cards.length === 0 && !isOver && (
                <div className="text-center text-muted-foreground py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-border/60 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-muted-foreground/60" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">No tasks yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">Get started by adding your first card</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddCard(column.id)}
                    className="gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    disabled={isAtLimit}
                  >
                    <Plus className="h-4 w-4" />
                    Add a card
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
        </SortableWrapper>
        </div>

    </div>
      </ConditionalSortableWrapper>
  );
}
export default ListItem;