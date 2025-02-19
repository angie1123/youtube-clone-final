import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from "../api";
import axios from "axios";
// import axios from "axios";

const API_URL = `https://9f3a53d0-6f2d-4bd1-a909-f60c23bbdd52-00-idqqdijsxsxb.sisko.replit.dev`

export const getCommentsByVideoIdYoutubeAPI = createAsyncThunk(
  'comments/getCommentsByVideoIdYoutubeAPI',
  async (videoId) => {
    try {
      const { data } = await request.get('/commentThreads', {
        params: {
          part: "snippet",
          videoId
        }
      })
      console.log(data.items)
      return data.items
    } catch (error) {
      console.log(error.response.data)
    }
  }
)

export const postCommentByPostgreSQL = createAsyncThunk(
  "comments/postCommentByPostgreSQL",
  async (data ,rejectWithValue) => {
      console.log(data)
    try {
    
      // const {
      //   comment,
      //   videoId,
      //   userUID
      // }=data
      
      const response = await axios.post(`${API_URL}/comment`,  data  ) 
    console.log(response)
    return response.data
    } catch (error) {
      console.error(error)
            return rejectWithValue(error.response.data);

    }
    
  }
)

export const updateCommentByPostgreSQL = createAsyncThunk(
  "comments/updateCommentByPostgreSQL",
  async (data) => {
    
    try {
      // const updatedData = {
      //   updatedComment,
      //   userUID
      // }
      const res=await axios.put(`${API_URL}/comment/${data.videoId}/${data.commentId}`,data)
      console.log(res)
      return res.data.rows[0]
      
    } catch(error) {
      console.error(error)
    }
  }
)

export const showCommentByPostgreSQL = createAsyncThunk(
  "comments/showCommentByPostgreSQL",
  async (videoId) => {
    
      const res = await axios.get(`${API_URL}/comments/${videoId}`)
      console.log(res.data)
      return res.data
    }
)

export const deleteCommentByPostgreSQL = createAsyncThunk(
  "comments/deleteCommentByPostgreSQL",
  async ({ videoId, commentId, userUID }) => {
  console.log(videoId,commentId,userUID)
    try {
      const res = await axios.delete(`${API_URL}/comment/${videoId}/${commentId}`, { data: { userUID } }  )
      console.log(res)
      return res.data
    } catch (error) {
      console.error(error)
    }
   
  }

)

const commentsSlice = createSlice({
  name:"comments",
  initialState: {
    videoComments: [],
    loading:true
  },
  extraReducers:(builder)=> {
    builder
      .addCase(getCommentsByVideoIdYoutubeAPI.fulfilled, (state, action) => {
        state.videoComments = action.payload
        state.loading=false
      })
    
      .addCase(postCommentByPostgreSQL.fulfilled, (state, action) => {
        console.log(action.payload)
        if (action.payload) {
          state.videoComments=[action.payload,...state.videoComments]
          state.loading=false
        }
      
      })
      .addCase(updateCommentByPostgreSQL.fulfilled, (state, action) => {
        const updatedComment=action.payload
        console.log(updatedComment)
        const commentIndex = state.videoComments.findIndex((comment) => comment.id === updatedComment.id)
        if (commentIndex !== -1) {
          state.videoComments[commentIndex]=updatedComment
        }
        state.loading=false
      })
      .addCase(showCommentByPostgreSQL.fulfilled, (state, action) => {
        let comments = action.payload
        console.log(comments)
        if (comments) {
        state.videoComments = [...comments,...state.videoComments]
        console.log(action.payload.data)
        state.loading = false
        } else {
          console.log("No PostgreSQL comments found")
          state.videoComments=[...state.videoComments]
        }
       state.loading=false
      })
      .addCase(deleteCommentByPostgreSQL.fulfilled, (state, action) => {
      state.videoComments=state.videoComments.filter((comment)=>comment.id !==action.payload.rows[0].id)
    })
    
  }
})
export default commentsSlice.reducer
