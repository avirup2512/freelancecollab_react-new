import type { ColumnHeaderItem } from "../components/sharedComponent/DataTable/DataTableInterfaces"

export const BoardColumnHeader: ColumnHeaderItem[] = [
    { name: "All Select", isCheckBox: true, isSortable: false },
    { name: "Name", isCheckBox: false, isSortable: false },
    { name: "Assignee", isCheckBox: false, isSortable: false },
    { name: "Status", isCheckBox: false, isSortable: false },
    { name: "Card Status", isCheckBox: false, isSortable: false },
    { name: "Created At", isCheckBox: false, isSortable: true },
    { name: "Action", isCheckBox:false, isSortable:false},
]