import moment from "moment"
import"./_videoMetaData.css"
import numeral from "numeral"
import {  MdShare, MdThumbDown, MdThumbUp } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getChannelData } from "../../redux/videoSlice"
import ClampLines from "react-clamp-lines"
export default function VideoMetaData() {

  const videoData = useSelector((state) => state.selectedVideo.videoData)
  // console.log(videoData)

  const channelData = useSelector((state) => state.selectedVideo.channelData)
  // console.log(channelData)

  const dispatch = useDispatch()
  
  useEffect(() => {
    if (videoData?.snippet?.channelId) {
      dispatch(getChannelData(videoData.snippet.channelId));
    }
  }, [dispatch, videoData]);
  
  if (!videoData) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }
  const { channelTitle, publishedAt } = videoData.snippet
  const { title, description } = videoData.snippet.localized
  const { viewCount, likeCount } = videoData.statistics
  console.log(publishedAt)
  

return (
    <div className="videoMetaData py-2">
      <div className="videoMetaData__top">
        <h5>{title}</h5>
      </div>
      <div className="videoMetaData__channel d-flex justify-content-between align-items-center my-2 py-3">
        <div className="left__side">
          <img 
            src={channelData?.snippet?.thumbnails.default.url}
            className="rounder-circle mr-3"
          />
          <div className="channel-details">
            <span className="channel-title">{channelTitle}</span>
            <span className="subscribe-data">{numeral(channelData?.statistics?.subscriberCount).format('0.a')} subscribers</span>
          </div>
        </div>
        
         <div className="right__side" >
          <div className="channel-group-btn">
          {/* <button>
            Join
          </button> */}
          <button className="btn-subscribe ">
            Subscribe
            </button>
            
          </div>
         
          <div className="video-related-btn">

            <button className="btn-thumbs" >
              <span className="mx-2">
            <MdThumbUp size={16}  /> {numeral(likeCount).format('0.a')}
              </span>
                <div className="separator">|</div>

          <span className="mx-2">
            <MdThumbDown size={16}/>
          </span>
            </button>

            <button>
              <span >
                <MdShare />Share
              </span>
            </button>

             {/* <button>
              <span >
                <MdDownload className="mr-3"/>Download
              </span>
            </button> */}

             <button>
              <span>  <i className="bi bi-three-dots"></i> </span>
              </button>
          </div>
          
          </div>
      </div>
      <div className="videoMetaData__description">
        <div className="watch-info">
        <span className="mr-10rem">{numeral(viewCount).format('0.a')} views</span>
        <span>{moment(publishedAt).fromNow()}</span>
        </div>

        
       <ClampLines
  text={description}
  lines={2}
  ellipsis="...more"
  moreText="Show more"
  lessText="Show less"
  className="description-content"
  innerElement="p"
/>
        </div>

    </div>
  )
}


  

  
 
  
 
  