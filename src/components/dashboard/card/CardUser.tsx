import { useEffect, useState } from 'react';
import { User2,UserIcon } from 'lucide-react';
import { Button } from '../../ui/_button';
import { toast } from 'sonner';
import { UserAddModal } from '../../sharedComponent/UserAddModal/UserAddModal';
import type { User } from '../../../interfaces/components/User';
import UserListCircleIcon from '../../sharedComponent/UserListCircleIcon/UserListCircleIcon';


function CardUser({
  assignees,
  onAssigneesChange,
}: {assignees:any[],onAssigneesChange:Function}) {
    const [userAddModal, setUserAddModal] = useState<{ isOpen: boolean; id: number | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });

  const handleAddUser = (users:User[]) => {
    console.log(users);
    onAssigneesChange(users);
    // toast.success(`${newUserName} has been assigned`);
  };


  return (
    <>
        {/* Assignees */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <User2 className="h-3 w-3" />
            Assignees ({assignees.length})
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {assignees.length > 0 ? (
              <>
                <UserListCircleIcon showPlusButton={false} id={0} name={""} users={assignees || []} handleOpenUserAddModal={()=>{}}/>
                {/* {assignees.map((assignee:any) => (
                  <div
                    key={assignee.id}
                    className="group relative"
                  >

                    <Avatar className="h-8 w-8 border-2 border-white cursor-pointer hover:border-primary transition-colors">
                      <AvatarFallback className="text-xs">{assignee.name ? assignee.name[0] : assignee.first_name ? assignee.first_name[0]:""}</AvatarFallback>
                    </Avatar>
                    {
                      !assignee.creator &&
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleUnassignUser(assignee.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    }
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {assignee.name}
                      {assignee.email && (
                        <div className="text-gray-300">{assignee.email}</div>
                      )}
                    </div>
                  </div>
                ))} */}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">No assignees yet</span>
            )}
            <Button onClick={()=>{console.log(assignees);
             setUserAddModal({ isOpen: true, id: null, name: '' });}} size="sm" className="shrink-0">
              <UserIcon className="h-4 w-4" /> Manage User and Role
            </Button>
            <UserAddModal
            open={userAddModal.isOpen}
            onOpenChange={(open) => {
              if (!open) {
                setUserAddModal({ isOpen: false, id: null, name: '' });
              }
            }}
            onAddUsers={handleAddUser}
            name={userAddModal.name}
            existingAssignees={assignees} />
          </div>
        </div>
    </>
  );
}
export default CardUser;
