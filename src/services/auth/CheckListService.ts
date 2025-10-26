import config from "../../config";
const CheckListService:any = (function () {
  let baseUrl = config.baseUrl;
  function checkList() {}
  checkList.prototype.create = async function (params:any) {
    const res = await fetch(baseUrl + "checklist/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  checkList.prototype.delete = async function (params:any) {
    const res = await fetch(baseUrl + "checklist/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  checkList.prototype.addUser = async function (params:any) {
    const res = await fetch(baseUrl + "checklist/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  checkList.prototype.removeUser = async function (params:any) {
    const res = await fetch(baseUrl + "checklist/removeUser", {
      method: "POST",
        headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
        body: JSON.stringify(params),
    });
    return res.json();
  }

  return checkList;
})();

export default CheckListService;
