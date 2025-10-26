import type { Tag } from "./Application";
import type { List } from "./List";
import type { User } from "./User";

export interface Board{
    id:number,
    name: string,
    description: string,
    user: User[],
    list:List[],
    isActive: boolean,
    isArchived: boolean,
    createdAt: string,
    totalMemoryForFileUpload: number,
    totalUsedMemory:number
    status?: string,
    isSelect?: boolean,
    tag?:Array<any>
}
export interface BoardAddUser {
  user_id: number,
  role: number
}
export interface NewBoardData {
  id?:number,
  name: string;
  description: string;
  users: BoardAddUser[];
  status?: 'active' | 'archived' | 'blocked';
  tags?: Tag[]
}
export interface BoardModalProps {
  isOpen: boolean,
  isEdit: boolean,
  board?: Board
  type?:string
}
export interface AddBoardModalProps {
  open: boolean;
  isEdit: boolean,
  board?: Board,
  type:string,
  availableUsers?:User[]
  onOpenChange: (open: BoardModalProps) => void;
  onAddBoard: (boardData: NewBoardData,type:string) => void;
}