import { TWITTER_FILTER_CHANGED, TWITTER_RESET, TWITTER_INIT,
  TWITTER_FETCH_TIMELINE_BEGIN, TWITTER_FETCH_TIMELINE_SUCCESS, TWITTER_FETCH_TIMELINE_FAILURE,
} from '../store/type.js';

export const init = () => ({
  type: TWITTER_INIT,
})

export const fetchTimelineBegin = () => ({
  type: TWITTER_FETCH_TIMELINE_BEGIN,
})

export const fetchTimelineSuccess = (tweets,users,max_ids,minDates) => {
  return ({
    type: TWITTER_FETCH_TIMELINE_SUCCESS,
    payload: {
      tweets: tweets,
      users: users,
      max_ids: max_ids,
      minDates: minDates,
    }
  })
}

export const fetchTimelineFailure = () => ({
  type: TWITTER_FETCH_TIMELINE_FAILURE,
})

export const filterChanged = (group) => {
  return ({
    type: TWITTER_FILTER_CHANGED,
    payload: {
      group:group,
    }
  })
}

export const reset = () => ({
  type: TWITTER_RESET,
})
