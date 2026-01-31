import config from "../../config";
let ListService:any = (function () {
  let baseUrl = config.baseUrl;
  function ListService() {}
  ListService.prototype.getAllList = async function (boardId:number, isArchive:number, filterType:string) {
    const res = await fetch(
      baseUrl + "list/getAllList/" + boardId + "/" + isArchive + "/" + (filterType ? filterType : "allCards"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return res.json();
  };
  ListService.prototype.createList = async function (params:any) {
    const res = await fetch(baseUrl + "list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.editList = async function (params:any) {
    const res = await fetch(baseUrl + "list/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.updateListPosition = async function (params:any) {
    const res = await fetch(baseUrl + "list/updatePosition", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.updateCardPosition = async function (params:any) {
    const res = await fetch(baseUrl + "list/updateCardList", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.updateCardPositionSameList = async function (params:any) {
    const res = await fetch(baseUrl + "list/updateCardSameList", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.updateCardPositionBetweenLists = async function (
    params
  ) {
    const res = await fetch(baseUrl + "list/updateCardPosition", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.updateCardPositionSameList = async function (params:any) {
    const res = await fetch(baseUrl + "list/updateCardSameList", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.updateNextAllCardPosition = async function (params:any) {
    const res = await fetch(baseUrl + "list/updateCardPosition", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.archiveList = async function (params:any) {
    const res = await fetch(baseUrl + "list/archived", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.deleteList = async function (params:any) {
    const res = await fetch(baseUrl + "list/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.setListFix = async function (params:any) {
    const res = await fetch(baseUrl + "list/setlistfix", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.setListColor = async function (params:any) {
    const res = await fetch(baseUrl + "list/setcolor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.addListGroup = async function (params:any) {
    const res = await fetch(baseUrl + "list/addListGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  ListService.prototype.getListGroup = async function (params:any) {
    const res = await fetch(baseUrl + "list/getlistgroup", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  return ListService;
})();

export default ListService;
