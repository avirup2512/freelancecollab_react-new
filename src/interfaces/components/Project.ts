import type { Tab } from "../App";
import type { User } from "./User";

export interface ProjectAddUser {
  user_id: number,
  role: number
}
export interface Project{
    id:number,
    name: string,
    description: string,
    user: User[],
    isActive: boolean,
    isArchived: boolean,
    createdAt: string,
    totalMemoryForFileUpload: number,
    totalUsedMemory:number
    status?: string,
    isSelect?:boolean
}
export interface NewProjectData {
  id?:number,
  name: string;
  description: string;
  users: ProjectAddUser[];
  status?: 'active' | 'archived' | 'blocked';
}

export interface AddProjectModalProps {
  open: boolean;
  isEdit: boolean,
  project?: Project,
  type:string,
  availableUsers?:User[]
  onOpenChange: (open: ProjectModalProps) => void;
  onAddProject: (boardData: NewProjectData,type:string) => void;
}

export interface ProjectModalProps {
  isOpen: boolean,
  isEdit: boolean,
  project?: Project
  type?:string
}
