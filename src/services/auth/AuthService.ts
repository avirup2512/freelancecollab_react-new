import config from "../../config";
const AuthService:any = (function () {
  let baseUrl = config.baseUrl;
  function auth() {}
  auth.prototype.createUser = async function (params:any) {
    const res = await fetch(baseUrl + "auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  auth.prototype.createUserFromSocialLogin = async function (params:any) {
    const res = await fetch(baseUrl + "auth/social/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  auth.prototype.login = async function (params:any) {
    const res = await fetch(baseUrl + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  auth.prototype.getUserDetails = async function (params:any) {
    const res = await fetch(baseUrl + "auth/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  auth.prototype.resetPassword = async function (params:any) {
    const res = await fetch(baseUrl + "auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  auth.prototype.setNewPassword = async function (params:any) {
    const res = await fetch(baseUrl + "auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return res.json();
  };
  auth.prototype.searchUser = async function (keyword:any)
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
  return auth;
})();

export default AuthService;
