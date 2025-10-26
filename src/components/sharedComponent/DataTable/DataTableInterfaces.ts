import type { Tab } from "../../../interfaces/App"

export interface ColumnHeaderItem{
    name: string,
    isCheckBox: boolean,
    isSortable:boolean
}
export interface Action{
    edit: Function,
    delete:Function
    onPageChange:Function
    open?: Function,
    removeItem: (type:string,ids:number[] | null)=> void
    archiveItem: (type:string,ids: number[] | null) => void
    activeItem: (type:string,ids: number[] | null) => void
    selectListItem: (id: number, event: boolean) => void
    selectAllListItem: (event: boolean) => void
    clearAllSelection: () => void,
    addUser?: (ids: number[], id: number, type: string, paginationState: any) => void,
    openItem?:(id:number)=> void
}