import {REPORT_RESET,
  MODIFY_TAGS_BEGIN, MODIFY_TAGS_SUCCESS, MODIFY_TAGS_FAILURE,
  REPORT_FETCH_VTUBER_BEGIN, REPORT_FETCH_VTUBER_SUCCESS, REPORT_FETCH_VTUBER_FAILURE,
  REPORT_POST_SUGGESTION_BEGIN, REPORT_POST_SUGGESTION_SUCCESS, REPORT_POST_SUGGESTION_FAILURE,
} from '../store/type.js';

const initState = {
  loading: false,
  loadingSuggestion: false,
  vtubers: [],
  suggestions: [],
}

const search = (state = initState, action) => {
  var {
    loading,
    loadingSuggestion,
    vtubers,
    suggestions,
    } = state;

  switch (action.type) {
    case REPORT_RESET: {
      return initState
    }

    case MODIFY_TAGS_BEGIN: {
      return {
        ...state,
        loadingSuggestion: true,
      }
    }

    case MODIFY_TAGS_SUCCESS: {
      return {
        ...state,
        suggestions: [...suggestions,...[action.payload.input]],
        loadingSuggestion: false,
      }
    }

    case MODIFY_TAGS_FAILURE: {
      return {
        ...state,
        loadingSuggestion: false,
      }
    }

    case REPORT_FETCH_VTUBER_BEGIN:{
      return {
        ...state,
        loading: true,
      };
    }

    case REPORT_FETCH_VTUBER_SUCCESS:{
      vtubers = [];
      action.payload.input.forEach((item)=>{
        vtubers.push({
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
        loading: false,
        vtubers: vtubers
      };
    }

    case REPORT_FETCH_VTUBER_FAILURE:{
      return {
        ...state,
        loading: false,
      };
    }

    case REPORT_POST_SUGGESTION_BEGIN:{
      return {
        ...state,
        loadingSuggestion: true,
      };
    }

    case REPORT_POST_SUGGESTION_SUCCESS:{
      return {
        ...state,
        suggestions: [...suggestions,...[action.payload.input]],
        loadingSuggestion: false,
      };
    }

    case REPORT_POST_SUGGESTION_FAILURE:{
      return {
        ...state,
        loadingSuggestion: false,
      };
    }

    default:{
      return state;
    }
  }
}

export default search;
