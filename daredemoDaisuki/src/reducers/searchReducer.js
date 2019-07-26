import { SEARCH_RESET, SEARCH_VALUE, SEARCHTAB, SEARCH_RESET_DATA, SEARCH_VTUBER_REMOVE,
  SEARCH_FETCH_YOUTUBE_BEGIN, SEARCH_FETCH_YOUTUBE_SUCCESS, SEARCH_FETCH_YOUTUBE_FAILURE,
  SEARCH_FETCH_BILI_BEGIN, SEARCH_FETCH_BILI_SUCCESS, SEARCH_FETCH_BILI_FAILURE,
  SEARCH_FETCH_VTUBER_BEGIN, SEARCH_FETCH_VTUBER_SUCCESS, SEARCH_FETCH_VTUBER_FAILURE,
  SEARCH_FETCH_TWITTER_BEGIN, SEARCH_FETCH_TWITTER_SUCCESS, SEARCH_FETCH_TWITTER_FAILURE,
  SEARCH_TWITTER_END_REACHED,
} from '../store/type.js';

const perPage = 10;

const initState = {
  youtubeData: [],
  vtubersData: [],
  twitterData: [],
  biliData: [],
  loadingTwitter: false,
  loadingYoutube: false,
  loadingVtuber: false,
  loadingBili: false,
  nextPageTokenYoutube: "",
  pageVtuber: 0,
  pageBili: 1,
  twitterlimit: perPage,
  value: "",
  tab: 0,
}

const search = (state = initState, action) => {
  var {
      vtubersData,
      youtubeData,
      biliData,
      pageBili,
      twitterData,
      loadingYoutube,
      loadingTwitter,
      loadingVtuber,
      loadingBili,
      nextPageTokenYoutube,
      twitterlimit,
      pageVtuber,
      value,
      tab,
    } = state;

  switch (action.type) {
    case SEARCH_RESET: {
      return initState
    }

    case SEARCH_RESET_DATA: {
      return {
        ...state,
        loadingYoutube: loadingYoutube,
        loadingTwitter: loadingTwitter,
        loadingVtuber: loadingVtuber,
        loadingBili: loadingBili,
        value: value,
        tab: tab,
        vtubersData:[],
        youtubeData:[],
        biliData:[],
        twitterData:[],
        nextPageTokenYoutube:"",
        pageVtuber: 0,
        pageBili: 1,
        twitterlimit: perPage,
      }
    }

    case SEARCH_VALUE: {
        return {
          ...state,
          value: action.payload.value,
        }
    }

    case SEARCHTAB:{
        return {
          ...state,
          tab: action.payload.value,
        }
    }

    case SEARCH_FETCH_VTUBER_BEGIN:{
      return {
        ...state,
        loadingVtuber: true,
      };
    }

    case SEARCH_FETCH_VTUBER_SUCCESS:{
      action.payload.input.forEach((item)=>{
        vtubersData.push({
          name: item.name,
          enname:  item.enname,
          youtubeId: item.youtubeId,
          biliId: item.biliId,
          twitterId: item.twitterId,
          tags: item.tags,
          thumbnailSource: item.thumbnailSource,
        });
      })
      return {
        ...state,
        loadingVtuber: false,
        pageVtuber: pageVtuber+1,
        vtubersData: vtubersData,
      };
    }

    case SEARCH_FETCH_VTUBER_FAILURE:{
      return {
        ...state,
        loadingVtuber: false,
      };
    }

    case SEARCH_FETCH_YOUTUBE_BEGIN:{
      return {
        ...state,
        loadingYoutube: true,
      };
    }

    case SEARCH_FETCH_YOUTUBE_SUCCESS:{
      action.payload.youtubeInput.forEach((item)=>{
        var date = new Date(item.publishedAt);
        youtubeData.push({
          videoId: item.videoId,
          time: date,
          displaytime:  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())  + ' ' +  (date.getHours().toString().length === 1?"0"+date.getHours().toString():date.getHours().toString()) + ':' + (date.getMinutes().toString().length === 1?"0"+date.getMinutes().toString():date.getMinutes().toString()), 
          title: item.title,
          description: item.description,
          image: item.image,
          vtubername: item.channelTitle,
          channelId: item.channelId
        });
        if(item.nextPageToken){
          nextPageTokenYoutube = item.nextPageToken
        }
      })
      return {
        ...state,
        loadingYoutube: false,
        nextPageTokenYoutube: nextPageTokenYoutube,
        youtubeData: youtubeData,
      };
    }

    case SEARCH_FETCH_YOUTUBE_FAILURE:{
      return {
        ...state,
        loadingYoutube: false,
      }
    }

    case SEARCH_FETCH_TWITTER_BEGIN:{
      return {
        ...state,
        loadingTwitter: true,
      };
    }

    case SEARCH_FETCH_TWITTER_SUCCESS:{
      return {
        ...state,
        loadingTwitter: false,
        twitterData: action.payload.input,
      };
    }

    case SEARCH_FETCH_TWITTER_FAILURE:{
      return {
        ...state,
        loadingTwitter: false,
      }
    }

    case SEARCH_TWITTER_END_REACHED: {
      return {
        ...state,
        twitterlimit: twitterlimit + perPage,
      };
    }

    case SEARCH_FETCH_BILI_BEGIN:{
      return {
        ...state,
        loadingBili: true,
      };
    }

    case SEARCH_FETCH_BILI_SUCCESS:{
      return {
        ...state,
        loadingBili: false,
        pageBili: pageBili + 1,
        biliData: [...biliData,...action.payload.input],
      };
    }

    case SEARCH_FETCH_BILI_FAILURE:{
      return {
        ...state,
        loadingBili: false,
      }
    }

    case SEARCH_VTUBER_REMOVE:{
      return {
        ...state,
        vtubersData: vtubersData.filter((vtuber)=>vtuber.enname !== action.payload.enname)
      }
    }


    default:{
      return state;
    }
  }
}

export default search;
