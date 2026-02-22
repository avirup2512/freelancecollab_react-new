import React, { useEffect, useState } from "react";
import { Card } from "../../../ui/_card";
import { Input } from "../../../ui/_input";
import { Button } from "../../../ui/_button";
import TaskService from "../../../../services/auth/TaskService";

interface TaskLogCreatorProps {
  onAdd?: (data: TaskLogFormData) => void;
  onCancel?: () => void;
}

export interface TaskLogFormData {
  taskId: string;
  date: Date;
  description: string;
  type: string;
  entry:boolean
}

const TYPE_OPTIONS = ["Scaler", "LeetCode", "HackerEarth", "CodeChef"];

export function UserTaskEntry({ onAdd, onCancel }: TaskLogCreatorProps) {
  const taskService = new TaskService();

  const [taskList, setTaskList] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [formData, setFormData] = useState<TaskLogFormData>({
    taskId: "",
    date: new Date(),
    description: "",
    type: "",
    entry:true,
  });

  const [errors, setErrors] =
    useState<Partial<Record<keyof TaskLogFormData, string>>>({});

  // Fetch task list (API call like your pattern)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await taskService.getList(
          localStorage.getItem("token")
        );
        setTaskList(tasks.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks", err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  // Validation (same style as yours)
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskLogFormData, string>> = {};

    if (!formData.taskId) newErrors.taskId = "Task is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.type) newErrors.type = "Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text/select change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof TaskLogFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: new Date(value),
    }));

    if (errors[name as keyof TaskLogFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // onAdd?.(formData);
    console.log(formData);
    formData.entry = true;
    // Example API call
    await taskService.addUserEntry(localStorage.getItem("token"), formData);

    handleReset();
  };

  // Reset
  const handleReset = () => {
    setFormData({
      taskId: "",
      date: new Date(),
      description: "",
      type: "",
      entry:true
    });
    setErrors({});
    onCancel?.();
  };

  const formatDateForInput = (date: Date) =>
    date ? date.toISOString().split("T")[0] : "";

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Add Task Log
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Task List */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Task <span className="text-destructive">*</span>
          </label>

          <select
            name="taskId"
            value={formData.taskId}
            onChange={handleInputChange}
            className={`w-full border rounded-md px-3 py-2 ${
              errors.taskId ? "border-destructive" : ""
            }`}
          >
            <option value="">Select Task</option>
            {loadingTasks ? (
              <option disabled>Loading...</option>
            ) : (
              taskList.map(task => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))
            )}
          </select>

          {errors.taskId && (
            <p className="text-sm text-destructive mt-1">{errors.taskId}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Date <span className="text-destructive">*</span>
          </label>

          <Input
            type="date"
            name="date"
            value={formatDateForInput(formData.date)}
            onChange={handleDateChange}
            className={errors.date ? "border-destructive" : ""}
          />

          {errors.date && (
            <p className="text-sm text-destructive mt-1">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Description <span className="text-destructive">*</span>
          </label>

          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.description ? "border-destructive" : ""
            }`}
          />

          {errors.description && (
            <p className="text-sm text-destructive mt-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* Type List */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Type <span className="text-destructive">*</span>
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`w-full border rounded-md px-3 py-2 ${
              errors.type ? "border-destructive" : ""
            }`}
          >
            <option value="">Select Type</option>
            {TYPE_OPTIONS.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {errors.type && (
            <p className="text-sm text-destructive mt-1">{errors.type}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-6">
          <Button type="submit" className="flex-1">
            Add
          </Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}