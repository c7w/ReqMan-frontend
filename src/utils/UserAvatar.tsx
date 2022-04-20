// 获取用户头像
import CryptoJS from "crypto-js";
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
export default getUserAvatar;
