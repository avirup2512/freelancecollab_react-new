import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/_dialog';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Textarea } from '../../ui/_textarea';
import { Label } from '../../ui/_label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/_select';
import { Badge } from '../../ui/_badge';
import { Separator } from '../../ui/_separator';
import type{ Card, Tag as TagType } from '../../../interfaces/components/Card';
import { Plus, X, Flag, User, Calendar, Tag, FileText, Edit } from 'lucide-react';
import type { Priority } from '../../../interfaces/components/Card';
import { PriorityList } from '../../../constant/App';
import { TagManagerModal } from '../../sharedComponent/TagManager/TagManager';

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, listId:number) => void;
  onSave: (card: Omit<Card, 'id'>) => void;
  editingTask?:Card;
  listId:number
}

function AddCardDialog({ open, onOpenChange, onSave, editingTask, listId }: AddCardDialogProps) {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority || {id:3,value:'medium'});
  const [assignee, setAssignee] = useState(editingTask?.assignee || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [tags, setTags] = useState<TagType[]>(editingTask?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [appliedTagIds, setAppliedTagIds] = useState<string[]>(["1", "3"]);
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setAssignee(editingTask.assignee || '');
      setDueDate(editingTask.dueDate || '');
      setTags(editingTask.tags || []);
    }
  }, [editingTask]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const cardData: Omit<Card, 'id'> = {
      name: title.trim(),
      description: description.trim() || undefined,
      priority,
      assignee: assignee.trim() || undefined,
      dueDate: dueDate || undefined,
      tags: tags.length > 0 ? tags : undefined,
      listId
    };

    onSave(cardData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority({id:3,value:'medium'});
    setAssignee('');
    setDueDate('');
    setTags([]);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setTitle(editingTask?.title || '');
      setDescription(editingTask?.description || '');
      setPriority(editingTask?.priority || {id:3,value:'medium'});
      setAssignee(editingTask?.assignee || '');
      setDueDate(editingTask?.dueDate || '');
      setTags(editingTask?.tags || []);
    }
    onOpenChange(newOpen);
  };
    const handleAddTag = (label: string, color: string) => {
    const newTag = {
      id: Date.now().toString(),
      label,
      color,
    };
    setTags([...tags, newTag]);
    // toast.success('Tag added successfully');
  };
    const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    // toast.success('Tag removed');
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
              {editingTask ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </div>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {editingTask ? 'Update task details and settings' : 'Add a new task to your project board'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Title and Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear, descriptive task title"
                className="focus:border-blue-300 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional context and details for this task"
                rows={3}
                className="resize-none focus:border-blue-300 focus:ring-blue-100"
              />
            </div>
          </div>

          <Separator />

          {/* Priority and Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                Priority
              </Label>
              <Select value={priority} onValueChange={(value: string) => setPriority(value)}>
                <SelectTrigger className="focus:border-blue-300 focus:ring-blue-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {
                    PriorityList.map((e) => {
                      return <>
                        <SelectItem value={e} className="gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          {e.value} Priority
                        </div>
                      </SelectItem>
                      </>
                    })
                  }
                  
                  {/* <SelectItem value="3" className="gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="2" className="gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      High Priority
                    </div>
                  </SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Assignee
              </Label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Who will work on this?"
                className="focus:border-blue-300 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="focus:border-blue-300 focus:ring-blue-100"
            />
          </div>
          <div className="space-y-2">
          <Button onClick={() => setIsTagModalOpen(true)} className="gap-2">
            <Tag className="size-4" />
            Manage Tags
          </Button>
        </div>
          {/* Tags */}
          {/* <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 focus:border-blue-300 focus:ring-blue-100"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
                className="px-4"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1.5 px-2.5 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-slate-300 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div> */}
          <TagManagerModal
          open={isTagModalOpen} 
          onOpenChange={setIsTagModalOpen}
          appliedTagIds={appliedTagIds}
          onAppliedTagsChange={setAppliedTagIds} />
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {editingTask ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingTask ? 'Update Card' : 'Create Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default AddCardDialog;