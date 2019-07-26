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
} from '../store/type.js';

const initState = {
  name: "",
  password: "",
  subscriptions: [],
  groups: [],
  googleapikey: "",
  twitterapikey: {key:"",secretKey:"",token:"",secretToken:""},
  suggestions: [],
  authLoading: false,
  subscriptionsGroup: "Daredemo Daisuki",
  colorTheme: 'black',
  font: 'vivid',
  subscriptionsLoading: {},
  groupsLoading: false,
  selectedGroup: "",
  editingGroupName: false,
}

const user = (state = initState, action) => {
  var {
      name,
      password,
      subscriptions,
      groups,
      googleapikey,
      twitterapikey,
      suggestions,
      authLoading,
      colorTheme,
      font,
      subscriptionsGroup,
      subscriptionsLoading,
      groupsLoading,
      selectedGroup,
      editingGroupName,
    } = state;

  switch (action.type) {
    case ACCOUNT_INIT: {
      return {
        ... state,
        subscriptions: [],
        groups: [],
        suggestions: [],
        googleapikey: "",
        twitterapikey: {key:"",secretKey:"",token:"",secretToken:""},
        subscriptionsGroup: "Daredemo Daisuki",
        subscriptionsLoading: {},
        groupsLoading: false,
        selectedGroup: "",
        editingGroupName: false,
      }
    }

    case USER_INIT: {
      return {
        ... state,
        subscriptionsGroup: "Daredemo Daisuki",
        subscriptionsLoading: {},
        groupsLoading: false,
        selectedGroup: "",
        editingGroupName: false,
      }
    }
    case USER_FILTER_CHANGED: {
      return {
        ...state,
        subscriptionsGroup: action.payload.value
      }
    }
    case LOGIN_BEGIN: {
      return {
        ...state,
        authLoading: true,
      };
    }

    case LOGIN_SUCCESS: {
      return {
        ...state,
        name: action.payload.input.name,
        password: action.payload.input.password,
        subscriptions: action.payload.input.subscriptions,
        groups: action.payload.input.groups,
        googleapikey: action.payload.input.googleapikey,
        twitterapikey: action.payload.input.twitterapikey,
        suggestions: action.payload.input.suggestions,
        authLoading: false,
      };
    }

    case LOGIN_FAILURE: {
      return {
        ...state,
        authLoading: false,
      };
    }

    case GET_ACCOUNT_BEGIN: {
      return {
        ...state,
        authLoading: true,
      };
    }

    case GET_ACCOUNT_SUCCESS: {
      return {
        ...state,
        subscriptions: action.payload.input.subscriptions,
        groups: action.payload.input.groups,
        googleapikey: action.payload.input.googleapikey,
        twitterapikey: action.payload.input.twitterapikey,
        suggestions: action.payload.input.suggestions,
        authLoading: false,
      };
    }

    case GET_ACCOUNT_FAILURE: {
      return {
        ...state,
        authLoading: false,
      };
    }

    case SIGNUP_BEGIN: {
      return {
        ...state,
        authLoading: true,
      };
    }

    case SIGNUP_SUCCESS: {
      return {
        ...state,
        name: action.payload.input.name,
        password: action.payload.input.password,
        subscriptions: action.payload.input.subscriptions,
        groups: action.payload.input.groups,
        googleapikey: action.payload.input.googleapikey,
        twitterapikey: action.payload.input.twitterapikey,
        suggestions: action.payload.input.suggestions,
        authLoading: false,
      };
    }

    case SIGNUP_FAILURE: {
      return {
        ...state,
        authLoading: false,
      };
    }

    case CHANGE_PASSWORD_BEGIN: {
      return {
        ...state,
        authLoading: true,
      };
    }

    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        password: action.payload.input,
        authPassword: "",
        authLoading: false,
      };
    }

    case CHANGE_PASSWORD_FAILURE: {
      return {
        ...state,
        authLoading: false,
      };
    }

    case LOGOUT: {
      return {
        name: "",
        password: "",
        subscriptions: [],
        suggestions: [],
        groups: [],
        googleapikey: "",
        twitterapikey: {key:"",secretKey:"",token:"",secretToken:""},
        authLoading: false,
        subscriptionsLoading: {},
        groupsLoading: false,
        subscriptionsGroup: "Daredemo Daisuki",
        colorTheme: colorTheme,
        font: font,
        selectedGroup: "",
        editingGroupName: false,
      };
    }

    case PUT_SUBSCRIPTIONS_BEGIN: {
      subscriptionsLoading[action.payload.enname] = true;
      return {
        ...state,
        subscriptionsLoading: subscriptionsLoading,
      };
    }

    case PUT_SUBSCRIPTIONS_SUCCESS: {
      subscriptionsLoading[action.payload.enname] = false;
      return {
        ...state,
        subscriptions: action.payload.subscriptions,
        subscriptionsLoading: subscriptionsLoading,
      };
    }

    case PUT_SUBSCRIPTIONS_FAILURE: {
      subscriptionsLoading[action.payload.enname] = false;
      return {
        ...state,
        subscriptionsLoading: subscriptionsLoading,
      };
    }

    case PUT_GROUPS_BEGIN: {
      return {
        ...state,
        groupsLoading: true,
      };
    }

    case PUT_GROUPS_SUCCESS: {
      return {
        ...state,
        groups: action.payload.groups,
        groupsLoading: false,
      };
    }

    case PUT_GROUPS_FAILURE: {
      return {
        ...state,
        groupsLoading: false,
      };
    }

    case CHANGE_SELETED_GROUP: {
      return {
        ...state,
        selectedGroup: action.payload.selectedGroup,
      }
    }

    case TOGGLE_EDITING_GROUP_NAME: {
        return {
          ...state,
          editingGroupName: !editingGroupName,
        }
    }

    case MANAGE_GROUP_INIT: {
      return {
        ...state,
        selectedGroup: "",
        editingGroupName: false,
      }
    }

    case CHANGE_COLOR :{
      return {
        ...state,
        colorTheme: action.payload.color
      }
    }

    case CHANGE_FONT : {
      return {
        ...state,
        font: action.payload.input
      }
    }

    case PUT_TWITTER_API_KEY_BEGIN: {
      return {
        ...state,
        authLoading: true,
      };
    }

    case PUT_TWITTER_API_KEY_SUCCESS: {
      return {
        ...state,
        authLoading: false,
        twitterapikey: action.payload.input
      };
    }

    case PUT_TWITTER_API_KEY_FAILURE: {
      return {
        ...state,
        authLoading: false,
      };
    }

    case PUT_GOOGLE_API_KEY_BEGIN: {
      return {
        ...state,
        authLoading: true,
      };
    }

    case PUT_GOOGLE_API_KEY_SUCCESS: {
      return {
        ...state,
        authLoading: false,
        googleapikey: action.payload.input,
      };
    }

    case PUT_GOOGLE_API_KEY_FAILURE: {
      return {
        ...state,
        authLoading: false,
      };
    }

    default:{
      return state
    }
  }
}

export default user;
