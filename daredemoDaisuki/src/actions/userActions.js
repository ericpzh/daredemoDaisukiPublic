import { LOGIN_BEGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
  GET_ACCOUNT_BEGIN, GET_ACCOUNT_SUCCESS, GET_ACCOUNT_FAILURE,
  SIGNUP_BEGIN, SIGNUP_SUCCESS, SIGNUP_FAILURE,
  CHANGE_PASSWORD_BEGIN, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE,
  PUT_SUBSCRIPTIONS_BEGIN, PUT_SUBSCRIPTIONS_SUCCESS, PUT_SUBSCRIPTIONS_FAILURE,
  PUT_GROUPS_BEGIN, PUT_GROUPS_SUCCESS, PUT_GROUPS_FAILURE,
  USER_INIT, USER_FILTER_CHANGED, ACCOUNT_INIT, CHANGE_SELETED_GROUP,
  TOGGLE_EDITING_GROUP_NAME, MANAGE_GROUP_INIT, CHANGE_COLOR, CHANGE_FONT,
  PUT_TWITTER_API_KEY_BEGIN, PUT_TWITTER_API_KEY_SUCCESS, PUT_TWITTER_API_KEY_FAILURE,
  PUT_GOOGLE_API_KEY_BEGIN, PUT_GOOGLE_API_KEY_SUCCESS, PUT_GOOGLE_API_KEY_FAILURE,
  CHANGE_NICKNAME_BEGIN, CHANGE_NICKNAME_SUCCESS, CHANGE_NICKNAME_FAILURE,
  CHANGE_IMAGE_BEGIN, CHANGE_IMAGE_SUCCESS, CHANGE_IMAGE_FAILURE,
} from '../store/type.js';

export const init = () => ({
  type: USER_INIT,
})

export const accountInit = () => ({
  type: ACCOUNT_INIT,
})

export const filterChanged = (value) => ({
  type: USER_FILTER_CHANGED,
  payload:{
    value: value,
  }
})

export const loginBegin = () => ({
   type: LOGIN_BEGIN,
})

export const loginSuccess = (input) => ({
   type: LOGIN_SUCCESS,
   payload: {
     input: input,
   }
})

export const loginFailure = () => ({
   type: LOGIN_FAILURE,
 })
export const getAccountBegin = () => ({
   type: GET_ACCOUNT_BEGIN,
})

export const getAccountSuccess = (input) => ({
   type: GET_ACCOUNT_SUCCESS,
   payload: {
     input: input,
   }
})

export const getAccountFailure = () => ({
   type: GET_ACCOUNT_FAILURE,
   payload: {

   }
})
export const signUpBegin = () => ({
   type: SIGNUP_BEGIN,
})

export const signUpSuccess = (input) => ({
   type: SIGNUP_SUCCESS,
   payload: {
     input: input,
   }
})

export const signUpFailure = () => ({
   type: SIGNUP_FAILURE,
})

export const changePasswordBegin = () => ({
   type: CHANGE_PASSWORD_BEGIN,
})

export const changePasswordSuccess = (input) => ({
   type: CHANGE_PASSWORD_SUCCESS,
   payload: {
     input: input
   }
})

export const changePasswordFailure = () => ({
   type: CHANGE_PASSWORD_FAILURE,
})

export const changeNicknameBegin = () => ({
   type: CHANGE_NICKNAME_BEGIN,
})

export const changeNicknameSuccess = (input) => ({
   type: CHANGE_NICKNAME_SUCCESS,
   payload: {
     input: input
   }
})

export const changeNicknameFailure = () => ({
   type: CHANGE_NICKNAME_FAILURE,
})

export const changeImageBegin = () => ({
   type: CHANGE_IMAGE_BEGIN,
})

export const changeImageSuccess = (input) => ({
   type: CHANGE_IMAGE_SUCCESS,
   payload: {
     input: input
   }
})

export const changeImageFailure = () => ({
   type: CHANGE_IMAGE_FAILURE,
})


export const logout = () => ({
   type: LOGOUT,
})

export const putSubscriptionsBegin = (enname) => ({
  type: PUT_SUBSCRIPTIONS_BEGIN,
  payload: {
    enname: enname
  }
})

export const putSubscriptionsSuccess = (subscriptions,enname) => ({
  type: PUT_SUBSCRIPTIONS_SUCCESS,
  payload: {
    subscriptions: subscriptions,
    enname: enname
  }
})

export const putSubscriptionsFailure = (enname) => ({
  type: PUT_SUBSCRIPTIONS_FAILURE,
  payload: {
    enname: enname
  }
})

export const putGroupsBegin = () => ({
  type: PUT_GROUPS_BEGIN,
})

export const putGroupsSuccess = (groups) => ({
  type: PUT_GROUPS_SUCCESS,
  payload: {
    groups: groups,
  }
})

export const putGroupsFailure = () => ({
  type: PUT_GROUPS_FAILURE,
})

export const changeSeletedGroup = (selectedGroup) => ({
  type: CHANGE_SELETED_GROUP,
  payload: {
    selectedGroup: selectedGroup
  }
})

export const toggleEditingGroupName = () => ({
  type: TOGGLE_EDITING_GROUP_NAME,
})

export const manageGroupInit = () => ({
  type: MANAGE_GROUP_INIT
})

export const changeColor = (color) => ({
  type: CHANGE_COLOR,
  payload: {
    color: color,
  }
})

export const changeFont = (input) => ({
  type: CHANGE_FONT,
  payload: {
    input: input,
  }
})


export const putTwitterAPIKeyBegin = () => ({
   type: PUT_TWITTER_API_KEY_BEGIN,
})

export const putTwitterAPIKeySuccess = (input) => ({
   type: PUT_TWITTER_API_KEY_SUCCESS,
   payload: {
     input: input
   }
})

export const putTwitterAPIKeyFailure = () => ({
   type: PUT_TWITTER_API_KEY_FAILURE,
})

export const putGoogleAPIKeyBegin = () => ({
   type: PUT_GOOGLE_API_KEY_BEGIN,
})

export const putGoogleAPIKeySuccess = (input) => ({
   type: PUT_GOOGLE_API_KEY_SUCCESS,
   payload: {
     input: input
   }
})

export const putGoogleAPIKeyFailure = () => ({
   type: PUT_GOOGLE_API_KEY_FAILURE,
})
