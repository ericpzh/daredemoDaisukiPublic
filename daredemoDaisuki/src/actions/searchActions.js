import { SEARCH_RESET, SEARCH_VALUE, SEARCHTAB, SEARCH_RESET_DATA, SEARCH_VTUBER_REMOVE,
  SEARCH_FETCH_YOUTUBE_BEGIN, SEARCH_FETCH_YOUTUBE_SUCCESS, SEARCH_FETCH_YOUTUBE_FAILURE,
  SEARCH_FETCH_BILI_BEGIN, SEARCH_FETCH_BILI_SUCCESS, SEARCH_FETCH_BILI_FAILURE,
  SEARCH_FETCH_VTUBER_BEGIN, SEARCH_FETCH_VTUBER_SUCCESS, SEARCH_FETCH_VTUBER_FAILURE,
  SEARCH_FETCH_TWITTER_BEGIN, SEARCH_FETCH_TWITTER_SUCCESS, SEARCH_FETCH_TWITTER_FAILURE,
  SEARCH_TWITTER_END_REACHED,
} from '../store/type.js';

export const searchValue = (value) => ({
   type: SEARCH_VALUE,
   payload: {
     value: value,
   }
})

export const resetData = () => ({
  type: SEARCH_RESET_DATA,
})

export const searchTab = (value) => ({
    type: SEARCHTAB,
    payload: {
      value: value,
    }
})

export const fetchVtuberBegin = () => ({
  type: SEARCH_FETCH_VTUBER_BEGIN,
})

export const fetchVtuberSuccess = (input) => {
  return ({
    type: SEARCH_FETCH_VTUBER_SUCCESS,
    payload: {
      input:input,
    }
  })
}

export const fetchVtuberFailure = () => ({
  type: SEARCH_FETCH_VTUBER_FAILURE,
})

export const fetchYoutubeBegin = () => {
  return ({
    type: SEARCH_FETCH_YOUTUBE_BEGIN,
  })
}

export const fetchYoutubeSuccess = (youtubeInput) => {
  return ({
    type: SEARCH_FETCH_YOUTUBE_SUCCESS,
    payload: {
      youtubeInput:youtubeInput,
    }
  })
}

export const fetchYoutubeFailure = () => ({
  type: SEARCH_FETCH_YOUTUBE_FAILURE,
})

export const fetchTwitterBegin = () => {
  return ({
    type: SEARCH_FETCH_TWITTER_BEGIN,
  })
}

export const fetchTwitterSuccess = (input) => {
  return ({
    type: SEARCH_FETCH_TWITTER_SUCCESS,
    payload: {
      input:input,
    }
  })
}

export const fetchTwitterFailure = () => ({
  type: SEARCH_FETCH_TWITTER_FAILURE,
})

export const fetchbiliBegin = () => ({
  type: SEARCH_FETCH_BILI_BEGIN,
})

export const fetchbiliSuccess = (input) => {
  return ({
    type: SEARCH_FETCH_BILI_SUCCESS,
    payload: {
      input:input
    }
  })
}

export const fetchbiliFailure = () => ({
  type: SEARCH_FETCH_BILI_FAILURE,
})

export const reset = () => ({
  type: SEARCH_RESET,
})

export const searchVtuberRemove = (enname) => ({
  type: SEARCH_VTUBER_REMOVE,
  payload: {
    enname: enname
  }
})

export const searchTwitterEndReached = () => ({
  type: SEARCH_TWITTER_END_REACHED,
})
