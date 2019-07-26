import {REPORT_RESET,
  MODIFY_TAGS_BEGIN, MODIFY_TAGS_SUCCESS, MODIFY_TAGS_FAILURE,
  REPORT_FETCH_VTUBER_BEGIN, REPORT_FETCH_VTUBER_SUCCESS, REPORT_FETCH_VTUBER_FAILURE,
  REPORT_POST_SUGGESTION_BEGIN, REPORT_POST_SUGGESTION_SUCCESS, REPORT_POST_SUGGESTION_FAILURE,
} from '../store/type.js';

export const reset = () => ({
    type: REPORT_RESET
})

export const modifyTagsBegin = () => ({
    type: MODIFY_TAGS_BEGIN
})

export const modifyTagsSuccess = (input) => ({
    type: MODIFY_TAGS_SUCCESS,
    payload:{
      input: input
    }
})

export const modifyTagsFailure = () => ({
    type: MODIFY_TAGS_FAILURE
})

export const fetchVtuberBegin = () => ({
    type: REPORT_FETCH_VTUBER_BEGIN
})

export const fetchVtuberSuccess = (input) => ({
    type: REPORT_FETCH_VTUBER_SUCCESS,
    payload:{
      input: input
    }
})

export const fetchVtuberFailure = () => ({
    type: REPORT_FETCH_VTUBER_FAILURE
})

export const postSuggestionBegin = () => ({
    type: REPORT_POST_SUGGESTION_BEGIN
})

export const postSuggestionSuccess = (input) => ({
    type: REPORT_POST_SUGGESTION_SUCCESS,
    payload:{
      input: input,
    }
})

export const postSuggestionFailure = () => ({
    type: REPORT_POST_SUGGESTION_FAILURE
})
