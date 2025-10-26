import React, { useState, useEffect } from 'react';
import {
  Filter,
  Search,
  X,
  ChevronDown,
  Calendar,
  Users,
  Tag,
  Settings,
  Save,
  Trash2,
  RotateCcw,
  Star,
  Plus,
  Check,
  Briefcase,
  BarChart3,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Label } from '../../ui/_label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui/_popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/_select';
import { DatePickerWithRange } from '../../ui/_date-picker';
import type { DateRange } from 'react-day-picker';
import { Badge } from '../../ui/_badge';
import { Separator } from '../../ui/_separator';
import { ScrollArea } from '../../ui/_scroll-area';
import { Checkbox } from '../../ui/_checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../ui/_command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/_dialog';
import { Textarea } from '../../ui/_textarea';

interface UserData {
  name: string;
  avatar?: string;
  email?: string;
  role?: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
}

interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: FilterState;
  isDefault?: boolean;
  isFavorite?: boolean;
}

interface FilterState {
  searchQuery: string;
  selectedUsers: string[];
  selectedStatuses: string[];
  selectedRoles: string[];
  selectedTags: string[];
  dateRange: DateRange | undefined;
  completionRange: { min: number; max: number };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  availableUsers: UserData[];
  availableTags: string[];
  totalResults: number;
  appliedFilters?: FilterState;
}

const AVAILABLE_STATUSES = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-800' }
];

const AVAILABLE_ROLES = [
  'Project Manager',
  'Frontend Developer', 
  'Backend Developer',
  'UI/UX Designer',
  'QA Tester',
  'DevOps Engineer',
  'Data Analyst',
  'Product Owner',
  'Scrum Master'
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Board Name' },
  { value: 'created', label: 'Created Date' },
  { value: 'completion', label: 'Completion %' },
  { value: 'assignees', label: 'Team Size' },
  { value: 'creator', label: 'Creator' }
];

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  selectedUsers: [],
  selectedStatuses: [],
  selectedRoles: [],
  selectedTags: [],
  dateRange: undefined,
  completionRange: { min: 0, max: 100 },
  sortBy: 'created',
  sortOrder: 'desc'
};

const DEFAULT_PRESETS: FilterPreset[] = [
  {
    id: 'all',
    name: 'All Boards',
    description: 'Show all boards without filters',
    filters: DEFAULT_FILTERS,
    isDefault: true
  },
  {
    id: 'active-high-priority',
    name: 'Active High Priority',
    description: 'Active boards with >80% completion',
    filters: {
      ...DEFAULT_FILTERS,
      selectedStatuses: ['active'],
      completionRange: { min: 80, max: 100 }
    }
  },
  {
    id: 'my-boards',
    name: 'My Boards',
    description: 'Boards where I am assigned',
    filters: {
      ...DEFAULT_FILTERS,
      selectedUsers: ['current-user'] // This would be dynamically set
    }
  }
];

