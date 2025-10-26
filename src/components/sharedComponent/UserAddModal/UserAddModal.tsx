import React, { useState,useMemo, useCallback, useEffect } from 'react';
import { X, User, Mail, Search, Plus, UserPlus, Edit3, Trash2} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/_dialog';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Label } from '../../ui/_label';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import { Badge } from '../../ui/_badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/_select';
import { Separator } from '../../ui/_separator';
import { ScrollArea } from '../../ui/_scroll-area';
import type { User as IUser } from '../../../interfaces/components/User';
import AuthService from '../../../services/auth/AuthService';
import debounce  from "lodash.debounce";
import { APP_ROLE } from '../../../constant/App';

interface UserAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUsers: (user:any[]) => void;
  onRemoveUsers?: (userId:number) => void;
  name: string;
  existingAssignees: IUser[];
}
const AVAILABLE_ROLES = [
  'Project Manager',
  'Developer',
  'Designer', 
  'QA Tester',
  'DevOps Engineer',
  'Product Owner',
  'Scrum Master',
  'Business Analyst'
];

export function UserAddModal({ 
  open, 
  onOpenChange, 
  onAddUsers,
  onRemoveUsers,
  name,
  existingAssignees 
}: UserAddModalProps) {
  const authService = new AuthService();
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTeamMembers, setAvailableTeamMembers] = useState<IUser[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const fetchUsers = async (params:any) => {
    const user = await authService.searchUser(params);
      if (user.status && user.status == 200) {
        setSearchResults(user.data);
        setShowSearchResults(true);
    } else {
        setSearchResults([]);
        setShowSearchResults(false);
    }
  };
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 400), []);
  // Filter users for search results (exclude already existing assignees and already added team members)
  useEffect(() => { 
      if (searchQuery && searchQuery.length >= 2) {
        debouncedFetchUsers(searchQuery);
      } else if (!searchQuery)
      {
          setSearchResults([])
      }
  }, [searchQuery]);
  useEffect(() => { 
      console.log(existingAssignees);
      
      setAvailableTeamMembers(existingAssignees)
      setSelectedUsers(existingAssignees)
  }, [existingAssignees]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

    const handleAddUserFromSearch = (user: IUser) => {        
    const searchedUser = searchResults.find((u:any) => Number(u.id) === Number(user.id));
    if (!searchedUser) return;
    const isSelected = selectedUsers.some(u => Number(u.id) === Number(user.id));
    if (isSelected) {
    setSelectedUsers(selectedUsers.filter(u => Number(u.id) !== Number(user.id)));
    setAvailableTeamMembers(availableTeamMembers.filter(u => Number(u.id) !== Number(user.id)));
  } else {
    const newTeamMember = {
      id: user.id,
      first_name: user.first_name,
      last_name: user?.last_name,
      email: user.email,
      role: (user.role || 1)
    }
    setSelectedUsers([...selectedUsers,newTeamMember ]);
    setAvailableTeamMembers(prev => [...prev, newTeamMember]);
  }
    // setSearchQuery('');
  };

  const handleRemoveTeamMember = (id: number) => {
    console.log(id);
    if(onRemoveUsers)
      onRemoveUsers(id)
    else{
      setAvailableTeamMembers(prev => prev.filter(member => member.id !== id));
      setSelectedUsers(selectedUsers.filter(u => Number(u.id) !== Number(id)));
    }
  };

  const handleRoleChange = (id: string, newRole: string) => {
    setAvailableTeamMembers((prev:any) => 
      prev.map((member:any) =>
        member.id === id ? { ...member, role_id: newRole } : member
      )
    );
  };

    const handleSave = () => {            
    onAddUsers(availableTeamMembers.filter(e => !e.creator));
    handleModalClose();
  };

  const handleModalClose = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
    setSelectedUsers(existingAssignees);
    setAvailableTeamMembers(existingAssignees);
    onOpenChange(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
    };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] max-h-[80vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Add Team Members
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-1">
            Search and add team members to <span className="font-medium text-gray-900">{name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search Section */}
          <div className="px-6 py-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={() => {
                  // Delay hiding results to allow for clicks
                  setTimeout(() => setShowSearchResults(false), 200);
                }}
                className="pl-10"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((user:any) => (
                    <div
                      key={user?.email}
                      onClick={() => handleAddUserFromSearch(user)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                    <input
                       type="checkbox"
                       checked={selectedUsers.some(u => u.id === user.id)}
                       onChange={() => {}} // Handled by onClick
                       className="rounded border-gray-300"
                        />
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="text-xs">
                            {user?.first_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {/* <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(user.status)}`} /> */}
                        </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate text-sm">{user?.first_name}</p>
                          {/* <Plus className="w-3 h-3 text-gray-400" /> */}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-sm text-gray-500">
                  No users found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          <div className="px-6">
            <Separator />
          </div>

          {/* Available Team Members List */}
          <div className="flex-1 overflow-hidden flex flex-col px-6 pt-4">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <Label className="text-sm text-gray-600">
                Available Team Members ({availableTeamMembers.length})
              </Label>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {availableTeamMembers.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No team members added yet</p>
                    <p className="text-xs text-gray-400 mt-1">Search and add users above</p>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-4">
                    {availableTeamMembers.length > 0 && availableTeamMembers.map((member:any) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member?.avatar} />
                            <AvatarFallback className="text-sm">
                              {member?.first_name?.charAt(0) || member?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member?.status)}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">{member.first_name || member.name}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        </div>

                        {/* Role Selector */}
                        <div className="flex items-center gap-2">
                            <Select 
                            disabled={member.creator}
                            value={member.role_id || member.role} 
                            onValueChange={(newRole) => handleRoleChange(member.id, newRole)}
                          >
                            <SelectTrigger className="w-40 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent 
                              className="z-[100]" 
                              position="popper"
                              side="bottom"
                              align="end"
                              sideOffset={4}
                            >
                              {Object.entries(APP_ROLE).map((role:any) => (
                                <SelectItem key={role[1].name} value={role[1].id} className="text-xs">
                                  {role[1].name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Remove Button */}
                        <Button
                          disabled={member.creator}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTeamMember(member.id || member.userId)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-600">
            {availableTeamMembers.length} member{availableTeamMembers.length !== 1 ? 's' : ''} to add
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={availableTeamMembers.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add {availableTeamMembers.length} Member{availableTeamMembers.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}