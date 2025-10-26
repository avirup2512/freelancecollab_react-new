export interface Priority{
  id: number,
  value:string
}
export interface CardUser {
 id:number,
 name:string,
 role:number,
 role_name:string,
 email:string,
 creator:boolean
}

export interface Card {
  id: number;
  name: string;
  listId:number,
  description?: string;
  priority: number;
  users?: CardUser[];
  dueDate?: string;
  reminderDate?:string;
  complete?:number;
  isFixed?:number;
  position?:number;
  tags?: Tag[];
  checkList?:Array<any>;
  comments?:Array<any>;
}

export interface Tag {
  id: string;
  label: string;
  color: string;
}