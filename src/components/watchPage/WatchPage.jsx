// import { Col, Row, Spinner } from "react-bootstrap";
// import VideoMetaData from "../../components/videoMetaData/VideoMetaData";
// import"./_watchPage.scss"
// import VideoComments from "../../components/videoComments/VideoComments";
// import VideoRecommend from "../../components/videoRecommend/VideoRecommend";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect} from "react";
// import {  getRelatedVideo, getVideoById } from "../../redux/videoSlice";
// import axios from "axios";


// export default function WatchPage() {
//   const {id} =useParams()//get id from the page link
//   const dispatch = useDispatch()
//   // // const currentVideo =useSelector((state)=>state.selectedVideo.videoData)
//   // console.log(currentVideo)
//   const { videoData ,loading} = useSelector((state) => state.selectedVideo)
//   console.log(videoData)  

//   const relatedVideos=useSelector((state)=>state.relatedVideo.relatedVideos)
//   const relatedVideoLoadingState = useSelector((state) => state.relatedVideo.loading)
  
//   console.log(relatedVideos)

  
  
//   useEffect(() => {
    
// const addVideoToPostgresVideos = async (id) => {
//     try {
//       if (videoData ) {
//         const  = `https://6c97eb16-9710-4020-ab16-b5236f8deaab-00-1be2jkif0fd6q.sisko.replit.dev`
//         const videoTitle = videoData?.snippet.localized.title
//         console.log(videoTitle)
//         const res = await axios.post(`${API_URL}/addVideo/${id}`, { videoTitle } )
  
//         console.log(res)
//       }
       
//     } catch (error) {
//       console.log(error)
//   }
//     }
//       addVideoToPostgresVideos(id)

// },[videoData,id])

//   useEffect(() => {
//     dispatch(getVideoById(id))
//     // dispatch(getRelatedVideo(videoCategoryId))
//   }, [dispatch, id])

//   useEffect(() => {
//   if (videoData?.snippet?.categoryId) {
//     dispatch(getRelatedVideo(videoData.snippet.categoryId));
//   }
// }, [dispatch, videoData]);
  
  
//   if (loading || !videoData) {
//   return <Spinner variant="light" animation="border" />;
//   }
//   // console.log(videoData)
  
   

//      return (
//       <Row >
//       <Col lg={8}>
//         <div className="watchPage__player">
//           <iframe
//             src={`https://www.youtube.com/embed/${id}`}
//             title="example"
//             width={"100%"}
//             height={"100%"}
//           />
//         </div>
        
//         <VideoMetaData />
//         <VideoComments videoId={id} />
//       </Col>
//       <Col lg={4}>
//            {
//              !relatedVideoLoadingState && relatedVideos ? (
//                relatedVideos.map((video) => (
//                  <VideoRecommend key={video.id} relatedVideo={video}
//  />
//              ))  
//              ) : (
//                 <Spinner variant="light" animation="border" />
//              )
//             }
//       </Col>
//     </Row>
//   ) 
 
// }
