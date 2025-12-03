import React, { useEffect, useState } from 'react';
import { Search, Plus, Grid3x3, List, Users, Mail, Settings, Trash2, UserPlus, MoreVertical, Edit } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Badge } from '../../ui/_badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../ui/_dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/_select';
import CreateTeamModal from './CreateTeamModal';
import AddMemberModal from './AddMemberModal';
import TeamService from '../../../services/auth/TeamService';
import CategoryService from '../../../services/auth/CategoryService';
// import { ManageMemberModal } from './components/ManageMemberModal';
// import { ConfirmationModal } from './components/confirmation-modal';

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

const TEAM_CATEGORIES = [
  'Development',
  'Design',
  'Marketing',
  'Sales',
  'Support',
  'Operations',
  'HR',
  'Finance',
];

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Frontend Development',
    description: 'Team responsible for building and maintaining the frontend applications',
    category: 'Development',
    createdDate: '2024-01-15',
    createdBy: 'John Doe',
    projectsCount: 12,
    members: [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        role: 'Team Lead',
        status: 'active',
        joinedDate: '2024-01-15',
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.c@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        role: 'Senior Developer',
        status: 'active',
        joinedDate: '2024-01-20',
      },
      {
        id: '3',
        name: 'Emily Davis',
        email: 'emily.d@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        role: 'Developer',
        status: 'active',
        joinedDate: '2024-02-01',
      },
      {
        id: '4',
        name: 'Alex Brown',
        email: 'alex.b@company.com',
        role: 'Junior Developer',
        status: 'invited',
        joinedDate: '2024-11-10',
      },
    ],
  },
  {
    id: '2',
    name: 'UX/UI Design',
    description: 'Creative team focused on user experience and interface design',
    category: 'Design',
    createdDate: '2024-02-01',
    createdBy: 'Jane Smith',
    projectsCount: 8,
    members: [
      {
        id: '5',
        name: 'Lisa Wang',
        email: 'lisa.w@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        role: 'Design Lead',
        status: 'active',
        joinedDate: '2024-02-01',
      },
      {
        id: '6',
        name: 'Tom Martinez',
        email: 'tom.m@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
        role: 'UI Designer',
        status: 'active',
        joinedDate: '2024-02-15',
      },
      {
        id: '7',
        name: 'Nina Patel',
        email: 'nina.p@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina',
        role: 'UX Designer',
        status: 'active',
        joinedDate: '2024-03-01',
      },
    ],
  },
  {
    id: '3',
    name: 'Backend Engineering',
    description: 'Server-side development and API management',
    category: 'Development',
    createdDate: '2024-01-10',
    createdBy: 'John Doe',
    projectsCount: 15,
    members: [
      {
        id: '8',
        name: 'David Kim',
        email: 'david.k@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        role: 'Team Lead',
        status: 'active',
        joinedDate: '2024-01-10',
      },
      {
        id: '9',
        name: 'Rachel Green',
        email: 'rachel.g@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
        role: 'Senior Developer',
        status: 'active',
        joinedDate: '2024-01-15',
      },
    ],
  },
  {
    id: '4',
    name: 'Marketing & Growth',
    description: 'Digital marketing, content creation, and growth strategies',
    category: 'Marketing',
    createdDate: '2024-03-01',
    createdBy: 'Jane Smith',
    projectsCount: 6,
    members: [
      {
        id: '10',
        name: 'Sophie Turner',
        email: 'sophie.t@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
        role: 'Marketing Manager',
        status: 'active',
        joinedDate: '2024-03-01',
      },
      {
        id: '11',
        name: 'Chris Evans',
        email: 'chris.e@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
        role: 'Content Strategist',
        status: 'active',
        joinedDate: '2024-03-10',
      },
      {
        id: '12',
        name: 'Maya Anderson',
        email: 'maya.a@company.com',
        role: 'SEO Specialist',
        status: 'invited',
        joinedDate: '2024-11-12',
      },
    ],
  },
  {
    id: '5',
    name: 'Quality Assurance',
    description: 'Testing and quality control for all products',
    category: 'Development',
    createdDate: '2024-02-15',
    createdBy: 'John Doe',
    projectsCount: 10,
    members: [
      {
        id: '13',
        name: 'James Wilson',
        email: 'james.w@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        role: 'QA Lead',
        status: 'active',
        joinedDate: '2024-02-15',
      },
      {
        id: '14',
        name: 'Anna Lee',
        email: 'anna.l@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        role: 'QA Tester',
        status: 'active',
        joinedDate: '2024-03-01',
      },
    ],
  },
  {
    id: '6',
    name: 'Customer Support',
    description: 'Dedicated team for customer success and support',
    category: 'Support',
    createdDate: '2024-01-20',
    createdBy: 'Jane Smith',
    projectsCount: 4,
    members: [
      {
        id: '15',
        name: 'Lucas Brown',
        email: 'lucas.b@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
        role: 'Support Manager',
        status: 'active',
        joinedDate: '2024-01-20',
      },
      {
        id: '16',
        name: 'Emma Taylor',
        email: 'emma.t@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        role: 'Support Agent',
        status: 'active',
        joinedDate: '2024-02-01',
      },
      {
        id: '17',
        name: 'Oliver Smith',
        email: 'oliver.s@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
        role: 'Support Agent',
        status: 'active',
        joinedDate: '2024-02-10',
      },
    ],
  },
];

