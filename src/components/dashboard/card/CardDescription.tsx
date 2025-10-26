import { useState } from 'react';
import { FileText, Edit2, Save, X } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Textarea } from '../../ui/_textarea';
import { toast } from 'sonner';

interface TaskDescriptionProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

function CardDescription({ description, onDescriptionChange }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localDescription, setLocalDescription] = useState(description);

  const handleSave = () => {
    onDescriptionChange(localDescription);
    setIsEditing(false);
    toast.success('Description updated');
  };

  const handleCancel = () => {
    setLocalDescription(description);
    setIsEditing(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <h3 className="font-medium">Description</h3>
        </div>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            className="min-h-[120px]"
            placeholder="Add a detailed description..."
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-sm min-h-[80px] cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsEditing(true)}>
          {description || (
            <span className="text-muted-foreground italic">Click to add a description...</span>
          )}
        </div>
      )}
    </div>
  );
}
export default CardDescription;