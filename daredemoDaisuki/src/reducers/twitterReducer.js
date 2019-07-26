import { TWITTER_FILTER_CHANGED, TWITTER_RESET, TWITTER_INIT,
  TWITTER_FETCH_TIMELINE_BEGIN, TWITTER_FETCH_TIMELINE_SUCCESS, TWITTER_FETCH_TIMELINE_FAILURE,
} from '../store/type.js';

const initState = {
  group: "Daredemo Daisuki",
  tweets: [],
  users: {},
  loading: false,
  max_ids: {}, //{screen_name: max_id}
  minDates: {}, //{screen_name: date}
}

const twitter = (state = initState, action) => {
  var {
    group,
    tweets,
    users,
    max_ids,
    minDates,
    loading,
    } = state;

  switch (action.type) {
    case TWITTER_INIT: {
      return initState;
    }

    case TWITTER_RESET: {
      return {
        group: group,
        tweets: [],
        users: {},
        max_ids: {},
        minDates: {},
      };
    }

    case TWITTER_FETCH_TIMELINE_BEGIN:{
      return {
        ...state,
        loading: true,
      };
    }

    case TWITTER_FETCH_TIMELINE_SUCCESS:{
      return {
        ...state,
        loading: false,
        tweets: [...tweets, ...action.payload.tweets],
        users:  {...users, ...action.payload.users},
        max_ids: action.payload.max_ids,
        minDates: action.payload.minDates
      };
    }

    case TWITTER_FETCH_TIMELINE_FAILURE:{
      return {
        ...state,
        loading: false,
      }
    }

    case TWITTER_FILTER_CHANGED:{
      group = action.payload.group;
      return {
        ...state,
        group: group,
      };
    }

    default:{
      return state;
    }
  }
}

export default twitter;
