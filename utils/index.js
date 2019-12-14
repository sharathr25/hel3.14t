
import { LOGIN_SCREEN } from '../constants/appConstants'

export const regex = {
    email : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    phoneNo:  /^\d{10}$/
}

export const checkUserNameAndPasswordFields = (userName, password) => {
    if (userName.length === 0) {
      return { key: "userNameErrorMessage", userNameErrorMessage: LOGIN_SCREEN.ERRORS.EMPTY_USERNAME_ERROR, valid: false }
    } else if (!(userName.match(regex.email) || userName.match(regex.phoneNo))) {
      return { key: "userNameErrorMessage", userNameErrorMessage: LOGIN_SCREEN.ERRORS.INVALID_USERNAME_ERROR, valid: false }
    } else if (password.length === 0) {
      return { key:"passwordErrorMessage", passwordErrorMessage: LOGIN_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR, valid: false };
    } else if (password.length < 6) {
      return { key:"passwordErrorMessage", passwordErrorMessage: LOGIN_SCREEN.ERRORS.INVALID_PASSWORD_ERROR, valid: false };
    } 
    return { valid: true }
  };

export const getStr = (value, str) =>
Math.floor(value) === 0
  ? ""
  : Math.floor(value) === 1
  ? `${Math.floor(value)} ${str}`
  : `${Math.floor(value)} ${str}s`;

export const getTimeDiffrence = time => {
  const currentTime = new Date().getTime();
  const inMilliSeconds = currentTime - time;
  const inSeconds = inMilliSeconds / 1000;
  const inMinutes = inSeconds / 60;
  if (inMinutes < 60) {
    return `${getStr(inMinutes, "minute")} ago`;
  }
  const inHours = inMinutes / 60;
  if (inHours < 24) {
    return `${getStr(inHours, "hour")} ago`;
  }
  const inDays = inHours / 24;
  if (inDays < 30) {
    return `${getStr(inDays, "day")} ago`
  }
  return "Long time ago";
};

// getTimeDiffrence = time => {
  //   let timeDiffrence = "";
  //   const currentTime = new Date().getTime();
  //   const inMilliSeconds = currentTime - time;
  //   const inSeconds = inMilliSeconds / 1000;
  //   const inMinutes = inSeconds / 60;
  //   if (inMinutes < 60) {
  //     timeDiffrence = `${this.getStr(inMinutes, "minute")} ago`;
  //     return timeDiffrence;
  //   }
  //   const inHours = inMinutes / 60;
  //   const remainingMinutes = inMinutes % 60;
  //   if (inHours < 24) {
  //     timeDiffrence = `${this.getStr(inHours, "hour")} ${this.getStr(
  //       remainingMinutes,
  //       "minute"
  //     )} ago`;
  //     return timeDiffrence;
  //   }
  //   const inDays = inHours / 24;
  //   if (inDays < 30) {
  //     const remainingHours = inHours % 24;
  //     const inMinutes1 = (remainingHours - Math.floor(remainingHours)) * 60;
  //     if (remainingHours < 1) {
  //       return `${this.getStr(inDays, "day")} ${this.getStr(
  //         inMinutes1,
  //         "minute"
  //       )} ago`;
  //     }
  //     return `${this.getStr(inDays, "day")} ${this.getStr(
  //       remainingHours,
  //       "hour"
  //     )} ${this.getStr(inMinutes1, "minute")} ago`;
  //   }
  //   return "Long time ago";
  // };