export default function TeamManagement() {
  const teamService = new TeamService();
  const categoryService = new CategoryService();

  const [ categories, setCategories] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isManageMemberOpen, setIsManageMemberOpen] = useState(false);
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      const data = await categoryService.getAllCategory(token);
      setCategories(data || []);
    };
    fetchCategories();
  }, []);
  
  // Selected states
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || team.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTeam = async (teamData: Omit<Team, 'id' | 'createdDate' | 'createdBy' | 'projectsCount' | 'members'>) => {
    console.log(teamData);
    
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      projectsCount: 0,
      members: [],
    };
    const createdTeam = await teamService.createTeam(localStorage.getItem("token"),newTeam);
    console.log(createdTeam);
    
    setTeams([newTeam, ...teams]);
    setIsCreateTeamOpen(false);
  };

  const handleEditTeam = (teamData: Omit<Team, 'id' | 'createdDate' | 'createdBy' | 'projectsCount' | 'members'>) => {
    if (!editingTeam) return;
    
    setTeams(teams.map(team => 
      team.id === editingTeam.id 
        ? { ...team, ...teamData }
        : team
    ));
    setEditingTeam(null);
    setIsCreateTeamOpen(false);
  };

  const handleDeleteTeam = () => {
    if (!selectedTeam) return;
    setTeams(teams.filter(team => team.id !== selectedTeam.id));
    setIsDeleteTeamOpen(false);
    setSelectedTeam(null);
  };

  const handleAddMembers = (teamId: string, members: TeamMember[]) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: [...team.members, ...members] }
        : team
    ));
    setIsAddMemberOpen(false);
    setSelectedTeam(null);
  };

  const handleUpdateMemberRole = (teamId: string, memberId: string, newRole: string) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? {
            ...team,
            members: team.members.map(member =>
              member.id === memberId ? { ...member, role: newRole } : member
            )
          }
        : team
    ));
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? {
            ...team,
            members: team.members.filter(member => member.id !== memberId)
          }
        : team
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Development: 'bg-blue-100 text-blue-700',
      Design: 'bg-purple-100 text-purple-700',
      Marketing: 'bg-green-100 text-green-700',
      Sales: 'bg-yellow-100 text-yellow-700',
      Support: 'bg-orange-100 text-orange-700',
      Operations: 'bg-gray-100 text-gray-700',
      HR: 'bg-pink-100 text-pink-700',
      Finance: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; text: string }> = {
      active: { variant: 'default', text: 'Active' },
      invited: { variant: 'secondary', text: 'Invited' },
      inactive: { variant: 'outline', text: 'Inactive' },
    };
    const config = variants[status] || variants.active;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-900 mb-2">Team Management</h1>
              <p className="text-gray-600">
                Create and manage teams, assign members, and configure roles
              </p>
            </div>
            <Button onClick={() => setIsCreateTeamOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {TEAM_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Total Teams:</span>
              <span className="text-gray-900">{teams.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Filtered:</span>
              <span className="text-gray-900">{filteredTeams.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Total Members:</span>
              <span className="text-gray-900">
                {teams.reduce((acc, team) => acc + team.members.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Content */}
      <div className="px-8 py-6">
        {filteredTeams.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No teams found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first team'}
            </p>
            {!searchQuery && categoryFilter === 'all' && (
              <Button onClick={() => setIsCreateTeamOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Team Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-900">{team.name}</h3>
                      <Badge className={getCategoryColor(team.category)}>
                        {team.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {team.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingTeam(team);
                          setIsCreateTeamOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Team
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTeam(team);
                          setIsAddMemberOpen(true);
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Members
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTeam(team);
                          setIsManageMemberOpen(true);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Members
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTeam(team);
                          setIsDeleteTeamOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Team Stats */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-gray-600 text-sm">Members</div>
                    <div className="text-gray-900">{team.members.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Projects</div>
                    <div className="text-gray-900">{team.projectsCount}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-600 text-sm">Created</div>
                    <div className="text-gray-900 text-sm">
                      {new Date(team.createdDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="text-gray-700 text-sm mb-3">Team Members</div>
                  {team.members.length === 0 ? (
                    <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 text-sm mb-2">No members yet</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTeam(team);
                          setIsAddMemberOpen(true);
                        }}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Add Members
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {team.members.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-900 text-sm truncate">{member.name}</div>
                            <div className="text-gray-600 text-xs">{member.role}</div>
                          </div>
                          {getStatusBadge(member.status)}
                        </div>
                      ))}
                      {team.members.length > 3 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            setSelectedTeam(team);
                            setIsManageMemberOpen(true);
                          }}
                        >
                          +{team.members.length - 3} more members
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsAddMemberOpen(true);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Members
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsManageMemberOpen(true);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 text-sm">Team Name</th>
                    <th className="px-6 py-3 text-left text-gray-700 text-sm">Category</th>
                    <th className="px-6 py-3 text-left text-gray-700 text-sm">Members</th>
                    <th className="px-6 py-3 text-left text-gray-700 text-sm">Projects</th>
                    <th className="px-6 py-3 text-left text-gray-700 text-sm">Created</th>
                    <th className="px-6 py-3 text-left text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-gray-900">{team.name}</div>
                          <div className="text-gray-600 text-sm line-clamp-1">
                            {team.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getCategoryColor(team.category)}>
                          {team.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {team.members.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="text-xs">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {team.members.length > 3 && (
                            <span className="text-gray-600 text-sm">
                              +{team.members.length - 3}
                            </span>
                          )}
                          {team.members.length === 0 && (
                            <span className="text-gray-400 text-sm">No members</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{team.projectsCount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 text-sm">
                          {new Date(team.createdDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTeam(team);
                              setIsAddMemberOpen(true);
                            }}
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTeam(team);
                              setIsManageMemberOpen(true);
                            }}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingTeam(team);
                                  setIsCreateTeamOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Team
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTeam(team);
                                  setIsDeleteTeamOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => {
          setIsCreateTeamOpen(false);
          setEditingTeam(null);
        }}
        onSubmit={editingTeam ? handleEditTeam : handleCreateTeam}
        editingTeam={editingTeam}
        categories={categories}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => {
          setIsAddMemberOpen(false);
          setSelectedTeam(null);
        }}
        onSubmit={(members) => selectedTeam && handleAddMembers(selectedTeam.id, members)}
        team={selectedTeam}
        existingMembers={selectedTeam?.members || []}
      />

      {/* <ManageMemberModal
        isOpen={isManageMemberOpen}
        onClose={() => {
          setIsManageMemberOpen(false);
          setSelectedTeam(null);
        }}
        team={selectedTeam}
        onUpdateRole={(memberId, newRole) => 
          selectedTeam && handleUpdateMemberRole(selectedTeam.id, memberId, newRole)
        }
        onRemoveMember={(memberId) => 
          selectedTeam && handleRemoveMember(selectedTeam.id, memberId)
        }
      /> */}

      {/* <ConfirmationModal
        isOpen={isDeleteTeamOpen}
        onClose={() => {
          setIsDeleteTeamOpen(false);
          setSelectedTeam(null);
        }}
        onConfirm={handleDeleteTeam}
        title="Delete Team"
        description={`Are you sure you want to delete "${selectedTeam?.name}"? This action cannot be undone and will remove all team members from this team.`}
        confirmText="Delete Team"
        confirmVariant="destructive"
      /> */}
    </div>
  );
}