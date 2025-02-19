import { FaBars } from 'react-icons/fa'
import './_header.css'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdApps, MdNotifications } from 'react-icons/md'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { Button, Modal } from 'react-bootstrap';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';


export default function Header({handleToggleSidebar}) {

const [query,setQuery]=useState('')
const navigate=useNavigate()
  const [newImg, setNewImg] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const handleOpen = () => setShowModal(true)
  const handleClose = () => setShowModal(false)
  const { currentUser }=useContext(AuthContext)
  const [userData,setUserData]=useState(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/search/${query}`)

  }

  const handleUpdateProfile = async () => {
    let updatedImgURL;
    if (newImg) {
      const imgRef = ref(storage, `users/${currentUser.uid}/profileImages//${newImg.name}`)
      await uploadBytes(imgRef, newImg)
      updatedImgURL=await getDownloadURL(imgRef)
    }

    const userDocRef = doc(db, 'users', currentUser.uid)
    const updatedData = {
      ...userData,
      profileImg:updatedImgURL||userData.profileImg
    }
    await updateDoc(userDocRef, updatedData)
    setUserData(updatedData)
    handleClose()
  }
  // const handleImgOnSubmit = (e) => {
  //   handleClose()
  //   setNewImg(e.target.value)
  // }

 console.log(userData?.profileImg)
  

  useEffect(() => {
    console.log('currentUser', currentUser)
    
      const fetchUserData =async () => {
        if (currentUser) {
          const userUID = currentUser.uid
          console.log(userUID)
    const userDocRef = doc(db, 'users', userUID)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      console.log('userDoc', userDoc)
      setUserData(userDoc.data())
    }
  }
    }
    
    fetchUserData()
  },[currentUser])

  
  console.log(userData)

  return (
    <>
    <div className='border border-dark header'>
      
      {/* hamburger icon */}
      <FaBars className='header_menu' size={15}
        onClick={()=>handleToggleSidebar()} />
    <div className='title_container'>
      <img
        src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_(2017).svg/2560px-YouTube_full-color_icon_(2017).svg.png'
        alt='youtube-icon'
            className='header_logo'
            onClick={()=>{navigate("/")}}

      />
      <span className='_title'>YouTube</span>
    </div>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Search' value={query} onChange={(e)=>setQuery(e.target.value)}/>
        <button type='submit'>
          <AiOutlineSearch size={22}/>{/*render a magnifying glass */}
        </button>
      </form>

      <div className='header_icons'>
        <MdNotifications size={22} />
        <MdApps size={22} />
        <img onClick={handleOpen} className="profile__pic" src={userData?.profileImg} alt="" />    
      </div>
    </div>


    {/* picture edit modal */}
      <Modal  className='modal' show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Picture</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input type="file" accept="image/*" onChange={(e)=>setNewImg(e.target.files[0])}/>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateProfile}>Save Change</Button>
        </Modal.Footer>
        
    </Modal>
    
    </>
    
  )
}
