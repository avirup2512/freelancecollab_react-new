import config from "../../config";
const TaskService:any = (function () {
  let baseUrl = config.baseUrl;
  function task() {}
  task.prototype.create = async function (token:any,params:any) {
    const res = await fetch(baseUrl + "task/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+token
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  task.prototype.getList = async function (token:any) {
    const res = await fetch(baseUrl + "task/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+token
      }
    });
    return res.json();
  };
  task.prototype.deleteTask = async function (token:any,taskId:number) {
    const res = await fetch(baseUrl + "task/"+taskId+"", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+token
      }
    });
    return res.json();
  };

    task.prototype.addUserEntry = async function (token:any,params:any) {
    const res = await fetch(baseUrl + "userTaskEntry/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+token
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  task.prototype.getTaskGridByTaskId = async function (token:any,taskId:any) {
    const res = await fetch(baseUrl + "taskGrid/task/"+taskId+"", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+token
      },
    });
    return res.json();
  };
  return task;
})();
export default TaskService;
