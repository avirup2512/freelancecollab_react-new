import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/_button';
import { Plus} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/_tabs';
import DataTable from '../../sharedComponent/DataTable/DataTable';
import  { AdvancedFilters } from '../../sharedComponent/AdvancedFilter/AdvancedFilter';
import { AddBoardModal } from './AddBoardModal';
import { useDispatch, useSelector } from 'react-redux';
import type { Project, ProjectModalProps } from '../../../interfaces/components/Project';
import type { FilterState } from '../../sharedComponent/AdvancedFilter/FilterInterface';
import type { Action } from '../../sharedComponent/DataTable/DataTableInterfaces';
import { setActivateTab, setPaginationState } from '../../../slices/Dashboard';
import { Tab } from '../../../interfaces/App';
import { useNavigate, useParams } from 'react-router-dom';
import BoardService from '../../../services/auth/BoardService';
import type { Board, BoardModalProps } from '../../../interfaces/components/Board';
import { BoardColumnHeader } from '../../../constant/Board';

function Board() {
  const boardService = new BoardService();
  const { type,projectId } = useParams<string>();
  const navigate = useNavigate();
  const paginationState = useSelector((e: any) => e.dashboard.paginationState);
  const [filters, setFilters] = useState<FilterState>({ status: [], creator: [], dateRange: undefined });
  const FilterRef = useRef<{ handleFilterChange: (filterType: keyof FilterState, value: string) => void }>(null);
  const dispatch = useDispatch();
  const [action, setAction] = useState<Action>({
    edit: (listItem: Board) => { openEditBoardModal(listItem); },
    delete: () => { openEditBoardModal; },
    onPageChange: (type:string,page: any) => { onPageChange(type,page) },
    removeItem: (type:string,ids: number[] | null) => { ids !== null && removeItem(type,ids) },
    archiveItem: (type:string,id: number[] | null) => { if (id !== null) archiveItem(type,id) },
    activeItem: (type:string,id: number[] | null) => { if (id !== null) activeItem(type,id) },
    selectListItem: (id: number, event: boolean) => { selectListItem(id, event) },
    selectAllListItem: (event: boolean) => { selectAllListItem(event) },
    clearAllSelection: () => { clearAllSelection() },
    addUser: (users: number[], boardId: number, type: string, paginationState: any) => { addUser(users, boardId, type, paginationState) },
    openItem:(id:number)=>{openList(id)}
  });
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [columnHeader, setColumnHeader] = useState(BoardColumnHeader);
  const [currentPage, setCurrentPage] = useState(1);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<BoardModalProps>({ isOpen: false, isEdit: false, type:Tab.ACTIVE });
  const [activeTabKey, setActiveTabKey] = useState(type);
  const [totalItem, setTotalItem] = useState(0);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    getAllBoard(type,paginationState.itemsPerPage,paginationState.currentOffset);
  }, [paginationState]);
  useEffect(() => {    
    dispatch(setActivateTab(type));
    setActiveTabKey(type);
    onPageChange(type || Tab.ACTIVE, paginationState)
  }, [type])
  const getAllBoard = async function (type:string | undefined,itemsPerPage: number, currentOffset: number) {     
    const isActive = ((type == Tab.ACTIVE) ? 0 : 1);
    const board = await boardService.getAllBoards(localStorage.getItem("token"),projectId, isActive, itemsPerPage, currentOffset);
    if (board.status && board.status == 200) {
      setBoards(board.boards);
      setTotalItem(board.count);
    }
  };

  const onPageChange = async function (type:string,page: any) {
    // setItemsPerPage(page.itemsPerPage);
    // setCurrentOffset(page.currentOffset);
    dispatch(setPaginationState({itemsPerPage:page.itemsPerPage, currentOffset:page.currentOffset,type:type}))
  }
  const removeItem = async function (type:string,ids: number[]) {
    const removedItem = await boardService.deleteProject(ids);
    if (removedItem.status && removedItem.status == 200) {
        onPageChange(type,paginationState)
    }
  }
  const archiveItem = async function (type:string,ids: number[]) {
    const archivedProject = await boardService.archiveProject({ projectId: ids, archive: 1 });
    if (archivedProject.status && archivedProject.status == 200) {
      onPageChange(type,paginationState)
    }
  }
  const activeItem = async function (type:string,ids: number[]) {
    const archivedProject = await boardService.archiveProject({ projectId: ids, archive: 0 });
    if (archivedProject.status && archivedProject.status == 200) {
      onPageChange(type, paginationState);
    }
  }
  const tabSelection = (value: any) => {
    dispatch(setPaginationState({itemsPerPage:5,currentOffset:0}))
    navigate("../board/"+projectId+"/"+value);
  };

  const addBoard = async function (newBoardData: any, type: string) {
    console.log(newBoardData);
    
    if (newBoardData.name) {
      if (!newBoardData.id) {
        const board = await boardService.createBoard({
          projectId:projectId,
          name: newBoardData.name,
          isPublic: newBoardData.isPublic ? 1 : 0,
          users: newBoardData.users,
          tags:newBoardData.tags
        });
        if (board.status && board.status == 200) {
          setIsAddModalOpen({ isOpen: false, isEdit: false, type });
          onPageChange(type, paginationState);
        }
      } else {
        const board = await boardService.editBoard({
          projectId:projectId,
          boardId: newBoardData.id,
          name: newBoardData.name,
          isPublic: newBoardData.isPublic ? 1 : 0,
          users: newBoardData.users,
          tags:newBoardData.tags
        });
        if (board.status && board.status == 200) {
          setIsAddModalOpen({ isOpen: false, isEdit: false });
          onPageChange(type || Tab.ACTIVE, paginationState);
        } else {
          setIsAddModalOpen({ isOpen: false, isEdit: false });
          onPageChange(type,paginationState);
        }
      }
    }
  };

  const clearAllFilters = () => {
    setFilters({ status: [], creator: [], dateRange: undefined });
    setCurrentPage(1);
  };

  const openEditBoardModal = function (listItem: Board): void {
    console.log(listItem);
    
    setIsAddModalOpen({ isOpen: true, isEdit: true, board: { ...listItem}, type });
  };

  const getActiveFilterCount = () => {
    const dateRangeCount = (filters.dateRange?.from || filters.dateRange?.to) ? 1 : 0;
    return filters.status.length + filters.creator.length + dateRangeCount;
  };
  const addProjectModalOpenClose = (open: ProjectModalProps) => {
    setIsAddModalOpen(open);
    if (!open.isOpen) {
      onPageChange(Tab.ACTIVE,paginationState);
    }
  }
  const selectListItem = (id: number, event: boolean) => {
    const board = boards.find((p) => p.id === id);
    if (board) {
      board.isSelect = event;
      setBoards([...boards]);
    }
    setBoards((prevProjects) =>
      Object.entries(prevProjects).map((board) => {
        if (board[1].id == id)
        {
          board[1].isSelect = event;
        }
        return {
        ...board[1],
        }
    })
    );
    console.log(board);
  }
  const selectAllListItem = (event: boolean) => {
    setBoards((prevBoard) =>
      Object.entries(prevBoard).map((project) => ({
        ...project[1],
        isSelect: event,
      }))
    );    
  }
  const clearAllSelection = () => {
    setBoards((prevBoard) =>
      Object.entries(prevBoard).map((project) => ({
        ...project[1],
        isSelect: false,
      }))
    );
  }
  const addUser = async (userIds:number[], projectId:number,type:string,pagination:any) => {
    const project = await projectService.addUser({
          projectId:projectId,
          users: userIds
    });    
    if (project.status && project.status == 200) {
      // setIsAddModalOpen({ isOpen: false, isEdit: false });
      onPageChange(type,pagination);
    } else {
      // setIsAddModalOpen({ isOpen: false, isEdit: false });
      onPageChange(type,pagination);
    }
  }
  const openList = (id:number) => {
    navigate("../list/"+projectId+"/"+id+"/"+Tab.ACTIVE)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Project</span>
            <span>/</span>
            <span>Board</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Board</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, boards.length)} of {boards.length} projects
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddModalOpen({ isOpen: true, isEdit: false,type })}>
            <Plus className="w-4 h-4" />
            Add Board
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      <AdvancedFilters
        onFiltersChange={()=>{}}
        availableUsers={[]}
        availableTags={[]}
        totalResults={0}
      />
      {/* <div className="flex gap-2 mb-4">
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          4 Active
        </Button>
        <Button size="sm" variant="destructive">
          2 Duplicate
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Archive
        </Button>
      </div> */}

      <Tabs onValueChange={(value: any) => { tabSelection(value); }} defaultValue={activeTabKey} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value={Tab.ACTIVE}>
            {activeTabKey == Tab.ACTIVE && totalItem} Active
          </TabsTrigger>
          <TabsTrigger value={Tab.ARCHIVE}>
            {activeTabKey !== Tab.ACTIVE && totalItem} Archive
          </TabsTrigger>
        </TabsList>
        <TabsContent value={Tab.ACTIVE} className="space-y-4">
          <DataTable type={type || Tab.ACTIVE} dataList={boards} columnHeader={columnHeader} totalItem={totalItem} action={action} />
        </TabsContent>
        <TabsContent value={Tab.ARCHIVE} className="space-y-4">
          <DataTable type={type || Tab.ARCHIVE} dataList={boards} columnHeader={columnHeader} totalItem={totalItem} action={action} />
        </TabsContent>
      </Tabs>

      <AddBoardModal
        open={isAddModalOpen.isOpen}
        isEdit={isAddModalOpen.isEdit}
        board={isAddModalOpen.board}
        type={isAddModalOpen.type || Tab.ACTIVE}
        onOpenChange={(open)=>{addProjectModalOpenClose(open)}}
        onAddBoard={addBoard}
        availableUsers={[]}
      />
    </div>
  );
}

export default Board;