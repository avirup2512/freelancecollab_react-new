import type { ColumnHeaderItem } from "../components/sharedComponent/DataTable/DataTableInterfaces"
export const ProjectColumnHeader: ColumnHeaderItem[] = [
    { name: "All Select", isCheckBox: true, isSortable: false },
    { name: "Name", isCheckBox: false, isSortable: false },
    { name: "Assignee", isCheckBox: false, isSortable: false },
    { name: "Status", isCheckBox: false, isSortable: false },
    { name: "File Status", isCheckBox: false, isSortable: false },
    { name: "Created At", isCheckBox: false, isSortable: true },
    { name: "Action", isCheckBox:false, isSortable:false},
]
export const Months = [{ short: "Jan", full: "January" },
  { short: "Feb", full: "February" },
  { short: "Mar", full: "March" },
  { short: "Apr", full: "April" },
  { short: "May", full: "May" },
  { short: "Jun", full: "June" },
  { short: "Jul", full: "July" },
  { short: "Aug", full: "August" },
  { short: "Sep", full: "September" },
  { short: "Oct", full: "October" },
  { short: "Nov", full: "November" },
  { short: "Dec", full: "December" }]