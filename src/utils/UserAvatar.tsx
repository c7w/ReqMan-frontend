// 获取用户头像
import CryptoJS from "crypto-js";
import { userId2UserInfo } from "./Association";
const getUserAvatar = (userStore: string): string => {
  if (userStore === "" || JSON.parse(userStore).code !== 0) {
    return "";
  }
  const userInfo = JSON.parse(userStore);
  if (userInfo.data.user.avatar.length < 5) {
    return `https://www.gravatar.com/avatar/${CryptoJS.MD5(
      userInfo.data.user.email
    )}`;
  } else {
    return userInfo.data.user.avatar;
  }
};
const userId2Avatar = (userId: number, projectStore: string) => {
  const userInfo = userId2UserInfo(userId, projectStore);
  if (userInfo.avatar.length < 5) {
    return `https://www.gravatar.com/avatar/${CryptoJS.MD5(userInfo.email)}`;
  } else {
    return userInfo.avatar;
  }
};
export { getUserAvatar, userId2Avatar };
