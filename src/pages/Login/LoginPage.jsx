
import {  useContext, useEffect, useState } from 'react'
import { Button, Form, FormGroup } from 'react-bootstrap'
import './_loginPage.css'
// import { useDispatch, useSelector } from 'react-redux'
// import { login, signUp } from '../../redux/login/authSlice'
import { auth, db } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { authenticateYouTube } from '../../components/googleAuth/googleAuthUtils'
import { AuthContext } from '../../components/AuthProvider'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import axios from 'axios'


export default function LoginPage() {
  const [formTitle, setFormTitle] = useState('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [loading,setLoading]=useState(false)
  const navigate = useNavigate()
  const { currentUser,token } = useContext(AuthContext)
  console.log(currentUser)
  console.log(token)
  const API_URL=`https://9f3a53d0-6f2d-4bd1-a909-f60c23bbdd52-00-idqqdijsxsxb.sisko.replit.dev`
  
  useEffect(() => {
    try {

      if (currentUser ) {
      
         /*
        The replace option comes from React Router's navigation API.
        When you use navigate() from useNavigate() hook, you can pass
        an options object as the second parameter. The replace: true
        option tells the router to replace the current entry in the
        history stack instead of adding a new one.
        */
        navigate('/', { replace: true })
      }
       else{
        navigate("/login")
        return
      }

    } catch (error) {
      console.log(error)
    } 
    
  }, [currentUser, navigate,token])
  
  const toggleSignUp = () => {
    setFormTitle('SignUp')
  }

  const createDefaultProfilePicture = async (email) => {
    const firstLetter = await email.charAt(0).toUpperCase()
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=random`
  }

  const createUserInFirestoreDB = async (user) => {
    const userUID = user.uid
    const userDocRef = doc(db, 'users', userUID)
    const userDoc = await getDoc(userDocRef)
    const defaultUsername= email.split('@')[0];

    const defaultProfilePicture = await createDefaultProfilePicture(user.email)
    console.log(user)

    if (!userDoc.exists()) {
      const userFields = {
        profileImg: defaultProfilePicture,
        email: user.email,
        username:defaultUsername,
        createdAt:new Date()
      }

      await setDoc(doc(db,'users',userUID),userFields)
    
   
    }
  }
  const insertUserInPostgreUsers =async (user) => {
    const userUID = user.uid
    const userEmail=user.email
   
   
    try {
      
      const data = {
        userUID,
        email: userEmail,
      }
      const response=await axios.post(`${API_URL}/saveUser`,data)
      console.log(response.data)

      
    } catch (error) {
      console.log(error)
    }

  }

  // const insertUserInPostgreUsers=

  const handleSignUp = async(e) => {
    e.preventDefault()
    
    try {
       const res=await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log(res)
      const user=res.user
      await authenticateYouTube(false)
      await createUserInFirestoreDB(user)
      await insertUserInPostgreUsers(user)
      window.location.reload()
    }catch(error){
      console.log('Sign-up error',error)
    } 
  }

  const handleLogIn=async  (e) => {
    e.preventDefault()

   
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      await authenticateYouTube(true)
      window.location.reload()

      } catch (error) {
      console.log(error)
    }
    }
  return (
  <div className="login">
      <div className='login_container'>
        <img src="https://www.svgrepo.com/show/380993/google-logo-search-new.svg" alt="" />
        
        <div className='login_form'>
          <div className='login_title'>
            <h1>{formTitle === 'Login' ? 'Login' : 'SignUp'}</h1>
            <p>{formTitle === 'Login' ?
              'Login with your email ' :
              'SignUp with your email'}
              </p>
          </div>
          <div className='form_container'>
            <Form onSubmit={formTitle==='Login'?handleLogIn:handleSignUp}>
              <FormGroup controlId='email'>
                <Form.Control onChange={(e)=>setEmail(e.target.value)} className='form_control' type='email' placeholder='Email'/>
              </FormGroup>
               <FormGroup  controlId='password'>
                <Form.Control onChange={(e)=>{setPassword(e.target.value)}} className='form_control' type='password'placeholder='Password'/>
              </FormGroup>
              <div className='button_container'>
                <Button className='signup_button' onClick={toggleSignUp}>{formTitle === 'Login' ? 'Create account' : ''}</Button>
                <Button type='submit' >{formTitle === 'Login' ? 'Login' : 'Sign up'}</Button>
              </div>
              </Form>
          </div>
        </div>
      </div>
</div>
  )
}