export function AdvancedFilters({
  onFiltersChange,
  availableUsers,
  availableTags,
  totalResults,
  appliedFilters = DEFAULT_FILTERS
}: AdvancedFiltersProps) {
  const [pendingFilters, setPendingFilters] = useState<FilterState>(appliedFilters);
  const [appliedFiltersState, setAppliedFiltersState] = useState<FilterState>(appliedFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [presets, setPresets] = useState<FilterPreset[]>(DEFAULT_PRESETS);
  const [activePreset, setActivePreset] = useState<string>('all');
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');

  // Calculate active filter count for applied filters
  const activeFilterCount = Object.entries(appliedFiltersState).reduce((count, [key, value]) => {
    if (key === 'searchQuery' && value) return count + 1;
    if (Array.isArray(value) && value.length > 0) return count + 1;
    if (key === 'dateRange' && value) return count + 1;
    if (key === 'completionRange' && (value.min > 0 || value.max < 100)) return count + 1;
    return count;
  }, 0);

  // Check if there are pending changes
  const hasPendingChanges = JSON.stringify(pendingFilters) !== JSON.stringify(appliedFiltersState);

  const updatePendingFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...pendingFilters, ...newFilters };
    setPendingFilters(updatedFilters);
    setActivePreset(''); // Clear active preset when manually changing filters
  };

  const applyFilters = () => {
    setAppliedFiltersState(pendingFilters);
    onFiltersChange(pendingFilters);
  };

  const clearAllFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFiltersState(DEFAULT_FILTERS);
    onFiltersChange(DEFAULT_FILTERS);
    setActivePreset('all');
  };

  const resetPendingFilters = () => {
    setPendingFilters(appliedFiltersState);
  };

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setPendingFilters(preset.filters);
      setAppliedFiltersState(preset.filters);
      onFiltersChange(preset.filters);
      setActivePreset(presetId);
    }
  };

  const saveCurrentAsPreset = () => {
    if (!newPresetName.trim()) return;
    
    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      description: newPresetDescription.trim() || undefined,
      filters: { ...pendingFilters }
    };
    
    setPresets(prev => [...prev, newPreset]);
    setNewPresetName('');
    setNewPresetDescription('');
    setShowPresetModal(false);
    setActivePreset(newPreset.id);
  };

  const togglePresetFavorite = (presetId: string) => {
    setPresets(prev => prev.map(preset => 
      preset.id === presetId 
        ? { ...preset, isFavorite: !preset.isFavorite }
        : preset
    ));
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== presetId && !preset.isDefault));
    if (activePreset === presetId) {
      setActivePreset('all');
      applyPreset('all');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search and Filter Controls */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search boards..."
            value={pendingFilters.searchQuery}
            onChange={(e) => updatePendingFilters({ searchQuery: e.target.value })}
            className="pl-10"
          />
          {pendingFilters.searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => updatePendingFilters({ searchQuery: '' })}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Filter Toggle */}
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>

        {/* Filter Presets */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Presets
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Filter Presets</h4>
                <Dialog open={showPresetModal} onOpenChange={setShowPresetModal}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Plus className="w-3 h-3" />
                      Save
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Save Filter Preset</DialogTitle>
                      <DialogDescription>
                        Save your current filters as a preset for quick access later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="preset-name">Preset Name</Label>
                        <Input
                          id="preset-name"
                          placeholder="Enter preset name..."
                          value={newPresetName}
                          onChange={(e) => setNewPresetName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preset-description">Description (Optional)</Label>
                        <Textarea
                          id="preset-description"
                          placeholder="Describe what this preset is for..."
                          value={newPresetDescription}
                          onChange={(e) => setNewPresetDescription(e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowPresetModal(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={saveCurrentAsPreset}
                          disabled={!newPresetName.trim()}
                        >
                          Save Preset
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <ScrollArea className="max-h-64">
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                        activePreset === preset.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                      onClick={() => applyPreset(preset.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{preset.name}</p>
                          {preset.isFavorite && <Star className="w-3 h-3 text-yellow-500" />}
                        </div>
                        {preset.description && (
                          <p className="text-xs text-gray-500 truncate">{preset.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePresetFavorite(preset.id);
                          }}
                        >
                          <Star className={`w-3 h-3 ${preset.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`} />
                        </Button>
                        {!preset.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePreset(preset.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {totalResults} result{totalResults !== 1 ? 's' : ''}
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Team Members Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Members
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    {pendingFilters.selectedUsers.length === 0 
                      ? 'Select users...' 
                      : `${pendingFilters.selectedUsers.length} selected`
                    }
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search team members..." />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {availableUsers.map((user) => (
                          <CommandItem
                            key={user.email}
                            onSelect={() => {
                              const isSelected = pendingFilters.selectedUsers.includes(user.email!);
                              const newSelection = isSelected
                                ? pendingFilters.selectedUsers.filter(id => id !== user.email)
                                : [...pendingFilters.selectedUsers, user.email!];
                              updatePendingFilters({ selectedUsers: newSelection });
                            }}
                            className="flex items-center gap-3 p-2"
                          >
                            <Checkbox
                              checked={pendingFilters.selectedUsers.includes(user.email!)}
                              className="w-4 h-4"
                            />
                            <div className="relative">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-xs">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(user.status)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.role}</p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    {pendingFilters.selectedStatuses.length === 0 
                      ? 'All statuses' 
                      : `${pendingFilters.selectedStatuses.length} selected`
                    }
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="space-y-2">
                    {AVAILABLE_STATUSES.map((status) => (
                      <div key={status.value} className="flex items-center gap-2">
                        <Checkbox
                          checked={pendingFilters.selectedStatuses.includes(status.value)}
                          onCheckedChange={(checked) => {
                            const newSelection = checked
                              ? [...pendingFilters.selectedStatuses, status.value]
                              : pendingFilters.selectedStatuses.filter(s => s !== status.value);
                            updatePendingFilters({ selectedStatuses: newSelection });
                          }}
                        />
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Role Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Roles</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    {pendingFilters.selectedRoles.length === 0 
                      ? 'All roles' 
                      : `${pendingFilters.selectedRoles.length} selected`
                    }
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                  <ScrollArea className="max-h-48">
                    <div className="space-y-2">
                      {AVAILABLE_ROLES.map((role) => (
                        <div key={role} className="flex items-center gap-2">
                          <Checkbox
                            checked={pendingFilters.selectedRoles.includes(role)}
                            onCheckedChange={(checked) => {
                              const newSelection = checked
                                ? [...pendingFilters.selectedRoles, role]
                                : pendingFilters.selectedRoles.filter(r => r !== role);
                              updatePendingFilters({ selectedRoles: newSelection });
                            }}
                          />
                          <span className="text-sm">{role}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created Date
              </Label>
              <DatePickerWithRange
                date={pendingFilters.dateRange}
                onDateChange={(dateRange) => updatePendingFilters({ dateRange })}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tags Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    {pendingFilters.selectedTags.length === 0 
                      ? 'Select tags...' 
                      : `${pendingFilters.selectedTags.length} selected`
                    }
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                  <ScrollArea className="max-h-48">
                    <div className="space-y-2">
                      {availableTags.map((tag) => (
                        <div key={tag} className="flex items-center gap-2">
                          <Checkbox
                            checked={pendingFilters.selectedTags.includes(tag)}
                            onCheckedChange={(checked) => {
                              const newSelection = checked
                                ? [...pendingFilters.selectedTags, tag]
                                : pendingFilters.selectedTags.filter(t => t !== tag);
                              updatePendingFilters({ selectedTags: newSelection });
                            }}
                          />
                          <Badge variant="outline" className="text-xs">{tag}</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sort By</Label>
              <div className="flex gap-2">
                <Select
                  value={pendingFilters.sortBy}
                  onValueChange={(value) => updatePendingFilters({ sortBy: value })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePendingFilters({ 
                    sortOrder: pendingFilters.sortOrder === 'asc' ? 'desc' : 'asc' 
                  })}
                  className="px-3"
                >
                  {pendingFilters.sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>

          {/* Apply/Reset Buttons */}
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={applyFilters}
                disabled={!hasPendingChanges}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Check className="w-4 h-4" />
                Apply Filters
              </Button>
              {hasPendingChanges && (
                <Button
                  variant="outline"
                  onClick={resetPendingFilters}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Reset
                </Button>
              )}
            </div>
            
            {activeFilterCount > 0 && (
              <div className="text-xs text-gray-500">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
              </div>
            )}
          </div>

          {/* Applied Filters Display */}
          {activeFilterCount > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Applied Filters</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  {/* Search Query */}
                  {appliedFiltersState.searchQuery && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Search:</span>
                        <Badge variant="outline" className="bg-white">
                          "{appliedFiltersState.searchQuery}"
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          const newFilters = { ...appliedFiltersState, searchQuery: '' };
                          setAppliedFiltersState(newFilters);
                          setPendingFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* Team Members */}
                  {appliedFiltersState.selectedUsers.length > 0 && (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-sm text-gray-700">Team Members:</span>
                          <div className="flex flex-wrap gap-2">
                            {appliedFiltersState.selectedUsers.map((userEmail) => {
                              const user = availableUsers.find(u => u.email === userEmail);
                              return user ? (
                                <div key={userEmail} className="flex items-center gap-1 bg-white border rounded-md px-2 py-1 group">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{user.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-3 w-3 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all"
                                    onClick={() => {
                                      const newUsers = appliedFiltersState.selectedUsers.filter(email => email !== userEmail);
                                      const newFilters = { ...appliedFiltersState, selectedUsers: newUsers };
                                      setAppliedFiltersState(newFilters);
                                      setPendingFilters(newFilters);
                                      onFiltersChange(newFilters);
                                    }}
                                  >
                                    <X className="w-2 h-2" />
                                  </Button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={() => {
                          const newFilters = { ...appliedFiltersState, selectedUsers: [] };
                          setAppliedFiltersState(newFilters);
                          setPendingFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                        title="Remove all team member filters"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* Status */}
                  {appliedFiltersState.selectedStatuses.length > 0 && (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full mt-0.5"></div>
                        <div className="space-y-1">
                          <span className="text-sm text-gray-700">Status:</span>
                          <div className="flex flex-wrap gap-2">
                            {appliedFiltersState.selectedStatuses.map((status) => {
                              const statusConfig = AVAILABLE_STATUSES.find(s => s.value === status);
                              return statusConfig ? (
                                <div key={status} className="relative group">
                                  <Badge className={`${statusConfig.color} pr-6`}>
                                    {statusConfig.label}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0.5 top-0.5 h-3 w-3 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all rounded-full"
                                    onClick={() => {
                                      const newStatuses = appliedFiltersState.selectedStatuses.filter(s => s !== status);
                                      const newFilters = { ...appliedFiltersState, selectedStatuses: newStatuses };
                                      setAppliedFiltersState(newFilters);
                                      setPendingFilters(newFilters);
                                      onFiltersChange(newFilters);
                                    }}
                                  >
                                    <X className="w-2 h-2" />
                                  </Button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={() => {
                          const newFilters = { ...appliedFiltersState, selectedStatuses: [] };
                          setAppliedFiltersState(newFilters);
                          setPendingFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                        title="Remove all status filters"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* Roles */}
                  {appliedFiltersState.selectedRoles.length > 0 && (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-sm text-gray-700">Roles:</span>
                          <div className="flex flex-wrap gap-2">
                            {appliedFiltersState.selectedRoles.map((role) => (
                              <div key={role} className="relative group">
                                <Badge variant="outline" className="bg-white pr-6">
                                  {role}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0.5 top-0.5 h-3 w-3 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all rounded-full"
                                  onClick={() => {
                                    const newRoles = appliedFiltersState.selectedRoles.filter(r => r !== role);
                                    const newFilters = { ...appliedFiltersState, selectedRoles: newRoles };
                                    setAppliedFiltersState(newFilters);
                                    setPendingFilters(newFilters);
                                    onFiltersChange(newFilters);
                                  }}
                                >
                                  <X className="w-2 h-2" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={() => {
                          const newFilters = { ...appliedFiltersState, selectedRoles: [] };
                          setAppliedFiltersState(newFilters);
                          setPendingFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                        title="Remove all role filters"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* Tags */}
                  {appliedFiltersState.selectedTags.length > 0 && (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Tag className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-sm text-gray-700">Tags:</span>
                          <div className="flex flex-wrap gap-2">
                            {appliedFiltersState.selectedTags.map((tag) => (
                              <div key={tag} className="relative group">
                                <Badge variant="secondary" className="bg-white pr-6">
                                  {tag}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0.5 top-0.5 h-3 w-3 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all rounded-full"
                                  onClick={() => {
                                    const newTags = appliedFiltersState.selectedTags.filter(t => t !== tag);
                                    const newFilters = { ...appliedFiltersState, selectedTags: newTags };
                                    setAppliedFiltersState(newFilters);
                                    setPendingFilters(newFilters);
                                    onFiltersChange(newFilters);
                                  }}
                                >
                                  <X className="w-2 h-2" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={() => {
                          const newFilters = { ...appliedFiltersState, selectedTags: [] };
                          setAppliedFiltersState(newFilters);
                          setPendingFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                        title="Remove all tag filters"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* Date Range */}
                  {appliedFiltersState.dateRange && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Date Range:</span>
                        <div className="relative group">
                          <Badge variant="outline" className="bg-white pr-6">
                            {appliedFiltersState.dateRange.from?.toLocaleDateString()} - {appliedFiltersState.dateRange.to?.toLocaleDateString()}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0.5 top-0.5 h-3 w-3 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all rounded-full"
                            onClick={() => {
                              const newFilters = { ...appliedFiltersState, dateRange: undefined };
                              setAppliedFiltersState(newFilters);
                              setPendingFilters(newFilters);
                              onFiltersChange(newFilters);
                            }}
                          >
                            <X className="w-2 h-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completion Range */}
                  {(appliedFiltersState.completionRange.min > 0 || appliedFiltersState.completionRange.max < 100) && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Completion:</span>
                        <div className="relative group">
                          <Badge variant="outline" className="bg-white pr-6">
                            {appliedFiltersState.completionRange.min}% - {appliedFiltersState.completionRange.max}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0.5 top-0.5 h-3 w-3 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all rounded-full"
                            onClick={() => {
                              const newFilters = { ...appliedFiltersState, completionRange: { min: 0, max: 100 } };
                              setAppliedFiltersState(newFilters);
                              setPendingFilters(newFilters);
                              onFiltersChange(newFilters);
                            }}
                          >
                            <X className="w-2 h-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sort Configuration */}
                  {appliedFiltersState.sortBy !== 'lastUpdated' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Sort:</span>
                        <div className="relative group">
                          <Badge variant="outline" className="bg-white pr-6">
                            {SORT_OPTIONS.find(opt => opt.value === appliedFiltersState.sortBy)?.label} 
                            ({appliedFiltersState.sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0.5 top-0.5 h-3 w-3 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all rounded-full"
                            onClick={() => {
                              const newFilters = { ...appliedFiltersState, sortBy: 'lastUpdated', sortOrder: 'desc' };
                              setAppliedFiltersState(newFilters);
                              setPendingFilters(newFilters);
                              onFiltersChange(newFilters);
                            }}
                          >
                            <X className="w-2 h-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}