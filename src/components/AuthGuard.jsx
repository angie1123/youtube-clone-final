// import {  useContext, useEffect} from 'react'
// import { AuthContext } from './AuthProvider'
// import { useNavigate } from 'react-router-dom'
// import { Spinner } from 'react-bootstrap'

// export default function AuthGuard({children}) {
  
//   const {currentUser}=useContext(AuthContext)
//   const navigate = useNavigate()
  
//   useEffect(() => {
//     if (!currentUser) {
//       navigate('/login')
//     }
//   })
  
//   return currentUser ? <Spinner className='loading'/> : children
// }
