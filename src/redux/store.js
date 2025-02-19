import { configureStore } from "@reduxjs/toolkit";
// import authReducer from './login/authSlice'
import videosReducer, { relatedVideoReducer, searchVideoReducer, selectedVideoReducer } from './videoSlice'
import channelReducer from "./channelSlice"
import commentsReducer from "./commentsSlice"
export default configureStore({
  reducer: {
    // auth:authReducer
    videos: videosReducer,
    channel: channelReducer,
    selectedVideo:selectedVideoReducer,
    comments: commentsReducer,
    relatedVideo: relatedVideoReducer,
    searchVideo: searchVideoReducer
  }
})