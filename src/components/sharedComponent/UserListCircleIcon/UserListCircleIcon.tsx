import { UserTooltip } from "../UserToolTip/UserTooltip"
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/_tooltip';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/_button';
import { useEffect, useState } from "react";

const UserListCircleIcon = function ({ users, handleOpenUserAddModal, name,id,showPlusButton = true}: { users: any,name?:string, id?:number, handleOpenUserAddModal: Function,showPlusButton?:boolean }) {
    const [editedUser, setEditedUser] = useState<Array<any>>([]);
    useEffect(() => {
        console.log(users);
        
        if (users && users.length > 4)
        {
            const firstUser = users.slice(0, 4);
            const restUser = users.slice(4, users.length);
            setEditedUser([...firstUser,{first_name:"+"+restUser.length, count:restUser.length,users:restUser}])
        } else {
            setEditedUser([...users])
        }
    },[users])
    return (
         <div className="flex items-center -space-x-2">
                    {editedUser && editedUser.length > 0 && editedUser.map((assignee:any, index:number) => (
                      <div key={index} className="relative">
                        {assignee.first_name.startsWith('+') ? (
                          <UserTooltip
                            users={'users' in assignee ? assignee.users : []}
                            isGroupTooltip={true}
                            groupLabel="Additional Team Members"
                            side="top"
                          >
                            <div className="w-8 h-8 bg-blue-100 border-2 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                              <span className="text-xs font-medium text-blue-700">
                                {assignee.first_name}
                              </span>
                            </div>
                          </UserTooltip>
                        ) : (
                          <UserTooltip
                            user={assignee}
                            side="top"
                          >
                            <div className="cursor-pointer">
                              <Avatar className="w-8 h-8 border-2 border-white hover:border-blue-200 transition-colors">
                                <AvatarImage src={assignee.avatar} />
                                <AvatarFallback className="text-xs">
                                  {assignee.first_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </UserTooltip>
                        )}
                      </div>
                    ))}
                    {showPlusButton && <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-8 h-8 rounded-full p-0 ml-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                            onClick={() => handleOpenUserAddModal(id,name)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-sm">Add team member</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>}
                  </div>
    )
}
export default UserListCircleIcon;