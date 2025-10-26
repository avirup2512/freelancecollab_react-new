import { Checkbox } from '../../ui/_checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/_table';
import { Edit, Trash2, ArrowUpDown, Plus, ArchiveIcon, ArchiveRestore } from 'lucide-react';
import { StatusBadge } from '../../sharedComponent/StatusBadge';
import { ProgressBar } from '../../sharedComponent/ProgressBar';
import { Button } from '../../ui/_button';
import { useEffect, useState } from 'react';
import PaginationComponent from '../Pagination/Pagination';
import type { Action, ColumnHeaderItem } from './DataTableInterfaces';
import { Months } from '../../../constant/Project';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/_tooltip';
import { ActiveConfirmationModal, ArchiveConfirmationModal, DeleteConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { BulkActionToolbar } from '../BulkActionToolbar/BulkActionToolbar';
import { UserAddModal } from '../UserAddModal/UserAddModal';
import UserListCircleIcon from '../UserListCircleIcon/UserListCircleIcon';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
function DataTable({dataList,columnHeader,totalItem,action, type}:{dataList:any,columnHeader:ColumnHeaderItem[],totalItem:number,action:Action, type:string}) {
  const paginationState = useSelector((e: any) => e.dashboard.paginationState);
  const [editedDataList, setEditedDataList] = useState([]);
  useEffect(() => {    
    setSelectedItem(getSelectionSize());    
    if (dataList)
    {
      for (var x in dataList)
      {
        if(dataList[x].user && !Array.isArray(dataList[x].user))
        {
            const user:any[] = Object.entries(dataList[x].user).map((e) => (e[1]));
            dataList[x].user = user;
        }
        }
      setEditedDataList(dataList)
    }
  }, [dataList]);
  const [selectedItem, setSelectedItem] = useState<Array<number>>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number[] | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });
  const [archiveModal, setArchiveModal] = useState<{ isOpen: boolean; id: number[] | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });
  const [activeModal, setActiveModal] = useState<{ isOpen: boolean; id: number[] | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });
  const [userAddModal, setUserAddModal] = useState<{ isOpen: boolean; id: number | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });
  const formatDate = function(isoString:any) {
      const date = new Date(isoString);
      // Day with suffix (1st, 2nd, 3rd, 4th...)
      const day = date.getDate();
      const daySuffix = (d => {
        if (d > 3 && d < 21) return "th";
        switch (d % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      })(day);
      const month = Months[date.getMonth()].short;
      const year = date.getFullYear();
      // Time in 12-hour format
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${day}${daySuffix} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  }
  const onPageChange = (page: any) => {
    action.onPageChange(type,page);
  }
  const handleDeleteListItem = (id: number[], name: string) => {
    setDeleteModal({ isOpen: true, id, name });
  };
  const handleArchiveListItem = (id: number[], name: string) => {
    setArchiveModal({ isOpen: true, id, name });
  };
  const handleActiveListItem = (id: number[], name: string) => {
    setActiveModal({ isOpen: true, id, name });
  };
  const getSelectionSize = (): Array<number> => {
    const idsArray:Array<number> = []
    Object.entries(dataList).forEach((e: any) => {
      if (e[1].isSelect)
        idsArray.push(e[1].id)
    });    
    return idsArray
  }
  const handleAddUsersToBoard = (user: Array<any>) => {    
    if(action.hasOwnProperty("addUser") && action.addUser && userAddModal.id )
    {
      action.addUser(user,userAddModal.id,type,paginationState);
    }
  }
  const handleOpenUserAddModal = (id: number, name: string) => {
    setUserAddModal({ isOpen: true, id, name });
  };
  const checkAllisSelected = (): boolean => {
    if (!dataList)
      return false;
    let isSelect = true;
    Object.entries(dataList).forEach((e:any) => {
    if (!e[1].isSelect)
      isSelect = false
    })
    return isSelect;
  }
  return (
      <>
      <BulkActionToolbar
        selectedCount={selectedItem.length}
        onActivate={() => handleActiveListItem(selectedItem, "")}
        onArchive={() => handleArchiveListItem(selectedItem,"")}
        onRemove={() => handleDeleteListItem(selectedItem,"")}
        onClearSelection={action.clearAllSelection}
      />
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow key={"item.name"} className="bg-gray-50">
            {
                columnHeader && columnHeader.length > 0 && columnHeader.map((item: ColumnHeaderItem, _index: number) => {
                    // For Checkbox header
                    if (item.isCheckBox) {
                        return (
                            <TableHead key={item.name} className="w-12">
                                <Checkbox checked={checkAllisSelected()} onCheckedChange={(e:boolean)=>{action.selectAllListItem(e)}}/>
                            </TableHead>
                        );
                    }
                    // For sortable header
                    if (item.isSortable) {
                        return (
                            <TableHead key={item.name} className="font-medium">
                                <Button variant="ghost" className="gap-1 p-0 h-auto">
                                    {item.name}
                                    <ArrowUpDown className="w-4 h-4" />
                                </Button>
                            </TableHead>
                        );
                    }
                    // For normal header
                    return (
                        <TableHead key={item.name} className="font-medium">
                            {item.name}
                        </TableHead>
                    );
                })
            }
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(editedDataList).length > 0 && Object.entries(editedDataList).map((listItem:any) => (
              <TableRow key={listItem[1].id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox checked={listItem[1].isSelect} onCheckedChange={(e:boolean)=> { action.selectListItem(listItem[1]?.id,e)}} />
                </TableCell>
                <TableCell className="font-medium cursor-pointer" onClick={()=>{action.openItem ? action.openItem(listItem[1]?.id) : ()=>{}}}>{listItem[1].name}</TableCell>

                <TableCell>
                  {/* USER THLU */}
                  <UserListCircleIcon id={listItem[1].id} name={listItem[1].name} users={listItem[1].user || []} handleOpenUserAddModal={handleOpenUserAddModal}/>
                </TableCell>
                <TableCell>
                  <StatusBadge status={listItem[1]?.is_archived == 0 ? "active": "archived"} />
                </TableCell>
                <TableCell>
                  <ProgressBar 
                    value={Math.ceil(listItem[1].totalUsedMemory)} 
                    total={listItem[1].totalMemory} 
                  />
                </TableCell>
                <TableCell className="text-sm text-gray-600 whitespace-pre">
                  {formatDate(listItem[1]?.created_date)}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      {
                        listItem[1].is_archived == 0 && 
                        <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={()=>{action.edit(listItem[1])}} size="sm" variant="ghost" className="w-8 h-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-sm">Edit project</p>
                        </TooltipContent>
                      </Tooltip>
                      }
                      {
                        listItem[1].is_archived == 1 && 
                        <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => handleActiveListItem(listItem[1].id, listItem[1].name)} size="sm" variant="ghost" className="w-8 h-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                            <ArchiveRestore className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-sm">Restore project</p>
                        </TooltipContent>
                      </Tooltip>
                      }
                      {
                        listItem[1].is_archived == 0 &&
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="w-8 h-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                              onClick={() => handleArchiveListItem(listItem[1].id, listItem[1].name)}
                            >
                              <ArchiveIcon className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="text-sm">Archive board</p>
                          </TooltipContent>
                        </Tooltip>
                      }
                      
                      { listItem[1].is_archived == 1 &&
                        <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="w-8 h-8 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeleteListItem(listItem[1].id, listItem[1].name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-sm">Delete board</p>
                        </TooltipContent>
                        </Tooltip>
                      }
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
          <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
            onConfirm={() => {deleteModal.id !== null && action.removeItem(type,deleteModal.id)}}
            itemName={deleteModal.name}
          />

          <ArchiveConfirmationModal
            isOpen={archiveModal.isOpen}
            onClose={() => setArchiveModal({ isOpen: false, id: null, name: '' })}
            onConfirm={() => archiveModal.id !== null && action.archiveItem(type,archiveModal.id)}
            itemName={archiveModal.name}
          />
          <ActiveConfirmationModal
            isOpen={activeModal.isOpen}
            onClose={() => setActiveModal({ isOpen: false, id: null, name: '' })}
            onConfirm={() => activeModal.id !== null && action.activeItem(type,activeModal.id)}
            itemName={archiveModal.name}
          />
          </div>
        <PaginationComponent totalItem={totalItem} onPageChange={onPageChange}></PaginationComponent>
        <UserAddModal
            open={userAddModal.isOpen}
            onOpenChange={(open) => {
              if (!open) {
                setUserAddModal({ isOpen: false, id: null, name: '' });
              }
            }}
            onAddUsers={handleAddUsersToBoard}
            name={userAddModal.name}
            existingAssignees={userAddModal.id ? editedDataList[userAddModal.id]?.user:[]}
          />
        </>
    );
}

export default DataTable;