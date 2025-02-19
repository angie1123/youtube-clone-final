import { Nav } from 'react-bootstrap'
import './_sidebar.css'
import {
  MdSubscriptions,
  // MdHistory,
  MdHome,
  // MdPlaylistPlay,
  MdVideoLibrary,
  MdWatchLater,
  MdThumbUp,
} from "react-icons/md"
import { SiYoutubeshorts } from 'react-icons/si'
// import { BiFontSize } from 'react-icons/bi'
import { BsArrowRight } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'


export default function Sidebar({sidebar,handleToggleSidebar}) {
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await auth.signOut()//wait for signout before continue
    navigate('/login')
 }
  return (
    <Nav className={sidebar ? "sidebar open" : "sidebar"}
    onClick={()=>handleToggleSidebar(false)}
    >
      <li onClick={ ()=>navigate("/") }>
        <MdHome  size={23} />
        <span>Home</span>
      </li>
      <li>
       <SiYoutubeshorts size={23} />
        <span>Shorts</span>
      </li>
      <li>
       <MdSubscriptions size={23}/>
        <span>Subscriptions</span>
      </li>
      
      <hr className='break_line'/>
      
    <li>
        You
        <span>
          <BsArrowRight/>
        </span>
    </li>
      <li>
       <MdVideoLibrary size={23} />
        <span>Playlists</span>
      </li>
      <li>
       <MdWatchLater size={23} />
        <span>Playlists</span>
      </li>
      <li>
       <MdThumbUp size={23} />
        <span>Playlists</span>
      </li>

      <hr className='break_line' />
      
      <li onClick={handleLogout}>
        <BiLogOut size={23} />
        <span >Logout</span>
      </li>
    </Nav>
  )
}
