import {
  FETCH_IMAGE_BEGIN_YOUTUBE, FETCH_IMAGE_SUCCESS_YOUTUBE, FETCH_IMAGE_FAILURE_YOUTUBE, FETCH_IMAGE_SUCCESS_YOUTUBESCREEN,
  FETCH_IMAGE_BEGIN_TWITTER, FETCH_IMAGE_SUCCESS_TWITTER, FETCH_IMAGE_FAILURE_TWITTER,
  FETCH_IMAGE_BEGIN_BILI, FETCH_IMAGE_SUCCESS_BILI, FETCH_IMAGE_FAILURE_BILI, FETCH_IMAGE_SUCCESS_BILISCREEN,
  FETCH_VTUBERS_BEGIN, FETCH_VTUBERS_SUCCESS, FETCH_VTUBERS_FAILURE,
  VTUBER_INIT,
   } from '../store/type.js';

const initState = {
  vtubers: [],
  vtubersDict: {},
  ennameDictYoutube:{},
  ennameDictTwitter:{},
  ennameDictBili:{},
  vtubersImage: {},
  youtubeImage: {},
  biliImage: {},
  loadingVtubers: false,
  loadingImageYoutube: false,
  loadingImageTwitter: false,
  loadingImageBili: false,
  fetchFailure: false,//api key error indicator
}

const vtuber = (state = initState, action) => {
  var {
      vtubers,
      vtubersImage,
      youtubeImage,
      biliImage,
      vtubersDict,
      ennameDictYoutube,
      ennameDictTwitter,
      ennameDictBili,
      loadingVtubers,
      loadingImageYoutube,
      loadingImageTwitter,
      loadingImageBili,
      fetchFailure,
    } = state;

  switch (action.type) {
    case VTUBER_INIT: {
      return initState;
    }
    case FETCH_IMAGE_BEGIN_YOUTUBE: {
      return {
        ...state,
        loadingImageYoutube: true,
      }
    }
    case FETCH_IMAGE_SUCCESS_YOUTUBE: {
      action.payload.input.forEach((vtuber)=>{
        vtubersImage[vtuber.enname] = vtuber.image;
        youtubeImage[vtuber.youtubeId] = vtuber.image;
      })
      return {
        ...state,
        vtubersImage: vtubersImage,
        youtubeImage: youtubeImage,
        loadingImageYoutube: false,
      }
    }
    case FETCH_IMAGE_SUCCESS_YOUTUBESCREEN: {
      action.payload.input.forEach((vtuber)=>{
        youtubeImage[vtuber.id] = vtuber.image;
      })
      return {
        ...state,
        youtubeImage: youtubeImage,
        loadingImageYoutube: false,
      }
    }
    case FETCH_IMAGE_FAILURE_YOUTUBE: {
      return {
        ...state,
        fetchFailure: !fetchFailure,
        loadingImageYoutube: false,
      }
    }
    case FETCH_IMAGE_BEGIN_TWITTER: {
      return {
        ...state,
        loadingImageTwitter: true,
      }
    }
    case FETCH_IMAGE_SUCCESS_TWITTER: {
      action.payload.input.forEach((vtuber)=>{
        vtubersImage[vtuber.enname] = vtuber.profile_image_url;
      })
      return {
        ...state,
        vtubersImage: vtubersImage,
        loadingImageTwitter: false,
      }
    }
    case FETCH_IMAGE_FAILURE_TWITTER: {
      return {
        ...state,
        fetchFailure: !fetchFailure,
        loadingImageTwitter: false,
      }
    }
    case FETCH_IMAGE_BEGIN_BILI: {
      return {
        ...state,
        loadingImageBili: true,
      }
    }
    case FETCH_IMAGE_SUCCESS_BILI: {
      action.payload.input.forEach((vtuber)=>{
        vtubersImage[vtuber.enname] = vtuber.image;
        biliImage[vtuber.biliId] = vtuber.image;
      })
      return {
        ...state,
        vtubersImage: vtubersImage,
        biliImage: biliImage,
        loadingImageBili: false,
      }
    }
    case FETCH_IMAGE_SUCCESS_BILISCREEN: {
      action.payload.input.forEach((vtuber)=>{
        biliImage[vtuber.mid] = vtuber.image;
      })
      return {
        ...state,
        biliImage: biliImage,
        loadingImageBili: false,
      }
    }
    case FETCH_IMAGE_FAILURE_BILI: {
      return {
        ...state,
        loadingImageBili: false,
      }
    }
    case FETCH_VTUBERS_BEGIN: {
      return {
        ...state,
        loadingVtubers: true,
      }
    }
    case FETCH_VTUBERS_SUCCESS: {
      action.payload.input.forEach(vtuber=>{
        vtubersDict[vtuber.enname] = {
          enname: vtuber.enname,
          name: vtuber.name,
          biliId:vtuber.biliId,
          twitterId:vtuber.twitterId,
          youtubeId:vtuber.youtubeId,
          tags: vtuber.tags,
          thumbnailSource: vtuber.thumbnailSource,
        };
        ennameDictYoutube[vtuber.youtubeId] = vtuber.enname;
        ennameDictTwitter[vtuber.twitterId] = vtuber.enname;
        ennameDictBili[vtuber.biliId] = vtuber.enname;
      })
      return {
        ...state,
        vtubers: action.payload.input,
        vtubersDict: vtubersDict,
        loadingVtubers: false,
      }
    }
    case FETCH_VTUBERS_FAILURE: {
      return {
        ...state,
        loadingVtubers: false,
      }
    }
    default:{
      return state;
    }
  }
}

export default vtuber;
