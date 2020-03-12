// @flow
export const SIGN_UP_SCREEN = {
  ERRORS: {
    EMPTY_NAME_ERROR: 'Name should not be empty',
    EMPTY_EMAIL_ERROR: 'Email should not be empty',
    EMPTY_MOBILE_NUMBER_ERROR: 'Mobile number should not be empty',
    EMPTY_PASSWORD_ERROR: 'Password should not be empty',
    EMPTY_CONFIRM_PASSWORD_ERROR: 'Confirm password should not be empty',
    INVALID_EMAIL_ERROR: 'Email should be valid',
    INVALID_MOBILE_NUMBER_ERROR: 'Mobile number invalid',
    INVALID_PASSWORD_ERROR: 'Password invalid',
    PASSWORD_MISMATCH_ERROR: 'Password mismatch',
  }
};

export const LOGIN_SCREEN = {
  ERRORS: {
    EMPTY_USERNAME_ERROR: 'Username should not be empty',
    INVALID_USERNAME_ERROR: 'Username invalid',
    EMPTY_PASSWORD_ERROR: 'Password should not be empty',
    INVALID_PASSWORD_ERROR: 'Password should be greater than 6 characters'
  },
};

export const ERRORS = {
  EMPTY_USERNAME_ERROR: 'Username should not be empty',
  INVALID_USERNAME_ERROR: 'Username invalid',
  EMPTY_PASSWORD_ERROR: 'Password should not be empty',
  INVALID_PASSWORD_ERROR: 'Password should be greater than 6 characters'
}

export const OTP_SCREEN = {
  REMINDER: 'We have sent an OTP to your mobile number. please enter to verify',
  ERRORS: {
    TIME_OUT_ERROR: 'Some error happend please try again later...',
    OTP_INVALID_ERROR: 'OTP Invalid. Please try again'
  }
};

export const MAIN_SCREEN = {
  NAME: 'Name: ',
  EMAIL: 'Email: ',
  UID: 'UID: ',
  MOBILE_NO: 'Mobile No: '
};

export const LOADER = {
  TITLE: 'Loading...'
};

export const SCREEN_TITLES = {
  SIGN_UP: 'Sign Up',
  OTP: 'OTP Verification',
  MAIN: 'Hel3.14t',
  LOGIN: 'Login',
  RESET_PASSOWRD: 'Reset password',
  TERMS_AND_CONDITIONS: 'Terms And Conditions'
};

export const NOTIFICATION_TYPES = {
  REQUEST : "Helper is willing to help you, please click to check",
  ACCEPT : "You got accepted to help, please go and help. All the best",
  REJECT : "You got rejected",
  CLOSED : "Request got closed" 
}

export const HELPS_REQUESTED_DB = 'helpsRequested';
export const HELPS_COMPLETED_DB = 'helpsCompleted';

export const STATUS_TEXT_MAPPING = {
  'REQUESTED' : 'Requested',
  'ON_GOING' : 'On going',
  'COMPLETED' : 'Completed'
}

export const APP_TITLE = "Haisaa";

export const SCREEN_DETAILS = {
  MAIN: { screenTitle: "Home", screenName: "Main"},
  APP_LANDING_SCREEN : { screenTitle: "Welcome to haisaa", screenName: "LandingScreen" },
  LOGIN : { screenTitle: "Log in", screenName: "Login" },
  SIGNUP: { screenTitle: "Register", screenName: "SignUp" },
  VERIFICATION: { screenTitle: "Verification", screenName: "Verification"},
  FORGOT_PASSWORD: { screenTitle: "Forgot password", screenName: "ForgotPassword"},
  RESET_PASSWORD: { screenTitle: "Reset your passward", screenName: "ResetPassword"},
  TERMS_AND_CONDITIONS: { screenTitle: "Terms & Conditions", screenName: "TermsAndConditions"},
  NOTIFICATIONS: { screenTitle: "Notifications", screenName: "Notifications"},
}