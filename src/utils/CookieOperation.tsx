const getCookie = (key: string, default_value: string): string => {
  let rgx = new RegExp("(?:^|(?:; ))" + key + "=([^;]*)");
  let result = document.cookie.match(rgx);
  if (result) {
    return result[1];
  } else {
    return default_value;
  }
};

const setCookie = (key: string, value: string) => {
  //设置 Cookie
  document.cookie = key + "=" + value;
};

export { getCookie, setCookie };
