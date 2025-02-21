// import { createContext, useEffect, useState } from "react";
// import { auth } from "../firebase";
// import { getAccessToken } from "./googleAuth/googleAuthUtils";
// import PropTypes from "prop-types";

// export const AuthContext  =createContext()

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [token, setToken] = useState(null)
  
//   const refreshToken = async () => {
//     console.log('refreshing token executed')
//     try {
//       /*getAccessToken return youtube_access_token  if currentDate < than expiry date
//       otherwise it call the authenticateYouTube function again
//       */
//       const newToken = await getAccessToken()
//       if (newToken) {
//         setToken(newToken)
//       }
//     } catch (error) {
//       console.log('Failed to refresh token:', error)
//     }
//   }
//   useEffect(() => {
//     /*
//     When you call unsubscribe() in the AuthProvider component,
//      it stops the Firebase authentication state listener that
//       was set up with auth.onAuthStateChanged. This means that
//       the application will no longer receive updates about changes
//        to the authentication state (e.g., when a user logs in or out).
//     */
//     const unsubsribe=auth.onAuthStateChanged((user) => {
//         setCurrentUser(user)
//     })


//     // const interval = setInterval(() => { refreshToken() },15*60*1000)//refresh every 15 minutes
//     const checkTokenExpiry = () => {
//       const tokenExpiry = localStorage.getItem('youtube_token_expiry')
//       console.log(`checkTokenExpiry executed ${tokenExpiry}`)
//       if (Date.now() >= tokenExpiry) {
//         refreshToken()
//           .then(() => {
//             const newExpiry = localStorage.getItem('youtube_token_expiry')
//             scheduleTokenCheck(newExpiry)
//         })
//       } else {
//         scheduleTokenCheck(tokenExpiry)
//       }
//     }


    
//     const scheduleTokenCheck = (expiryTime) => {
//       const timeLeftToExpiry = expiryTime - Date.now()
//       /*
//       The setTimeout function accepts two main parameters:
//       Function: The function to be executed after the timer expires.
//       Delay: The time in milliseconds to wait before executing the function.
//       */
//       //run checkTokenExpiry function again after timeLeftToExpiry
//       setTimeout(checkTokenExpiry, timeLeftToExpiry)
//     }

//     checkTokenExpiry()

//     return () => {
//       /*By setting loading to false before calling unsubscribe,
//       you ensure that the app is no longer in a loading state
//        when the component unmount */
//       setLoading(false)
//       // clearInterval(interval)
//       unsubsribe()
//     }
//   }, [])
  
//   const value={currentUser,token}//destructure currentUser and pass in to value
  
//   return (
//     <>
//       <AuthContext.Provider value={value }>
//         {!loading&& children}
//     </AuthContext.Provider>
//     </>
//       )
// }

// AuthProvider.propTypes = {
//        children: PropTypes.node.isRequired, // Ensure children is required
//    };




import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { loadGisScript, getAccessToken } from "./googleAuth/googleAuthUtils";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Used correctly
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await loadGisScript(); // ✅ Ensure GIS loads
        console.log("✅ GIS Script Loaded");

        const newToken = await getAccessToken(); // ✅ Get YouTube token
        if (newToken) {
          setToken(newToken);
        }

        // Firebase Auth State Listener
        const unsubscribe = auth.onAuthStateChanged((user) => {
          setCurrentUser(user);
          setLoading(false); // ✅ Only set to false when everything is ready
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false); // ✅ Ensure it stops loading even if error occurs
      }
    };

    initializeAuth();
  }, []);

  const value = { currentUser, token };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <p>Loading...</p>} {/* ✅ Prevent rendering until ready */}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
       children: PropTypes.node.isRequired, // Ensure children is required
   };
