import moment from "moment";
import"./_comment.css"
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../AuthProvider";
import {  Dropdown,  Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {  deleteCommentByPostgreSQL, updateCommentByPostgreSQL } from "../../redux/commentsSlice";
import PropTypes from 'prop-types';

export default function Comment({commentData,videoId} ) {
  console.log(commentData)

    const [userData, setUserData] = useState(null)
  const { currentUser } = useContext(AuthContext)
  const userUID = currentUser?.uid
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  //set to original comment
  const[editedComment,setEditedComment]=useState(null)
  const [showButton, setShowButton] = useState(false)
  const [isSaving,setIsSaving]=useState(false)

  const dispatch = useDispatch()


Comment.propTypes = {
  text: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  commentData: PropTypes.shape({
    snippet: PropTypes.shape({
      topLevelComment: PropTypes.object,
    }),
    user_uid: PropTypes.string, // ✅ Ensure this matches your actual data
    comment: PropTypes.string,
  }),
};

  
useEffect(() => {
  console.log('currentUser', currentUser)
     
        const fetchUserData =async () => {
          if (currentUser) {
            const userUID = currentUser?.uid
            console.log(userUID)
      const userDocRef =  doc(db, 'users', userUID)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        // console.log('userDoc', userDoc.data())
        setUserData(userDoc.data())
            } 
          }
        setLoading(false)

      }
      fetchUserData()
}, [currentUser])
  // console.log(userData)
  
  if (loading) {
    return <Spinner animation="border" variant="light" />
  }
  
    const defaultAvatar='https://static.vecteezy.com/system/resources/previews/026/434/417/original/default-avatar-profile-icon-of-social-media-user-photo-vector.jpg'

  //youtube API
    const {authorDisplayName,authorProfileImageUrl,publishedAt,textDisplay}
    = commentData?.snippet?.topLevelComment?.snippet||{}
  const { comment, createdtime,id:commentId } = commentData || {}
  
  const profileImage = authorProfileImageUrl || userData?.profileImg
const commentTime=publishedAt||createdtime
  
  const commentContent = textDisplay || comment
  const userName=authorDisplayName||`@${userData?.username}`
  //postgres
  const isAuthor=!commentData?.snippet && commentData?.user_uid === currentUser?.uid;

  const editBtnOnClick = () => {
    setEditedComment(commentData?.comment)
    setIsEditing(true)
    setShowButton(true)
  }

  const cancelBtnOnClick = () => {
    setIsEditing(false)
    setShowButton(false)
  }

  const saveBtnOnClick = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    
    const data = {
      videoId,
      commentId,
      updatedComment:editedComment,
      userUID
    }
    console.log(data)
    try {
      /*
      unwrap Method: This method is used to handle the promise returned by createAsyncThunk. It allows you to use try-catch for error handling.
Error Handling: By using unwrap, you can catch any errors that occur during the async operation.
This approach ensures that your UI updates correctly and handles any potential errors during the update process.
what is unwrap

unwrap is a method provided by Redux Toolkit's createAsyncThunk. It allows you to handle the result of a thunk action as a promise. This is useful for error handling and for performing additional actions after the thunk completes.
How unwrap Works
Promise Resolution: When you dispatch a thunk and call unwrap on the result, it returns a promise that resolves with the fulfilled action's payload or rejects with the rejected action's error.
Error Handling: This allows you to use try-catch blocks to handle errors in a more straightforward way.
      */
      await dispatch(updateCommentByPostgreSQL(data)).unwrap()
      setIsSaving(false)
    setEditedComment("")
    setIsEditing(false)
      setShowButton(false)
    } catch (error) {
          console.error("Failed to update comment:",error)
    }
  }


  const handleDeleteComment = (e) => {
    e.preventDefault()
    const data = {
      videoId,
      commentId,
      userUID
    }
    console.log("Deleting comment with data:", data); // Log the data being sent

    dispatch(deleteCommentByPostgreSQL(data))
  }

  

  { !loading && commentData!==null } {
     return (
   
    <div className="comment">
      <img src={profileImage||defaultAvatar}
        alt=""
        onError={(e) => (e.target.src = defaultAvatar)}
      /* If the URL exists but the image doesn't load, 
      ensure an onError handler is in place. This will 
      replace broken images with the defaultAvatar
      */
      />
      <div className="comment__body">
      <div className="comment__middle">
        <p className="comment__header">
          <span className="comment__username">{userName}</span>
          <span className="comment__time">{moment(commentTime).fromNow()}</span>
             </p>

             {isEditing ? (
               <form>
          <input
            value={editedComment}
            type='text'
            className='flex-grow'
            onChange={(e)=>setEditedComment(e.target.value)}
          />
                 {showButton && (
                   <div className='form__btn'>
                    <button type="button" onClick={cancelBtnOnClick}>Cancel</button>
                    <button onClick={saveBtnOnClick}>{isSaving ? <Spinner animation='border' variant='light'/>
                    :"Save"}</button>
                  </div>
          )}
                 
          </form>
             ) : (
                 <p className="comment__content">{commentContent}</p>
             )}
        
        </div>
           {!isEditing && (
             <div className="dropdown__button"> 
             <Dropdown align="end">
              <Dropdown.Toggle style={{fontSize:"12px",backgroundColor:"transparent",border:"none"}} >
              </Dropdown.Toggle>

              <Dropdown.Menu>
                 {isAuthor? (
                   <>
                     <Dropdown.Item onClick={editBtnOnClick} >Edit</Dropdown.Item>
                     <Dropdown.Item onClick={handleDeleteComment} >Delete</Dropdown.Item>
                   </>
                 ) : (
                  <Dropdown.Item>Report</Dropdown.Item>  
 
            )}
              </Dropdown.Menu>
            </Dropdown>
             
           </div>  
          ) }
           
      </div>

    </div>
  )
  }
 
}
