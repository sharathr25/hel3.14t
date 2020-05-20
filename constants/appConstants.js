import { GRAY, GREEN, ORANGE, RED, LIGHT_GRAY, LIGHTER_ORANGE, LIGHT_ORANGE, LIGHT_GREEN, LIGHT_RED } from "../styles/colors";

export const SCREEN_DETAILS = {
  MAIN: { screenTitle: "Home", screenName: "Main"},
  APP_LANDING_SCREEN : { screenTitle: "Welcome to haisaa", screenName: "LandingScreen" },
  LOGIN : { screenTitle: "Log in", screenName: "Login" },
  SIGNUP: { screenTitle: "Register", screenName: "SignUp" },
  VERIFICATION: { screenTitle: "Verification", screenName: "Verification"},
  FORGOT_PASSWORD: { screenTitle: "Forgot password", screenName: "ForgotPassword"},
  TERMS_AND_CONDITIONS: { screenTitle: "Terms & Conditions", screenName: "TermsAndConditions"},
  NOTIFICATIONS: { screenTitle: "Notifications", screenName: "Notifications"},
  MY_ACCOUNT: { screenTitle: "My Account", screenName: "MyAccount" },
  HELP_REQUEST: { screenTitle: "Help Request", screenName: "HelpRequest" },
  USER_HELP_REQUEST: { screenTitle: "Your Help Request", screenName: "UserHelpRequest" },
  UPDATE_ACCOUNT: { screenTitle: "Update Account Details", screenName: "UpdateAccount" },
  USER_CONTRIBUTION: { screenTitle: "Your Contribution", screenName: "UserContribution" },
  MORE_SCREEN: { screenTitle: "", screenName: "MoreScreen" },
  CHANGE_PASSOWRD: { screenTitle: "Change password", screenName: "changePassword"}
}

export const NOTIFICATION_TYPES = {
  HELPER_REQUESTED: "HELPER_REQUESTED",
  HELPER_ACCEPTED: "HELPER_ACCEPTED",
  HELPER_CANCELLED: "HELPER_CANCELLED",
  REQUESTER_CANCELLED: "REQUESTER_CANCELLED",
  REQUESTER_REJECTED: "REQUEST_REJECTED"
}

const { 
  HELPER_ACCEPTED, 
  HELPER_CANCELLED, 
  HELPER_REQUESTED, 
  REQUESTER_CANCELLED, 
  REQUESTER_REJECTED
} = NOTIFICATION_TYPES;

export const typeToScreenMapping = {
  [HELPER_REQUESTED]: SCREEN_DETAILS.USER_HELP_REQUEST.screenName,
  [HELPER_ACCEPTED]: SCREEN_DETAILS.USER_CONTRIBUTION.screenName,
  [HELPER_CANCELLED]: SCREEN_DETAILS.USER_HELP_REQUEST.screenName,
  [REQUESTER_CANCELLED]: SCREEN_DETAILS.USER_CONTRIBUTION.screenName,
  [REQUESTER_REJECTED]: SCREEN_DETAILS.USER_CONTRIBUTION.screenName
}

export const HELP_REQUEST_STATUS = {
  REQUESTED: "REQUESTED",
  ON_GOING: "ON_GOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
}

const {
  REQUESTED,
  ON_GOING,
  COMPLETED,
  CANCELLED
} = HELP_REQUEST_STATUS

export const STATUS_MAPPING = {
  [REQUESTED]: {text: 'Requested', color: GRAY, lightColor: LIGHT_GRAY },
  [ON_GOING]: {text: 'In Progress', color: ORANGE, lightColor: LIGHT_ORANGE },
  [COMPLETED]: {text: 'Completed', color: GREEN, lightColor: LIGHT_GREEN },
  [CANCELLED]: {text: 'Cancelled', color: RED, lightColor: LIGHT_RED }
}