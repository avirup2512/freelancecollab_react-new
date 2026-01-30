import config from "../../config";
let ProjectService:any = (function ()
{
    let baseUrl = config.baseUrl;
    function ProjectService()
    {
        
    }
    ProjectService.prototype.getAllProject = async function (token:any,isActive:number,itemLimit:any,offset:any)
    {
        const activeText = !isActive?"active":"archive";
        const res = await fetch(baseUrl+'project/'+activeText+'/'+itemLimit+'/'+offset+'',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+token
        },
        });
        return res.json();
    }
    ProjectService.prototype.createProject = async function (params:any)
    {
        const res = await fetch(baseUrl+'project',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    ProjectService.prototype.editProject = async function (params:any)
    {
        const res = await fetch(baseUrl+'project/'+params.projectId,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    ProjectService.prototype.searchUser = async function (keyword:any)
    {
        const res = await fetch(baseUrl+'auth/search',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify({keyword}),
        });
        return res.json();
    }
    ProjectService.prototype.getAllRoles = async function ()
    {
        const res = await fetch(baseUrl+'setting/getRoles',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        });
        return res.json();
    }
    ProjectService.prototype.deleteProject = async function (id:Array<number>)
    {
        const res = await fetch(baseUrl+'project/delete',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
            },
            body: JSON.stringify({projectId:id})
        });
        return res.json();
    }
    ProjectService.prototype.searchBoardUser = async function (keyword:any,boardId:any)
    {
        const res = await fetch(baseUrl+'auth/searchByBoardId',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify({keyword,boardId}),
        });
        return res.json();
    }
    ProjectService.prototype.searchUser = async function (keyword:any)
    {
        const res = await fetch(baseUrl+'auth/search',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify({keyword}),
        });
        return res.json();
    }
    ProjectService.prototype.archiveProject = async function (params:any) {
    console.log(params);

    const res = await fetch(baseUrl + "project/archive", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
    };
    ProjectService.prototype.addUser = async function (params:any) {
    const res = await fetch(baseUrl + "project/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
    };
    return ProjectService;
})()

export default ProjectService;