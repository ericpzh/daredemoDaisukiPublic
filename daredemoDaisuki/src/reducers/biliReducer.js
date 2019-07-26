import {
  BILI_FETCH_VIDEO_BEGIN, BILI_FETCH_VIDEO_SUCCESS, BILI_FETCH_VIDEO_FAILURE,
  BILI_FILTER_CHANGED, BILI_RESET, BILI_INIT,
  BILI_FETCH_LIVE_BEGIN, BILI_FETCH_LIVE_SUCCESS, BILI_FETCH_LIVE_FAILURE,
} from '../store/type.js';

const initState = {
  group: "Daredemo Daisuki",
  live: [],
  videos: [],
  currPage: 1,
  loadingVideo: false,
  loadingLive: false,
}

const bili = (state = initState, action) => {
  var {
    group,
    live,
    videos,
    currPage,
    loadingVideo,
    loadingLive,
    } = state;

  switch (action.type) {
    case BILI_INIT: {
      return initState;
    }

    case BILI_RESET: {
      return {
        group: group,
        live: [],
        videos: [],
        currPage: 1,
        loadingVideo: false,
        loadingLive: false,
      };
    }

    case BILI_FETCH_VIDEO_BEGIN:{
      return {
        ...state,
        loadingVideo: true,
      };
    }

    case BILI_FETCH_VIDEO_SUCCESS:{
      return {
        ...state,
        loadingVideo: false,
        currPage: currPage + 1,
        videos: [...videos,...action.payload.input],
      };
    }

    case BILI_FETCH_VIDEO_FAILURE:{
      return {
        ...state,
        loadingVideo: false,
      }
    }

    case BILI_FETCH_LIVE_BEGIN:{
      return {
        ...state,
        loadingLive: true,
      };
    }

    case BILI_FETCH_LIVE_SUCCESS:{
      return {
        ...state,
        loadingLive: false,
        live:action.payload.input,
      };
    }

    case BILI_FETCH_LIVE_FAILURE:{
      return {
        ...state,
        loadingLive: false,
      }
    }

    case BILI_FILTER_CHANGED:{
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

export default bili;
