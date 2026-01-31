import React, { useCallback, useEffect, useState } from 'react';
import { Plus, X, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/_dialog';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Label } from '../../ui/_label';
import { Textarea } from '../../ui/_textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/_select';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import type { AddProjectModalProps, NewProjectData } from '../../../interfaces/components/Project';
import type { User as IUser } from '../../../interfaces/components/User';
import debounce from "lodash.debounce";
import ProjectService from '../../../services/auth/ProjectService';


interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}


export function AddProjectModal({ open, isEdit, project, type, onOpenChange, onAddProject }: AddProjectModalProps) {
  const projectService = new ProjectService();
  const [formData, setFormData] = useState<NewProjectData>({
    name: '',
    description: '',
    status: 'active',
    users: [],
  });
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchedUser, setSearchedUser] = useState<IUser[]>([]);
  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  // Filter users based on search term
  const filteredUsers = searchedUser.filter(user =>
    user.first_name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );
  const fetchUsers = async (params:any) => {        
    const user = await projectService.searchUser(params);    
  if (user.status && user.status == 200)
  {
    setSearchedUser(user.data);
  } else {
    setSearchedUser([]);
  }
  }
    const debouncedFetchUsers = useCallback(debounce(fetchUsers, 400), []);
  // const availableRoles = [
  //   'Project Manager',
  //   'Developer',
  //   'Designer',
  //   'QA Tester',
  //   'Product Owner',
  //   'Business Analyst',
  //   'DevOps Engineer',
  //   'Stakeholder'
  // ];
  const availableRoles = [
    { id:3,value:"ROLE_SUPER_ADMIN"},
    { id:2, value:"ROLE_ADMIN"},
    { id:1, value:"ROLE_BASIC"}
  ]
  useEffect(() => {
    setSearchedUser([]);
  },[])
  useEffect(() => {  
    let existingFormData: NewProjectData = {
        name: "",
        description:"",
        users:[] ,
    }
    if (isEdit && project)
    {
      const user = project?.user ? project?.user.map((e: any) => { return { ...e, role: e.role_id } }): [];
      existingFormData.id = project?.id;
      existingFormData.name = (project?.name || "");
      existingFormData.description = (project?.description || "");
      existingFormData.users = (user || []);
      setFormData(existingFormData);
      setSelectedUsers(user)
      setSearchedUser(user)
    } else if (!isEdit)
    {
      setFormData(existingFormData);
      setSelectedUsers([])
      setSearchedUser([])
    }
  },[isEdit,project])
  const handleSubmit = async (e: React.FormEvent) => {    
    e.preventDefault();
    formData.users = selectedUsers.map(user => ({
      user_id: user.id,
      role: user.role,
    }));
    onAddProject(formData,type)
    // if (!formData.name.trim()) {
    //   return;
    // }
    // const projectData:any = {
    //   ...formData,
    //     users: selectedUsers.map(user => ({
    //     user_id: user.id,
    //     role: user.role,
    //   })),
    // };    
    // if (!isEdit)
    // {
    //   const savedProject = await projectService.createProject(projectData);
    //   if (savedProject.status && savedProject.status == 200)
    //   {
    //     // Reset form
    //     setFormData({
    //       name: '',
    //       description: '',
    //       users: [],
    //     });
    //     setSelectedUsers([]);
    //     onOpenChange({isOpen:false,isEdit:false});
    //   }
    // } else {
    //   projectData.projectId = project?.id;
    //   const savedProject = await projectService.editProject(projectData);
    //   if (savedProject.status && savedProject.status == 200)
    //   {
    //     // Reset form
    //     setFormData({
    //       name: '',
    //       description: '',
    //       users: [],
    //     });
    //     setSelectedUsers([]);
    //     onOpenChange({isOpen:false,isEdit:false});
    //   }
    // }
  };

