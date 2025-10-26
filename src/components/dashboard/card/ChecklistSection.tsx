import { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2, X, Tag, Filter, SortAsc, User } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Checkbox } from '../../ui/_checkbox';
import { Input } from '../../ui/_input';
import { Badge } from '../../ui/_badge';
import { Progress } from '../../ui/_progress';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/_popover';
import { Calendar as CalendarComponent } from '../../ui/_calendar';
import { Label } from '../../ui/_label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/_select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import UserListCircleIcon from '../../sharedComponent/UserListCircleIcon/UserListCircleIcon';

interface Tag {
  label: string;
  color: string;
}

interface ChecklistItem {
  cliId: string;
  cliName: string;
  cliIsChecked: boolean;
  cliPosition?:number;
  dueDate?: Date;
  tags: Tag[];
  user?:any
}

function ChecklistSection({existingCheckList,addEditCheckList,deleteCheckList,openUserModal}: {existingCheckList?:ChecklistItem[],addEditCheckList?:Function,deleteCheckList?:Function,openUserModal?:Function}) {
  const [items, setItems] = useState<ChecklistItem[]>(existingCheckList || []);
  const [newItemText, setNewItemText] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  useEffect(()=>{
    if(existingCheckList){
      setItems(existingCheckList);
    }
  },[existingCheckList])
  const toggleItem = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cliId === itemId ? { ...item, cliIsChecked: !item.cliIsChecked } : item
      )
    );
    toast.success('Task updated');
  };

  const addItem = () => {
    if (newItemText.trim()) {
      // const newItem: ChecklistItem = {
      //   id: Date.now().toString(),
      //   text: newItemText.trim(),
      //   completed: false,
      //   tags: [],
      // };
      // setItems([...items, newItem]);
      // setNewItemText('');
      // toast.success('Task added to checklist');
      addEditCheckList && addEditCheckList(newItemText.trim());
    }
  };

  const addTagToItem = (itemId: string, label: string, color: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, tags: [...item.tags, { label, color }] }
          : item
      )
    );
    toast.success('Tag added');
  };

  const removeTagFromItem = (itemId: string, tagLabel: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, tags: item.tags.filter((tag) => tag.label !== tagLabel) }
          : item
      )
    );
    toast.success('Tag removed');
  };

  const setDueDate = (itemId: string, date: Date | undefined) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, dueDate: date } : item))
    );
    if (date) {
      toast.success('Due date set');
    } else {
      toast.success('Due date removed');
    }
  };

  const deleteItem = (itemId: string) => {
    // setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    deleteCheckList && deleteCheckList(itemId);
    toast.success('Task removed');
  };

  const completedCount = items.filter((item) => item.cliIsChecked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const tagColorMap: Record<string, string> = {
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  // Get all unique tags for filtering
  const allTags:any[] = []

  // Filter items based on selected tag
  const filteredItems = filterTag === 'all'
    ? items
    : items.filter((item) => item.tags.some((tag) => tag.label === filterTag));

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (sortBy === 'completed') {
      return Number(a.cliIsChecked) - Number(b.cliIsChecked);
    }
    if (sortBy === 'name') {
      return a.cliName.localeCompare(b.cliName);
    }
    return 0; // default order
  });
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Checklist</h3>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{totalCount} completed
        </span>
      </div>

      {sortedItems.length > 0 && <Progress value={progress} className="mb-4" />}

      {/* Filter and Sort Controls */}
      { sortedItems.length > 0 &&
        <div className="flex gap-2 mb-4">
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Order</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="completed">Completion</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>}

      <div className="space-y-2">
        {sortedItems.map((item) => (
          <div key={item.cliId} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 group border border-transparent hover:border-gray-200 transition-all">
            <Checkbox
              checked={item.cliIsChecked}
              onCheckedChange={() => toggleItem(item.cliId)}
              className="mt-1"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={item.cliIsChecked ? 'line-through text-muted-foreground' : ''}>
                  {item.cliName}
                </span>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {/* {item?.tags.map((tag) => (
                  <Badge
                    key={tag.label}
                    variant="secondary"
                    className="text-xs gap-1 pr-1"
                  >
                    <span className={`w-2 h-2 rounded-full ${tagColorMap[tag.color]}`} />
                    {tag.label}
                    <button
                      onClick={() => removeTagFromItem(item.id, tag.label)}
                      className="hover:bg-gray-300 rounded-full p-0.5 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))} */}
                <AddTagButton itemId={item.cliId

                } onAddTag={addTagToItem} />
                {item.user && Object.keys(item.user).length > 0 && Object.entries(item.user).length > 0 ? (
                        <>
                          <UserListCircleIcon showPlusButton={false} id={0} name={""} users={[item.user]} handleOpenUserAddModal={()=>{}}/>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">No assignees yet</span>
                  )}
              </div>
              {item.dueDate && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {format(item.dueDate, 'MMM dd, yyyy')}
                  </div>
                    )}
                  </div>
            <div className="flex items-center gap-1 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => openUserModal && openUserModal({id:item.cliId,name:item.cliName, user:(item?.user ? [item?.user]: [])}
                )}
                title="Delete task"
                >
                <User className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Set due date">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={item.dueDate}
                    onSelect={(date) => setDueDate(item.cliId
                      , date)}
                    initialFocus
                  />
                  {item.dueDate && (
                    <div className="p-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDueDate(item.cliId
                          , undefined)}
                        className="w-full"
                      >
                        Clear Date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => deleteItem(item.cliId

                )}
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          placeholder="Add new task..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className="flex-1"
        />
        <Button onClick={addItem} size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Component for adding tags to checklist items
interface AddTagButtonProps {
  itemId: string;
  onAddTag: (itemId: string, label: string, color: string) => void;
}

function AddTagButton({ itemId, onAddTag }: AddTagButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tagLabel, setTagLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState('green');

  const colors = [
    { name: 'green', class: 'bg-green-500' },
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'red', class: 'bg-red-500' },
    { name: 'yellow', class: 'bg-yellow-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagLabel.trim()) {
      onAddTag(itemId, tagLabel.trim(), selectedColor);
      setTagLabel('');
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <Tag className="h-3 w-3 mr-1" />
          Add Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Add Tag</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`tag-name-${itemId}`}>Tag Name</Label>
            <Input
              id={`tag-name-${itemId}`}
              placeholder="Enter tag name"
              value={tagLabel}
              onChange={(e) => setTagLabel(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full ${color.class} ${
                    selectedColor === color.name
                      ? 'ring-2 ring-offset-2 ring-gray-400'
                      : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              Add Tag
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default ChecklistSection;
