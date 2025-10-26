import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/_dialog';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Label } from '../../ui/_label';
import { Slider } from '../../ui/_slider';
import { Switch } from '../../ui/_switch';
import { Separator } from '../../ui/_separator';
import {type Column } from './ListItem';
import { Columns, Hash, Lock } from 'lucide-react';

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (column: Omit<Column, 'id' | 'tasks'>) => void;
  editingColumn?: Column;
}

function AddListDialog({ open, onOpenChange, onSave, editingColumn }: AddColumnDialogProps) {
  const [title, setTitle] = useState(editingColumn?.title || '');
  const [limit, setLimit] = useState(editingColumn?.limit || 0);
  const [hasLimit, setHasLimit] = useState((editingColumn?.limit || 0) > 0);

  useEffect(() => {
    if (editingColumn) {
      setTitle(editingColumn.title);
      setLimit(editingColumn.limit || 0);
      setHasLimit((editingColumn.limit || 0) > 0);
    }
  }, [editingColumn]);

  const handleSave = () => {
    if (!title.trim()) return;

    const columnData: Omit<Column, 'id' | 'tasks'> = {
      title: title.trim(),
      limit: hasLimit ? limit : undefined,
    };

    onSave(columnData);
    
    // Reset form
    setTitle('');
    setLimit(0);
    setHasLimit(false);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setTitle(editingColumn?.title || '');
      setLimit(editingColumn?.limit || 0);
      setHasLimit((editingColumn?.limit || 0) > 0);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
              <Columns className="h-4 w-4" />
            </div>
            {editingColumn ? 'Edit Column' : 'Create New Column'}
          </DialogTitle>
          <DialogDescription>
            {editingColumn ? 'Update column settings and configuration' : 'Add a new column to organize your tasks'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="columnTitle" className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Column Title *
            </Label>
            <Input
              id="columnTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., To Do, In Progress, Review, Done"
              className="focus:border-blue-300 focus:ring-blue-100"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Work In Progress (WIP) Limit
                </Label>
                <p className="text-sm text-muted-foreground">
                  Limit the number of cards in this column to improve focus and flow
                </p>
              </div>
              <Switch
                checked={hasLimit}
                onCheckedChange={setHasLimit}
                className="mt-1"
              />
            </div>

            {hasLimit && (
              <div className="space-y-4 p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Maximum cards allowed</Label>
                  <div className="flex items-center justify-center w-12 h-8 bg-blue-100 text-blue-700 rounded-lg font-medium">
                    {limit}
                  </div>
                </div>
                <Slider
                  value={[limit]}
                  onValueChange={(value) => setLimit(value[0])}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 card</span>
                  <span>20 cards</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim()} 
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Columns className="h-4 w-4" />
            {editingColumn ? 'Update Column' : 'Create Column'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default AddListDialog;