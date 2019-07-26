import {
  FETCH_IMAGE_BEGIN_YOUTUBE, FETCH_IMAGE_SUCCESS_YOUTUBE, FETCH_IMAGE_FAILURE_YOUTUBE, FETCH_IMAGE_SUCCESS_YOUTUBESCREEN,
  FETCH_IMAGE_BEGIN_TWITTER, FETCH_IMAGE_SUCCESS_TWITTER, FETCH_IMAGE_FAILURE_TWITTER,
  FETCH_IMAGE_BEGIN_BILI, FETCH_IMAGE_SUCCESS_BILI, FETCH_IMAGE_FAILURE_BILI, FETCH_IMAGE_SUCCESS_BILISCREEN,
  FETCH_VTUBERS_BEGIN, FETCH_VTUBERS_SUCCESS, FETCH_VTUBERS_FAILURE,
  VTUBER_INIT,
   } from '../store/type.js';

export const vtuberInit = () => ({
    type: VTUBER_INIT,
})

export const fetchImageBeginYoutube = () => ({
  type: FETCH_IMAGE_BEGIN_YOUTUBE,
})

export const fetchImageSuccessYoutube = (input) => ({
  type: FETCH_IMAGE_SUCCESS_YOUTUBE,
  payload: {
    input: input
  }
})

export const fetchImageSuccessYoutubeScreen = (input) => ({
  type: FETCH_IMAGE_SUCCESS_YOUTUBESCREEN,
  payload: {
    input: input
  }
})

export const fetchImageFailureYoutube = () => ({
  type: FETCH_IMAGE_FAILURE_YOUTUBE,
})

export const fetchImageBeginTwitter = () => ({
  type: FETCH_IMAGE_BEGIN_TWITTER,
})

export const fetchImageSuccessTwitter = (input) => ({
  type: FETCH_IMAGE_SUCCESS_TWITTER,
  payload: {
    input: input
  }
})

export const fetchImageFailureTwitter = () => ({
  type: FETCH_IMAGE_FAILURE_TWITTER,
})

export const fetchImageBeginBili = () => ({
  type: FETCH_IMAGE_BEGIN_BILI,
})

export const fetchImageSuccessBili = (input) => ({
  type: FETCH_IMAGE_SUCCESS_BILI,
  payload: {
    input: input
  }
})

export const fetchImageSuccessBiliScreen = (input) => ({
  type: FETCH_IMAGE_SUCCESS_BILISCREEN,
  payload: {
    input: input
  }
})

export const fetchImageFailureBili = () => ({
  type: FETCH_IMAGE_FAILURE_BILI,
})

export const fetchVtubersBegin = () => ({
  type: FETCH_VTUBERS_BEGIN,
})

export const fetchVtubersSuccess = (input) => ({
  type: FETCH_VTUBERS_SUCCESS,
  payload: {
    input: input,
  }
})

export const fetchVtubersFailure = () => ({
  type: FETCH_VTUBERS_FAILURE,
})
