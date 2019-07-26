import {
  BILI_FETCH_VIDEO_BEGIN, BILI_FETCH_VIDEO_SUCCESS, BILI_FETCH_VIDEO_FAILURE,
  BILI_FILTER_CHANGED, BILI_RESET, BILI_INIT,
  BILI_FETCH_LIVE_BEGIN, BILI_FETCH_LIVE_SUCCESS, BILI_FETCH_LIVE_FAILURE,
} from '../store/type.js';


export const init = () => ({
  type: BILI_INIT,
})

export const fetchVideoBegin = () => ({
  type:BILI_FETCH_VIDEO_BEGIN,
})

export const fetchVideoSuccess = (input) => ({
  type:BILI_FETCH_VIDEO_SUCCESS,
  payload: {
    input:input,
  }
})

export const fetchVideoFailure = () => ({
  type:BILI_FETCH_VIDEO_FAILURE,
})

export const fetchLiveBegin = () => ({
  type: BILI_FETCH_LIVE_BEGIN,
})

export const fetchLiveSuccess = (input) => {
  return ({
    type: BILI_FETCH_LIVE_SUCCESS,
    payload: {
      input:input,
    }
  })
}

export const fetchLiveFailure = () => ({
  type: BILI_FETCH_LIVE_FAILURE,
})

export const filterChanged = (group) => {
  return ({
    type: BILI_FILTER_CHANGED,
    payload: {
      group:group,
    }
  })
}

export const reset = () => ({
  type: BILI_RESET,
})
