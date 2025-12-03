import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Textarea } from '../../ui/_textarea';
import { Label } from '../../ui/_label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/_dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/_select';

interface Team {
  id: string;
  name: string;
  description: string;
  category: string;
  members: any[];
  createdDate: string;
  createdBy: string;
  projectsCount: number;
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamData: Omit<Team, 'id' | 'createdDate' | 'createdBy' | 'projectsCount' | 'members'>) => void;
  editingTeam?: Team | null;
  categories: any[];
}

function CreateTeamModal({
  isOpen,
  onClose,
  onSubmit,
  editingTeam,
  categories,
}: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    category: '',
  });

  useEffect(() => {
    if (editingTeam) {
      setFormData({
        id: editingTeam.id,
        name: editingTeam.name,
        description: editingTeam.description,
        category: editingTeam.category,
      });
    } else {
      setFormData({
        id:'',
        name: '',
        description: '',
        category: '',
      });
    }
    setErrors({ name: '', category: '' });
  }, [editingTeam, isOpen,]);
    useEffect(() => { 
    console.log(categories);
    
  },[categories])


  const validateForm = () => {
    const newErrors = {
      name: '',
      category: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Team name must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.category;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      id:'',
      name: '',
      description: '',
      category: '',
    });
    setErrors({ name: '', category: '' });
  };

  const handleClose = () => {
    setFormData({
      id:'',
      name: '',
      description: '',
      category: '',
    });
    setErrors({ name: '', category: '' });
    onClose();
  };

  return ( 
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingTeam ? 'Edit Team' : 'Create New Team'}</DialogTitle>
          <DialogDescription>
            {editingTeam 
              ? 'Update team information and settings'
              : 'Create a new team and configure its basic settings'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="team-name">
              Team Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="team-name"
              placeholder="e.g., Frontend Development"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="team-category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({ ...formData, category: value });
                if (errors.category) setErrors({ ...errors, category: '' });
              }}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category}>
                    {category?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="team-description">Description</Label>
            <Textarea
              id="team-description"
              placeholder="Describe the team's purpose and responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
            <p className="text-gray-500 text-sm">
              Provide a clear description of what this team is responsible for
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingTeam ? 'Update Team' : 'Create Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTeamModal;