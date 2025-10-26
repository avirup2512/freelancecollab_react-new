import config from "../../config";
let CardService:any = (function () {
  let baseUrl = config.baseUrl;
  function CardService() {}
  CardService.prototype.getAllCard = async function (listId:number, boardId:number) {
    const res = await fetch(
      baseUrl + "card/getAllCard/" + listId + "/" + boardId,
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
  CardService.prototype.createCard = async function (params:any) {
    const res = await fetch(baseUrl + "card/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.setStatus = async function (params:any) {
    const res = await fetch(baseUrl + "card/setStatus", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.editCard = async function (params:any) {
    const res = await fetch(baseUrl + "card/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.deleteCard = async function (params:any) {
    const res = await fetch(baseUrl + "card/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.getCardById = async function (boardId:number, cardId:number) {
    const res = await fetch(
      baseUrl + "card/getCardById/" + boardId + "/" + cardId + "",
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
  CardService.prototype.addUsers = async function (params:any) {
    const res = await fetch(baseUrl + "card/addUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.addTag = async function (params:any) {
    const res = await fetch(baseUrl + "card/addTag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.deleteTag = async function (params:any) {
    const res = await fetch(baseUrl + "card/deleteTag", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.getTagBySearchKey = async function (params:any) {
    const res = await fetch(
      baseUrl + "card/getTag/" + params.key + "/" + params.boardId + "",
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
  CardService.prototype.addCheckListItem = async function (params:any) {
    const res = await fetch(baseUrl + "card/addCheckList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.editCheckListItem = async function (params:any) {
    const res = await fetch(baseUrl + "card/editCheckList", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.deleteCheckListItem = async function (params:any) {
    const res = await fetch(baseUrl + "card/deleteCheckList", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.addComment = async function (params:any) {
    const res = await fetch(baseUrl + "card/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.editComment = async function (params:any) {
    const res = await fetch(baseUrl + "card/editComment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.copyCard = async function (params:any) {
    const res = await fetch(baseUrl + "card/copyCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.getCardActivity = async function (params:any) {
    const res = await fetch(baseUrl + "card/cardActivity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.upload = async function (params:any) {
    const res = await fetch(baseUrl + "card/upload", {
      method: "POST",
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: params,
    });
    return res.json();
  };
  CardService.prototype.setCardFix = async function (params:any) {
    const res = await fetch(baseUrl + "card/setCardFix", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  CardService.prototype.setCardPriority = async function (params:any) {
    const res = await fetch(baseUrl + "card/setCardPriority", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  
  return CardService;
})();

export default CardService;
