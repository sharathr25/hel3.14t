
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