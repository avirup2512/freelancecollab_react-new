import config from "../../config";
const TeamService:any = (function () {
  let baseUrl = config.baseUrl;
  function team() {}
  team.prototype.createTeam = async function (token:any,params:any) {
    const res = await fetch(baseUrl + "teams/create-team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+token
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  return team;
})();
export default TeamService;