const handleUserSelect = (userId: number) => {
  const user = searchedUser.find(u => Number(u.id) === Number(userId));
  if (!user) return;
  console.log(selectedUsers);
  
  const isSelected = selectedUsers.some(u => Number(u.id) === Number(userId));
  if (isSelected) {
    setSelectedUsers(selectedUsers.filter(u => Number(u.id) !== Number(userId)));
  } else {
    setSelectedUsers([...selectedUsers, {
      id: user.id,
      first_name: user.first_name,
      last_name: user?.last_name,
      email: user.email,
      role: (user.role || 1)
    }]);
  }
};
  const handleRoleChange = (userId: number, newRole: number) => {
    console.log(newRole);
    setSelectedUsers(selectedUsers.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };
  // Close dropdown when clicking outside
  const handleDropdownToggle = () => {
    setShowUserDropdown(!showUserDropdown);
    if (!showUserDropdown) {
      setUserSearchTerm(''); // Reset search when opening
    }
  };
  const searchUser = (e:any) => {
    const value = e.target.value;
    setUserSearchTerm(value)
  if (value == null)
      setSearchedUser([]);
  if (value.length >= 2) {
      debouncedFetchUsers(value);
  } else {
    setSearchedUser([]);
    }
  };
  const getRoleValue = (role_id: number) => {    
    return (availableRoles.find((e) => e.id == role_id))?.id;
  }
  return (
    <Dialog open={open} onOpenChange={(open:boolean)=>{onOpenChange({isOpen:open,isEdit})}}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new project board to organize and track your work.
          </DialogDescription>
              </DialogHeader>
              <div className='flex-1 overflow-y-auto'>
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="board-name">Board Name*</Label>
                <Input
                  id="board-name"
                  placeholder="Enter board name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

          <div className="space-y-2">
            <Label htmlFor="board-description">Description</Label>
            <Textarea
              id="board-description"
              placeholder="Brief description of the board's purpose..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="board-status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'archived' | 'blocked') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="total-cards">Initial Cards</Label>
              <Input
                id="total-cards"
                type="number"
                min="1"
                max="100"
                value={formData.totalCards}
                onChange={(e) => setFormData({ ...formData, totalCards: parseInt(e.target.value) })}
              />
            </div> */}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleDropdownToggle}
              >
                <User className="w-4 h-4" />
                {selectedUsers.length === 0 
                  ? 'Select team members...' 
                  : `${selectedUsers.length} member${selectedUsers.length > 1 ? 's' : ''} selected`
                }
              </Button>
              
              {showUserDropdown && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-hidden">
                  <div className="p-3 border-b border-gray-200" onClick={handleSearchClick}>
                    <Input
                      placeholder="Search team members..."
                      value={userSearchTerm}
                      onChange={(e) => searchUser(e)}
                      className="w-full"
                      onClick={handleSearchClick}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {searchedUser.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No team members found
                      </div>
                    ) : (
                      searchedUser.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleUserSelect(user.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.some(u => u.id === user.id)}
                            onChange={() => {}} // Handled by onClick
                            className="rounded border-gray-300"
                          />
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">
                              {user.first_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1">{user.first_name+" "+ user?.last_name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
                {selectedUsers.length > 0 && (
                <div className="space-y-3 mt-4">
                    <div className="text-sm font-medium text-gray-700">Selected Members & Roles</div>
                    <div className="space-y-2">
                    {selectedUsers.map((user) => (
                        <div 
                        key={user.id} 
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">
                            {user.first_name && user.first_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="font-medium text-sm">{user.first_name}</div>
                        </div>
                        <div className="flex-1">
                            {user?.creator && <div className="font-medium text-sm">Creator</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Select 
                            disabled={user?.creator}
                            value={getRoleValue(user?.role)?.toString()}
                            onValueChange={(newRole:any) => handleRoleChange(user?.id, newRole)}
                            >
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableRoles.map((role) => (
                                <SelectItem key={role.id} value={role.id.toString()}>
                                    {role.value}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                          <Button
                            disabled={user?.creator}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-red-100"
                            onClick={() => handleUserSelect(Number(user.id))}
                            >
                            <X className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}
          </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange({isOpen:false,isEdit})}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.name.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              {!isEdit && "Create"} {isEdit && "Edit"} Project
            </Button>
          </div>
        </form>
              </div>
       
      </DialogContent>
    </Dialog>
  );
}
export default AddProjectModal;