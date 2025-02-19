import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from '../api'
export const getPopularVideos = createAsyncThunk(
  "videos/getPopularVideos",
  async (_, { rejectWithValue,getState }) => {
    try {
      const res = await request.get('/videos', {
        params: { 

          part: "snippet,contentDetails,statistics",
          chart: "mostPopular",
          regionCode: "MY",
          maxResults: 20,  // limit to 50 items  per request
          pageToken: getState().videos.nextPageToken
        }
      });
      console.log(res)
      // console.log(res.data.items)

      return {
        videos: res.data.items,
        nextPageToken: res.data.nextPageToken,
        category:'All'
      }
    } catch (error) {
     console.log(error)
      return rejectWithValue(error.message);
    }
  }
);

export const getChannelIcon = createAsyncThunk(
  "videos/getChannelIcon",
  async (channelId,{rejectWithValue}) => {
    try {
      const { data: { items } } = await request.get('/channels', {
        params: {
          part:'snippet',
          id: channelId
        }
      })
      // console.log(items[0])
      return items[0]
    } catch (error) {
      return rejectWithValue(error.message)
    }   
  })

export const getVideosByCategory = createAsyncThunk(
  "videos/getVideoByCategory",
  /*
  In the createAsyncThunk function, the first parameter is the
  input argument passed when the thunk is dispatched, and the
  second parameter is an object containing additional utilities
  provided by Redux Toolkit.
   */
  async (keyword, { getState,rejectWithValue }) => {
    try {
     
      
      /*Endpoint: /search is used to search for
       YouTube videos.
      */
      
      const {nextPageToken}=getState().videos
      const res = await request('/search', {
        params: {
          part: 'snippet',
          maxResults: 20,
          //pageToken =current retrieving PageToken
          //api will automatically return nextPageToken after fetching currentpage
          pageToken:nextPageToken,
          /*The q parameter in the YouTube Data API is typically
           used as a search query parameter. It allows you to 
           specify a text string to search for videos, playlists,
           or channels that match the query. */
          q: keyword,
          type:'video'
        }
      })
      console.log(res)
      // loop through items array in data get the video id of each item
      const videoIds = res.data.items.map(item => item.id.videoId).join(',');

      // Get full video details
      /*
      data: Original property name in the object.
      videoData: The new variable name you want to use.
      */
      const { data: videoData } = await request.get('/videos', {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoIds,//retrieve all videos in videoIds
        }
      });
      console.log(videoData)

      
      return {
        videos: videoData,
        nextPageToken: res.data.nextPageToken,
        category: keyword,
      };
    }catch (error) {
    console.log(error)
      return rejectWithValue(error.message)
    }
  }
)
  
export const getVideoById = createAsyncThunk(
  'selectedVideo/getVideoById',
  async (id) => {
    try {
      const {data}=await request.get('/videos', {
        params: {
          part: 'snippet,statistics',
          id
        }
      })
      console.log(data.items[0])
      return data.items[0]
    } catch(error) {
      console.log(error)
    }
  }
)

export const getChannelData = createAsyncThunk(
  'selectedVideo/getChannelData',
  async (id) => {
    try {
      const response=await request.get('/channels', {
        params: {
          part: 'snippet,statistics,contentDetails',
          id   
        }
      })
      console.log(response)
      return response.data.items[0]
    } catch (error) {
      console.log(error)
    }
  }
)

export const getRelatedVideo = createAsyncThunk(
  'relatedVideo/getRelatedVideo',
  async ({videoCategoryId}) => {
    try {
      const { data } = await request.get('/search', {
      params: {
        part: 'snippet',
        videoCategoryId,
        maxResults: 20,
        type:'video'
      }
    })
      // console.log(data)
      
      //filter out the videoId and join together
      const videoIds = data.items.map(item => item.id.videoId).join(',');

      // Get full video details
      /*
      data: Original property name in the object.
      videoData: The new variable name you want to use.
      */
      //{ data: videoData } 
      const {data:videosData} = await request.get('/videos', {
        params: {
          part: 'snippet,contentDetails,statistics',

          id: videoIds,//retrive specific video based on videoIds
        }
      });
      console.log(videosData.items)
    return videosData.items
      
    } catch (error) {
      console.log(error)
    }
  }
)



