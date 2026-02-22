import React, { useState } from 'react';
import { Card } from '../../../ui/_card';
import { Input } from '../../../ui/_input';
import { Button } from '../../../ui/_button';
import { X } from 'lucide-react';
import TaskService from '../../../../services/auth/TaskService';

interface TaskCreatorProps {
  onCreateTask?: (task: TaskFormData) => void;
  onCancel?: () => void;
}

export interface TaskFormData {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  frequency:number
}

export function TaskCreator({ onCreateTask, onCancel }: TaskCreatorProps) {

  const taskService = new TaskService();
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    frequency:1
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = async function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof TaskFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const date = new Date(value);
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
    // Clear error for this field
    if (errors[name as keyof TaskFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCreateTask?.(formData);
      // Reset form
      setFormData({
        name: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        frequency:1
      });
      const addedTask = await taskService.create(localStorage.getItem("token"),formData);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      frequency:1
    });
    setErrors({});
    onCancel?.();
  };

  const formatDateForInput = (date: Date) => {
    return date ? date.toISOString().split('T')[0] : '';
  };

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Create New Task</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Name */}
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
            Task Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter task name..."
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="text-sm font-medium text-foreground mb-2 block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter task description (optional)..."
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="text-sm font-medium text-foreground mb-2 block">
              Start Date <span className="text-destructive">*</span>
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formatDateForInput(formData.startDate)}
              onChange={handleDateChange}
              className={errors.startDate ? 'border-destructive' : ''}
            />
            {errors.startDate && (
              <p className="text-sm text-destructive mt-1">{errors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="text-sm font-medium text-foreground mb-2 block">
              End Date <span className="text-destructive">*</span>
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formatDateForInput(formData.endDate)}
              onChange={handleDateChange}
              className={errors.endDate ? 'border-destructive' : ''}
            />
            {errors.endDate && (
              <p className="text-sm text-destructive mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Date Range Summary */}
        <div className="bg-accent/20 border border-accent p-4 rounded-md">
          <p className="text-sm text-foreground">
            <span className="font-medium">Duration:</span> {formatDateForInput(formData.startDate)} to{' '}
            {formatDateForInput(formData.endDate)}
          </p>
          {formData.startDate < formData.endDate && (
            <p className="text-sm text-muted-foreground mt-2">
              {Math.ceil(
                (formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)
              )}{' '}
              days
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-6">
          <Button type="submit" variant="default" className="flex-1">
            Create Task
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}
