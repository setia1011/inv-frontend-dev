import cookies from "vue-cookies";
import { xaxios, setAuthHeaderX } from "../utils/xaxios";

const getUserMenus = async (r) => {
   setAuthHeaderX(cookies.get('token'));
   const res = await xaxios.get("/user/info-ex");
   return res.data.menus;
}

export { getUserMenus };