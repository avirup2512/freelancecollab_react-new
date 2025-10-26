import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/_popover';
import { Label } from '../../ui/_label';

interface TagManagerProps {
  onAddTag: (label: string, color: string) => void;
}

function TagManager({ onAddTag }: TagManagerProps) {
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
      onAddTag(tagLabel.trim(), selectedColor);
      setTagLabel('');
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Add New Tag</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-name">Tag Name</Label>
            <Input
              id="tag-name"
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

          
        </form>
      </PopoverContent>
    </Popover>
  );
}
export default TagManager;
