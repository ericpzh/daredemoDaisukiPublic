import { YOUTUBE_FILTER_CHANGED, YOUTUBE_RESET, YOUTUBE_DISPLAY_WEBVIEW, YOUTUBE_INIT,
  YOUTUBE_FETCH_ACTIVITIES_BEGIN, YOUTUBE_FETCH_ACTIVITIES_SUCCESS, YOUTUBE_FETCH_ACTIVITIES_FAILURE,
  YOUTUBE_FETCH_CHANNELS_BEGIN, YOUTUBE_FETCH_CHANNELS_SUCCESS, YOUTUBE_FETCH_CHANNELS_FAILURE } from '../store/type.js';

const initState = {
  group: "Daredemo Daisuki",
  channelIds: [],
  channels: {},
  activities: [],
  nextPageTokenActivities: {},
  nextPageTokenChannels: {},
  loadingActivities: false,
  loadingChannels: false,
  webviews: {},
}

const youtube = (state = initState, action) => {
  var {
      nextPageTokenActivities,
      nextPageTokenChannels,
      activities,
      channels,
      channelIds,
      group,
      loadingActivities,
      loadingChannels,
      webviews,
    } = state;

  switch (action.type) {
    case YOUTUBE_INIT: {
      return initState;
    }

    case YOUTUBE_RESET: {
      return {
        nextPageTokenActivities: {},
        nextPageTokenChannels: {},
        activities: [],
        channels: {},
        channelIds: [],
        group: group,
        loadingActivities: false,
        loadingChannels: false,
        webviews: {},
      };
    }

    case YOUTUBE_FETCH_ACTIVITIES_BEGIN:{
      return {
        ...state,
        loadingActivities: true,
      };
    }

    case YOUTUBE_FETCH_ACTIVITIES_SUCCESS:{
      action.payload.activitiesInput.forEach((item)=>{
        if(channelIds.indexOf(item.channelId) < 0){
          channelIds.push(item.channelId);
        }
        activities.push({
          vtubername: item.channelTitle,
          channelId: item.channelId,
          title: item.title,
          image: item.image,
          time: new Date(item.publishedAt),
          displaytime: new Date(item.publishedAt).getFullYear() + '-' + (new Date(item.publishedAt).getMonth() + 1) + '-' + (new Date(item.publishedAt).getDate()),
          videoId: item.videoId
        })
        if(item.nextPageToken){
          nextPageTokenActivities[item.channelId] = item.nextPageToken
        }
      })
      return {
        ...state,
        loadingActivities: false,
        nextPageTokenActivities:nextPageTokenActivities,
        activities:activities,
        channelIds:channelIds,
      };
    }

    case YOUTUBE_FETCH_ACTIVITIES_FAILURE:{
      return {
        ...state,
        loadingActivities: false,
      }
    }

    case YOUTUBE_FETCH_CHANNELS_BEGIN:{
      return {
        ...state,
        loadingChannels: true,
      };
    }

    case YOUTUBE_FETCH_CHANNELS_SUCCESS:{
      action.payload.channelsInput.forEach((item)=>{
        channels[item.id] = {
          title: item.title,
          description: item.description,
          image: item.image,
        }
        if(item.nextPageToken){
          nextPageTokenChannels[item.id] = item.nextPageToken
        }
      })

      return {
        ...state,
        loadingChannels: false,
        nextPageTokenChannels:nextPageTokenChannels,
        channels:channels,
      };
    }

    case YOUTUBE_FETCH_CHANNELS_FAILURE:{
      return {
        ...state,
        loadingChannels: false,
      }
    }

    case YOUTUBE_FILTER_CHANGED:{
      group = action.payload.group;
      return {
        ...state,
        group: group,
      };
    }

    case YOUTUBE_DISPLAY_WEBVIEW:{
      webviews = {};
      webviews[action.payload.title] = true;
      return {
        ...state,
        webviews: webviews,
      }
    }

    default:{
      return state;
    }
  }
}

export default youtube;
