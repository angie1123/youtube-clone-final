import './_videoComments.css'
import Comment from '../comment/Comment'
import { useDispatch, useSelector } from 'react-redux'
import { useContext, useEffect, useRef, useState } from 'react'
import { getCommentsByVideoIdYoutubeAPI, postCommentByPostgreSQL, showCommentByPostgreSQL } from '../../redux/commentsSlice'
import { Spinner } from 'react-bootstrap'
import { AuthContext } from '../AuthProvider'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function VideoComments({ videoId }) {
  const dispatch = useDispatch()
  const { videoComments, loading } = useSelector((state) => state.comments)
  console.log( videoComments )
  //{authorDisplayName,authorProfileImageUrl,publishedAt,textDisplay}
  const[showButton,setShowButton]=useState(false)
  const { currentUser } = useContext(AuthContext)
  const [userData, setUserData] = useState(null)
  const [newComment, setNewComment] = useState(null)
  console.log(userData)
  const showPostgresCommentsOnce = useRef(false); // Ref to track if `showCommentByPostgreSQL` has been called
   
  useEffect(() => {
     console.log('currentUser', currentUser)
     
        const fetchUserData =async () => {
          if (currentUser) {
            const userUID = currentUser.uid
            console.log(userUID)
      const userDocRef =  doc(db, 'users', userUID)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        console.log('userDoc', userDoc.data())
        setUserData(userDoc.data())
      } 
    }
      }
      fetchUserData()
   }, [currentUser])
  
//   useEffect(() => {
//   console.log("Latest Comments Array:", videoComments);
// }, [videoComments]);

  useEffect(() => {
     
    if (videoId && !showPostgresCommentsOnce.current) {
      dispatch(getCommentsByVideoIdYoutubeAPI(videoId))
      dispatch(showCommentByPostgreSQL(videoId))
      showPostgresCommentsOnce.current=true
    }

  }, [videoId,dispatch])
  

//    const fetchAndShowComments = (videoId) => {
//      try {
      
//      } catch (error) {
//        console.error("Error fetching and showing comments",error)
//   }
// }


  const commentsFormOnClick = () => {
    setShowButton(true)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    setShowButton(false)
  }

  const handlePostComment = async (e) => {
    e.preventDefault()

    if (!newComment) {
      console.log("Comment is empty")
      return
    }    
    try {
      const userUID = currentUser.uid
    const data = { comment: newComment, videoId, userUID }
    console.log(data)
    dispatch(postCommentByPostgreSQL(data))
      setNewComment(null)
      setShowButton(false)
      
    } catch (error) {
      console.error("post comment error:",error)
    } 
  }
  return (
    <div className='video__comments'>
      <p>Comments</p>

      <div className='comments__form'>
        <img src={userData?.profileImg} alt=""
        className='rounded-circle mr-3'
        />

        
        <form onSubmit={handlePostComment} >
          <input
            value={newComment||""}
            onClick={commentsFormOnClick}
            type='text'
            className='flex-grow'
            placeholder='Add a comment...'
            onChange={(e)=>setNewComment(e.target.value)}
          />
          {showButton &&(
          <div className='form__btn'>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button>Comment</button>
          </div>
          )}
          </form>
          
      </div>

      <div className='comments_list' >
        {loading ? (
          <Spinner animation='border' variant='light' />
        ) :
          
          (videoComments && videoComments.length > 0 ? (
            videoComments.map((comment) => (
              <Comment key={comment.id} commentData={comment} currentUserId={currentUser?.uid} videoId={videoId}  />
            ))
          ) : (
            <p>No Comments found</p>
          ))
        }
      
    </div>
    </div>
  )
}
