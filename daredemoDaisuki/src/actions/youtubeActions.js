import { YOUTUBE_FILTER_CHANGED, YOUTUBE_RESET, YOUTUBE_DISPLAY_WEBVIEW, YOUTUBE_INIT,
  YOUTUBE_FETCH_ACTIVITIES_BEGIN, YOUTUBE_FETCH_ACTIVITIES_SUCCESS, YOUTUBE_FETCH_ACTIVITIES_FAILURE,
  YOUTUBE_FETCH_CHANNELS_BEGIN, YOUTUBE_FETCH_CHANNELS_SUCCESS, YOUTUBE_FETCH_CHANNELS_FAILURE } from '../store/type.js';

export const displayWebview = (title) => ({
    type: YOUTUBE_DISPLAY_WEBVIEW,
    payload: {
      title: title,
    }
})

export const init = () => ({
  type: YOUTUBE_INIT,
})

export const fetchActivitiesBegin = () => ({
  type: YOUTUBE_FETCH_ACTIVITIES_BEGIN,
})

export const fetchActivitiesSuccess = (activitiesInput) => {
  return ({
    type: YOUTUBE_FETCH_ACTIVITIES_SUCCESS,
    payload: {
      activitiesInput:activitiesInput,
    }
  })
}

export const fetchActivitiesFailure = () => ({
  type: YOUTUBE_FETCH_ACTIVITIES_FAILURE,
})

export const fetchChannelsBegin = () => ({
  type: YOUTUBE_FETCH_CHANNELS_BEGIN,
})

export const fetchChannelsSuccess = (channelsInput) => {
  return ({
    type: YOUTUBE_FETCH_CHANNELS_SUCCESS,
    payload: {
      channelsInput:channelsInput,
    }
  })
}

export const fetchChannelsFailure = () => ({
  type: YOUTUBE_FETCH_CHANNELS_FAILURE,
})

export const filterChanged = (group) => {
  return ({
    type: YOUTUBE_FILTER_CHANGED,
    payload: {
      group:group,
    }
  })
}

export const reset = () => ({
  type: YOUTUBE_RESET,
})
