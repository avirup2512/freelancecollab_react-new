import config from "../../config";
let BoardService:any = (function () {
  let baseUrl = config.baseUrl;
  function BoardService() {}
  BoardService.prototype.getAllBoards = async function (token:any,projectId:any,isActive:any,itemLimit:any,offset:any) {
    const res = await fetch(
      baseUrl +
        "board/getAllBoard/" +
        projectId +
        "/" +
        isActive +
        "/" +
        itemLimit +
        "/" +
        offset +
        "",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      }
    );
    return res.json();
  };
  BoardService.prototype.createBoard = async function (params:any) {
    const res = await fetch(baseUrl + "board/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  BoardService.prototype.editBoard = async function (params:any) {
    const res = await fetch(baseUrl + "board/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  BoardService.prototype.searchUser = async function (keyword:any, projectId:any) {
    const res = await fetch(baseUrl + "auth/searchByProjectId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ keyword, projectId }),
    });
    return res.json();
  };
  BoardService.prototype.getAllRoles = async function () {
    const res = await fetch(baseUrl + "setting/getRoles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return res.json();
  };
  BoardService.prototype.deleteBoard = async function (id:any) {
    const res = await fetch(baseUrl + "board/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ boardId: id }),
    });
    return res.json();
  };
  BoardService.prototype.searchBoardUser = async function (keyword:any, boardId:any) {
    const res = await fetch(baseUrl + "auth/searchByBoardId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ keyword, boardId }),
    });
    return res.json();
  };
  BoardService.prototype.archivedBoard = async function (params:any) {
    console.log(params);

    const res = await fetch(baseUrl + "board/archivedBoard", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  BoardService.prototype.getAllTag = async function (boardId:any) {
    const res = await fetch(baseUrl + "board/getAllBoardTag/" + boardId + "", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return res.json();
  };
  BoardService.prototype.editBoardTag = async function (params:any) {
    const res = await fetch(baseUrl + "board/editBoardTag/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  BoardService.prototype.addBoardTag = async function (params:any) {
    const res = await fetch(baseUrl + "board/addBoardTag/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  BoardService.prototype.deleteBoardTag = async function (boardTagId:any, boardId:any) {
    const res = await fetch(
      baseUrl + "board/deleteBoardTag/" + boardTagId + "/" + boardId + "",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return res.json();
  };
  BoardService.prototype.searchBoardTag = async function (boardId:any,query:string) {
    const res = await fetch(baseUrl + "board/searchBoardTag/"+ query +"/" + boardId + "", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return res.json();
  };
  return BoardService;
})();

export default BoardService;
