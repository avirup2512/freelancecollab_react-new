import React, { useState } from 'react';
import { Search, Mail, UserPlus, X, Check } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Label } from '../../ui/_label';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import { Badge } from '../../ui/_badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/_tabs';
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

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'active' | 'invited' | 'inactive';
  joinedDate: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  category: string;
  members: TeamMember[];
  createdDate: string;
  createdBy: string;
  projectsCount: number;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (members: TeamMember[]) => void;
  team: Team | null;
  existingMembers: TeamMember[];
}

const AVAILABLE_ROLES = [
  'Team Lead',
  'Project Manager',
  'Senior Developer',
  'Developer',
  'Junior Developer',
  'Senior Designer',
  'Designer',
  'Junior Designer',
  'QA Lead',
  'QA Tester',
  'DevOps Engineer',
  'Product Manager',
  'Business Analyst',
  'Scrum Master',
];

// Mock existing users in the system
const mockUsers = [
  {
    id: 'u1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    department: 'Engineering',
  },
  {
    id: 'u2',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    department: 'Design',
  },
  {
    id: 'u3',
    name: 'Robert Johnson',
    email: 'robert.j@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    department: 'Engineering',
  },
  {
    id: 'u4',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    department: 'Marketing',
  },
  {
    id: 'u5',
    name: 'Michael Brown',
    email: 'michael.b@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    department: 'Engineering',
  },
  {
    id: 'u6',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahW',
    department: 'Design',
  },
  {
    id: 'u7',
    name: 'David Miller',
    email: 'david.miller@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidM',
    department: 'QA',
  },
  {
    id: 'u8',
    name: 'Laura Martinez',
    email: 'laura.m@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    department: 'Product',
  },
  {
    id: 'u9',
    name: 'Kevin Anderson',
    email: 'kevin.a@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
    department: 'Engineering',
  },
  {
    id: 'u10',
    name: 'Amanda Taylor',
    email: 'amanda.t@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
    department: 'Marketing',
  },
];

function AddMemberModal({
  isOpen,
  onClose,
  onSubmit,
  team,
  existingMembers,
}: AddMemberModalProps) {
  const [activeTab, setActiveTab] = useState('existing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Map<string, string>>(new Map());
  
  // Invite new user form
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [inviteErrors, setInviteErrors] = useState({
    name: '',
    email: '',
    role: '',
  });

  const existingMemberIds = new Set(existingMembers.map(m => m.id));
  const availableUsers = mockUsers.filter(user => !existingMemberIds.has(user.id));

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleUser = (userId: string) => {
    const newSelected = new Map(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.set(userId, 'Developer'); // Default role
    }
    setSelectedUsers(newSelected);
  };

  const handleRoleChange = (userId: string, role: string) => {
    const newSelected = new Map(selectedUsers);
    newSelected.set(userId, role);
    setSelectedUsers(newSelected);
  };

  const validateInviteForm = () => {
    const errors = {
      name: '',
      email: '',
      role: '',
    };

    if (!inviteForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!inviteForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email)) {
      errors.email = 'Invalid email format';
    }

    if (!inviteForm.role) {
      errors.role = 'Role is required';
    }

    setInviteErrors(errors);
    return !errors.name && !errors.email && !errors.role;
  };

  const handleAddMembers = () => {
    if (activeTab === 'existing') {
      if (selectedUsers.size === 0) {
        return;
      }

      const newMembers: TeamMember[] = Array.from(selectedUsers.entries()).map(([userId, role]) => {
        const user = availableUsers.find(u => u.id === userId)!;
        return {
          id: userId,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: role,
          status: 'active' as const,
          joinedDate: new Date().toISOString().split('T')[0],
        };
      });

      onSubmit(newMembers);
      setSelectedUsers(new Map());
      setSearchQuery('');
    } else {
      if (!validateInviteForm()) {
        return;
      }

      const newMember: TeamMember = {
        id: `invited-${Date.now()}`,
        name: inviteForm.name,
        email: inviteForm.email,
        role: inviteForm.role,
        status: 'invited' as const,
        joinedDate: new Date().toISOString().split('T')[0],
      };

      onSubmit([newMember]);
      setInviteForm({ name: '', email: '', role: '' });
      setInviteErrors({ name: '', email: '', role: '' });
    }
  };

  const handleClose = () => {
    setSelectedUsers(new Map());
    setSearchQuery('');
    setInviteForm({ name: '', email: '', role: '' });
    setInviteErrors({ name: '', email: '', role: '' });
    setActiveTab('existing');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Members to {team?.name}</DialogTitle>
          <DialogDescription>
            Add existing users to your team or invite new members via email
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Existing Users
            </TabsTrigger>
            <TabsTrigger value="invite">
              <Mail className="w-4 h-4 mr-2" />
              Invite New User
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="flex-1 flex flex-col overflow-hidden space-y-4 mt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Count */}
            {selectedUsers.size > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-700 text-sm">
                  {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* User List */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">
                    {searchQuery ? 'No users found matching your search' : 'No available users to add'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.has(user.id);
                    const userRole = selectedUsers.get(user.id) || 'Developer';

                    return (
                      <div
                        key={user.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300 hover:border-blue-400'
                              }`}
                              onClick={() => handleToggleUser(user.id)}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="text-gray-900">{user.name}</div>
                              <div className="text-gray-600 text-sm">{user.email}</div>
                              <Badge variant="secondary" className="mt-1">
                                {user.department}
                              </Badge>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-48">
                              <Select value={userRole} onValueChange={(role) => handleRoleChange(user.id, role)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {AVAILABLE_ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm">
                An invitation email will be sent to the user with instructions to join the team.
              </p>
            </div>

            {/* Invite Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invite-name"
                  placeholder="e.g., John Doe"
                  value={inviteForm.name}
                  onChange={(e) => {
                    setInviteForm({ ...inviteForm, name: e.target.value });
                    if (inviteErrors.name) setInviteErrors({ ...inviteErrors, name: '' });
                  }}
                  className={inviteErrors.name ? 'border-red-500' : ''}
                />
                {inviteErrors.name && (
                  <p className="text-red-500 text-sm">{inviteErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="e.g., john.doe@company.com"
                  value={inviteForm.email}
                  onChange={(e) => {
                    setInviteForm({ ...inviteForm, email: e.target.value });
                    if (inviteErrors.email) setInviteErrors({ ...inviteErrors, email: '' });
                  }}
                  className={inviteErrors.email ? 'border-red-500' : ''}
                />
                {inviteErrors.email && (
                  <p className="text-red-500 text-sm">{inviteErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-role">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(role) => {
                    setInviteForm({ ...inviteForm, role });
                    if (inviteErrors.role) setInviteErrors({ ...inviteErrors, role: '' });
                  }}
                >
                  <SelectTrigger className={inviteErrors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {inviteErrors.role && (
                  <p className="text-red-500 text-sm">{inviteErrors.role}</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={activeTab === 'existing' ? selectedUsers.size === 0 : false}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {activeTab === 'existing' ? (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Add {selectedUsers.size > 0 ? `${selectedUsers.size} ` : ''}Members
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AddMemberModal;