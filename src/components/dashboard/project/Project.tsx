import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/_button';
import { Plus} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/_tabs';
import DataTable from '../../sharedComponent/DataTable/DataTable';
import ProjectService from '../../../services/auth/ProjectService';
import { ProjectColumnHeader } from '../../../constant/Project';
import  { AdvancedFilters } from '../../sharedComponent/AdvancedFilter/AdvancedFilter';
import { AddProjectModal } from './AddProjectModal';
import { useDispatch, useSelector } from 'react-redux';
import type { Project, ProjectModalProps } from '../../../interfaces/components/Project';
import type { FilterState } from '../../sharedComponent/AdvancedFilter/FilterInterface';
import type { Action } from '../../sharedComponent/DataTable/DataTableInterfaces';
import { setActivateTab, setPaginationState } from '../../../slices/Dashboard';
import { Tab } from '../../../interfaces/App';
import { useNavigate, useParams } from 'react-router-dom';

function Project() {
  const projectService = new ProjectService();
  const { type } = useParams<string>();
  const navigate = useNavigate();
  const paginationState = useSelector((e: any) => e.dashboard.paginationState);
  const [filters, setFilters] = useState<FilterState>({ status: [], creator: [], dateRange: undefined });
  const FilterRef = useRef<{ handleFilterChange: (filterType: keyof FilterState, value: string) => void }>(null);
  const dispatch = useDispatch();
  const [action, setAction] = useState<Action>({
    edit: (listItem: Project) => { openEditProjectModal(listItem); },
    delete: () => { openEditProjectModal; },
    onPageChange: (type:string,page: any) => { onPageChange(type,page) },
    removeItem: (type:string,ids: number[] | null) => { ids !== null && removeItem(type,ids) },
    archiveItem: (type:string,id: number[] | null) => { if (id !== null) archiveItem(type,id) },
    activeItem: (type:string,id: number[] | null) => { if (id !== null) activeItem(type,id) },
    selectListItem: (id: number, event: boolean) => { selectListItem(id, event) },
    selectAllListItem: (event: boolean) => { selectAllListItem(event) },
    clearAllSelection: () => { clearAllSelection() },
    addUser: (users: number[], projectId: number, type: string, paginationState: any) => { addUser(users, projectId, type, paginationState) },
    openItem:(id:number)=>{openBoard(id)}
  });
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [columnHeader, setColumnHeader] = useState(ProjectColumnHeader);
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<ProjectModalProps>({ isOpen: false, isEdit: false, type:Tab.ACTIVE });
  const [activeTabKey, setActiveTabKey] = useState(type);
  const [totalItem, setTotalItem] = useState(0);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    getAllProject(type,paginationState.itemsPerPage,paginationState.currentOffset);
  }, [paginationState]);
  useEffect(() => {    
    dispatch(setActivateTab(type));
    setActiveTabKey(type);
    onPageChange(type || Tab.ACTIVE, paginationState)
  }, [type])
  const getAllProject = async function (type:string | undefined,itemsPerPage: number, currentOffset: number) {     
    const isActive = ((type == Tab.ACTIVE) ? 0 : 1);
    const project = await projectService.getAllProject(localStorage.getItem("token"), isActive, itemsPerPage, currentOffset);
    if (project.status && project.status == 200) {
      setProjects(project.data);
      setTotalItem(project.totalCount);
    }
  };

  const onPageChange = async function (type:string,page: any) {
    // setItemsPerPage(page.itemsPerPage);
    // setCurrentOffset(page.currentOffset);
    dispatch(setPaginationState({itemsPerPage:page.itemsPerPage, currentOffset:page.currentOffset,type:type}))
  }
  const removeItem = async function (type:string,ids: number[]) {
    const removedItem = await projectService.deleteProject(ids);
    if (removedItem.status && removedItem.status == 200) {
        onPageChange(type,paginationState)
    }
  }
  const archiveItem = async function (type:string,ids: number[]) {
    const archivedProject = await projectService.archiveProject({ projectIds: ids, archive: 1 });
    if (archivedProject.status && archivedProject.status == 200) {
      onPageChange(type,paginationState)
    }
  }
  const activeItem = async function (type:string,ids: number[]) {
    const archivedProject = await projectService.archiveProject({ projectIds: ids, archive: 0 });
    if (archivedProject.status && archivedProject.status == 200) {
      onPageChange(type, paginationState);
    }
  }
  const tabSelection = (value: any) => {
    dispatch(setPaginationState({itemsPerPage:5,currentOffset:0}))
    navigate("../project/"+value);
  };

  const addProject = async function (newProjectData: any,type:string) {
    let user: any = [];
    if (newProjectData.name) {
      if (!newProjectData.id) {
        const project = await projectService.createProject({
          name: newProjectData.name,
          isPublic: newProjectData.isPublic ? 1 : 0,
          users: newProjectData.users
        });
        if (project.status && project.status == 200) {
          setIsAddModalOpen({ isOpen: false, isEdit: false, type });
          onPageChange(type, paginationState);
        }
      } else {
        const project = await projectService.editProject({
          projectId: newProjectData.id,
          name: newProjectData.name,
          isPublic: newProjectData.isPublic ? 1 : 0,
          users: newProjectData.users
        });
        if (project.status && project.status == 200) {
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

  const openEditProjectModal = function (listItem: Project): void {
    setIsAddModalOpen({ isOpen: true, isEdit: true, project: listItem, type });
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
    const project = projects.find((p) => p.id === id);
    if (project) {
      project.isSelect = event;
      setProjects([...projects]);
    }
    setProjects((prevProjects) =>
      Object.entries(prevProjects).map((project) => {
        if (project[1].id == id)
        {
          project[1].isSelect = event;
        }
        return {
        ...project[1],
        }
    })
    );
    console.log(project);
  }
  const selectAllListItem = (event: boolean) => {
    setProjects((prevProjects) =>
      Object.entries(prevProjects).map((project) => ({
        ...project[1],
        isSelect: event,
      }))
    );    
  }
  const clearAllSelection = () => {
    setProjects((prevProjects) =>
      Object.entries(prevProjects).map((project) => ({
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
  const openBoard = (id: number) => {
    navigate("../board/"+id+"/"+Tab.ACTIVE)
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
          <h1 className="text-2xl font-semibold text-gray-900">Project</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, projects.length)} of {projects.length} projects
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddModalOpen({ isOpen: true, isEdit: false,type })}>
            <Plus className="w-4 h-4" />
            Add Project
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
          <DataTable type={type || Tab.ACTIVE} dataList={projects} columnHeader={columnHeader} totalItem={totalItem} action={action} />
        </TabsContent>
        <TabsContent value={Tab.ARCHIVE} className="space-y-4">
          <DataTable type={type || Tab.ARCHIVE} dataList={projects} columnHeader={columnHeader} totalItem={totalItem} action={action} />
        </TabsContent>
      </Tabs>

      <AddProjectModal
        open={isAddModalOpen.isOpen}
        isEdit={isAddModalOpen.isEdit}
        project={isAddModalOpen.project}
        type={isAddModalOpen.type || Tab.ACTIVE}
        onOpenChange={(open)=>{addProjectModalOpenClose(open)}}
        onAddProject={addProject}
        availableUsers={[]}
      />
    </div>
  );
}

export default Project;