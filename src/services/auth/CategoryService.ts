import config from "../../config";
const CategoryService:any = (function () {
  let baseUrl = config.baseUrl;
  function category() {}
  category.prototype.getAllCategory = async function (token:any) {
    const res = await fetch(baseUrl + "category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+token
      },
    });
    return res.json();
  };
  return category;
})();
export default CategoryService;
