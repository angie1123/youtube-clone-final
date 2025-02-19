import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import request from "../api"

export const getChannelData = createAsyncThunk(
  "videos/getChannelData",
  async () => {
    const res = await request.get('/channel')
    console.log(res)
    return res
  }
)


const channelSlice = createSlice({
  name: "channel",
  initialState: {
  channelData:{}
  },
  extraReducers:(builder)=> {
    builder
      .addCase(getChannelData.fulfilled, (state, action) => {
      state.channelData=action.payload
    })
  }
  
})

export default channelSlice.reducer