export const getVideosBySearch = createAsyncThunk(
  'searchVideos/getVideosBySearch',
  async (keyword,{getState}) => {
    try {
      const{nextPageToken}=getState().searchVideo
      const res = await request.get('/search',
        {
          params: {
            part: 'snippet',
            maxResults: 25,
            q: keyword,
            type: "video",
            pageToken:nextPageToken
        }
        })
      console.log(res)

      const videoIds = res.data.items.map(item => item.id.videoId).join(',')
      
      const { data: videoData } = await request.get('/videos', {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoIds,
          category:keyword
        }
        
      })
      console.log(videoData)
console.log(videoData)
      return {
        videos: videoData,
        nextPageToken: res.data.nextPageToken,
        category:keyword
      }
    } catch (error) {
      console.log(error)
    }
  }
)



const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    /*
    With an object {}, you can directly access the icon using the channel ID
    as a key - O(1) time complexity:
    
    With an array [], you'd need to iterate through the entire array to find
    a specific channel's icon:
    */
    channelIcons: {},//store icons for each channel by id
    loading: true,
    nextPageToken: null,
    activeCategory:'All'
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(getPopularVideos.fulfilled, (state, action) => {
        const { videos, nextPageToken,category } = action.payload
        

        if (state.activeCategory === category) {
          //create an array which key is video.id ,and value is video object
          const videoMap = new Map(state.videos.map(video => [video.id, video]))
          videos.forEach(video => {
            //if videos doesnt have video.id
            if (!videoMap.has(video.id)) {
              videoMap.set(video.id, video)//set current video.id as key and object as value
            }
          })
          state.videos=Array.from(videoMap.values())
        } else {
          state.videos=videos
        }
        
        state.nextPageToken = nextPageToken
        state.loading = false
        // console.log(state.videos)
      

      })
    
      .addCase(getChannelIcon.fulfilled, (state, action) => {
        //store channel icon by id
        //Dynamically add a key-value pair
        state.channelIcons[action.payload.id] = action.payload.snippet.thumbnails.default.url
        /*
          channelIcons[action.payload.id] ="UC123": { data: {...} },

          channelIcons={
          "UC123": { data: {...} },
          ...
          }
        */
      })
    
      .addCase(getVideosByCategory.fulfilled, (state, action) => {
      const{videos,nextPageToken,category}=action.payload
      state.videos = videos.items;
      state.loading = false;
      state.nextPageToken = nextPageToken;
      state.category = category;
      })
    
      
  }
})

const selectedVideoSlice = createSlice({
  name: 'selectedVideo',
  initialState: {
    loading: true,
    videoData: null,
    channelData:null
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.videoData = action.payload
        state.loading=false
      })
    
    .addCase(getChannelData.fulfilled, (state, action) => {
    state.channelData=action.payload
  })
  }
})


const relatedVideoSlice = createSlice({
  name: 'relatedVideo',
  initialState: {
    loading:true,
    relatedVideos:[]
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRelatedVideo.fulfilled, (state, action) => {
        state.relatedVideos = action.payload
        state.loading=false
    })
  }
  
})

const searchVideoSlice = createSlice({
  name: 'searchVideo',
  initialState: {
    searchedVideos: [],
    channelIcons: {},
    loading: true,
    nextPageToken: null,
    category:null
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVideosBySearch.fulfilled, (state, action) => {
        const { videos, nextPageToken,category } = action.payload
      
          state.searchedVideos = videos.items
          state.category=category
          state.nextPageToken = nextPageToken
          state.loading=false
      })
    
      .addCase(getChannelIcon.fulfilled, (state, action) => {
        state.channelIcons[action.payload.id] = action.payload.snippet.thumbnails.default.url
        //state.channelIcons[action.payload.id] = action.payload.snippet.thumbnails.default.url

    })
  }
 
})


export const searchVideoReducer=searchVideoSlice.reducer
export const relatedVideoReducer=relatedVideoSlice.reducer
export const selectedVideoReducer=selectedVideoSlice.reducer
export default videoSlice.reducer