export interface User{
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    role: number,
    role_id?:number,
    password?: string,
    isSocialMediaLogin?:boolean,
    avatar?:string,
    name?: string,
    creator?:boolean
}