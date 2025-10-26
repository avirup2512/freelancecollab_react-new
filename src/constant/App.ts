import type { Priority } from "../interfaces/components/Card"

export const APP_ROLE = {
    1: { id:1 ,name: "Basic", value: "ROLE_BASIC" },
    2: { id:2 ,name: "Admin", value: "ROLE_ADMIN" },
    3: { id:3 ,name:"Super Admin", value:"ROLE_SUPER_ADMIN"}
}

export const PriorityList : Priority[] = [
    { id: 1, value: "Urgent" },
    { id: 2, value: "High" },
    { id: 3, value: "Medium" },
    { id: 4, value: "Low" }
]