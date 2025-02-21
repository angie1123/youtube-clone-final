
// //Dynamically loads the Google Identity Services (GIS) JavaScript library into your application.
// export const loadGisScript = () => {
//   return new Promise((resolve, reject) => {
//     //Checks if the GIS Library is Already Loaded:
//     /*If window.google and window.google.accounts exist,
//      the GIS library is already available, so it resolves the promise immediately.
//     */
//     /*
//     window.google and window.google.accounts are objects provided
//     by the GIS client library after it has been loaded successfully
    
//     window.google act as namespace(CONTAINER OR DEFINE SCOPE) for all google services loaded into current browser windoow.
//     it contain properties and method provided by various google library including GIS

//     window.google.accounts-
//     -is a global object created by the GIS library after it is successfully loaded.
//     -is a sub-object under window.google specifically for GIS functioality
//     -contain methods and properties to manage user authentication and authorization,
//     such as initiating the sign-in process or configure One Tap login
//     */
//     if (window.google && window.google.accounts) {
//     console.log("GIS library already loaded")
//       resolve(window.google.accounts);//resolve is function provided by promise constructor
//       return;
//     }
//     console.log("loading google identity services...")
//     //if library not yet load, it create <script> element with src and set to  GIS library

//     const script = document.createElement('script');
//     script.src = 'https://accounts.google.com/gsi/client';
//     /*The async attribute tells the browser to download the JavaScript file
//     asynchronously(in parallel with other resources), and execute it as soon as it is downloaded.*/
//     script.async = true;
//     script.defer = true;//The script will not execute until the entire HTML document is fully parsed
    
//     /*
//     The promise is resolved with the value window.google.accounts.
//     This means the GIS library is fully loaded, and the functionality
//      provided by window.google.accounts is now available for use. */
//     script.onload = () => {
//       console.log("Google API loaded successfully!")
//       resolve(window.google.accounts)
//     };
//     script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
//     document.head.appendChild(script);
//   });
// };



// export const authenticateYouTube = async ({skipPrompt='false'}) => {
//  let tokenClient = null;
//   try {
//     const accounts = await loadGisScript();
    
//     return new Promise((resolve, reject) => {
//       if (!tokenClient) {
//         // accounts.oauth2.initTokenClient Initializes an OAuth 2.0 token client using the GIS library.
//         tokenClient = accounts.oauth2.initTokenClient({
//           client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
//           scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
//           /*The callback in the initTokenClient configuration is a function
//            that is executed automatically when Google's OAuth 2.0 server sends
//             a response after the token request. This response is the outcome of the OAuth flow,
//              and the callback processes this result.
//           */
//           callback: (response) => {
//             console.log('Callback function executed')
//             if (response && response.access_token) {
//               const tokenExpiryTime = Date.now() + response.expires_in * 1000;
//               console.log('token expiry:', tokenExpiryTime)
//               localStorage.setItem('youtube_access_token', response.access_token);
//               localStorage.setItem('youtube_token_expiry', tokenExpiryTime);
//               resolve(response.access_token);
//             } else {
//               reject(new Error('Failed to get access token'));
//             }
//           },
//         });
//       }
      
//       /*
//       If you skip tokenClient.requestAccessToken, the following will happen:

//       The OAuth flow will not be triggered.
//       Google will not prompt the user to log in or grant permissions.
//       No access token will be retrieved.
//       Your app will not be authenticated or able to call APIs that require an access token.
//       Including requestAccessToken is critical for completing the OAuth flow and retrieving the access token.
//       */
//       tokenClient.requestAccessToken({
//         /*
//         skipPrompt: A boolean parameter to control whether the consent screen is skipped:
//         true: Skip showing the consent screen (if permissions were previously granted).
//         false: Show the consent screen to the user.
//         */
//         prompt:skipPrompt ? '' : 'consent'
//       });
//     });
//   } catch (error) {
//     console.error("Error during YouTube authentication:", error);
//     throw error;
//   }
// };

// export const getAccessToken = async () => {
//   console.log('getAccessToken function executed')
//   const storedToken = localStorage.getItem('youtube_access_token')
//   const storedTokenExpiry = localStorage.getItem('youtube_token_expiry')

//   if ((storedToken && ((Date.now()) < storedTokenExpiry))) {
//   return storedToken
//   }
//   return await authenticateYouTube(false)
// }


//Dynamically loads the Google Identity Services (GIS) JavaScript library into your application.
export const loadGisScript = () => {
  return new Promise((resolve, reject) => {
    //Checks if the GIS Library is Already Loaded:
    /*If window.google and window.google.accounts exist,
     the GIS library is already available, so it resolves the promise immediately.
    */
    /*
    window.google and window.google.accounts are objects provided 
    by the GIS client library after it has been loaded successfully
    
    window.google act as namespace(CONTAINER OR DEFINE SCOPE) for all google services loaded into current browser windoow.
    it contain properties and method provided by various google library including GIS

    window.google.accounts-
    -is a global object created by the GIS library after it is successfully loaded.
    -is a sub-object under window.google specifically for GIS functioality
    -contain methods and properties to manage user authentication and authorization,
    such as initiating the sign-in process or configure One Tap login
    */
    if (window.google && window.google.accounts) {
    console.log("GIS library already loaded")
      return resolve(window.google.accounts);//resolve is function provided by promise constructor
      
    }
    console.log("loading google identity services...")
    //if library not yet load, it create <script> element with src and set to  GIS library

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    /*The async attribute tells the browser to download the JavaScript file
    asynchronously(in parallel with other resources), and execute it as soon as it is downloaded.*/
    script.async = true;
    script.defer = true;//The script will not execute until the entire HTML document is fully parsed
    
    /*
    The promise is resolved with the value window.google.accounts.
    This means the GIS library is fully loaded, and the functionality
     provided by window.google.accounts is now available for use. */
    script.onload = () => { 
      if (window.google && window.google.accounts) {
        console.log("Google API loaded successfully!")
      resolve(window.google.accounts)
      } else {
        reject(new Error("❌ GIS script loaded, but window.google.accounts is missing!"));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });
};

/**
 * Authenticates the user using Google's OAuth 2.0 flow for YouTube API access.
 * Ensures GIS is loaded before initializing OAuth token client.
 * @param {boolean} skipPrompt - If true, skips user consent prompt.
 * @returns {Promise<string>} Resolves with the access token.
 */

export const authenticateYouTube = async ({skipPrompt='false'}) => {
 let tokenClient = null;
  try {
    const accounts = await loadGisScript();
    
    return new Promise((resolve, reject) => {
      if (!tokenClient) {
        // accounts.oauth2.initTokenClient Initializes an OAuth 2.0 token client using the GIS library.
        tokenClient = accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
          /*The callback in the initTokenClient configuration is a function
           that is executed automatically when Google's OAuth 2.0 server sends
            a response after the token request. This response is the outcome of the OAuth flow,
             and the callback processes this result.
          */
          callback: (response) => {
            console.log('Callback function executed')
            if (response && response.access_token) {
              const tokenExpiryTime = Date.now() + response.expires_in * 1000;
              localStorage.setItem('youtube_access_token', response.access_token);
              localStorage.setItem('youtube_token_expiry', tokenExpiryTime);
              resolve(response.access_token);
            } else {
              reject(new Error('Failed to get access token'));
            }
          },
        });
      }
      
      /*
      If you skip tokenClient.requestAccessToken, the following will happen:

      The OAuth flow will not be triggered.
      Google will not prompt the user to log in or grant permissions.
      No access token will be retrieved.
      Your app will not be authenticated or able to call APIs that require an access token.
      Including requestAccessToken is critical for completing the OAuth flow and retrieving the access token.
      */
      tokenClient.requestAccessToken({
        /*
        skipPrompt: A boolean parameter to control whether the consent screen is skipped:
        true: Skip showing the consent screen (if permissions were previously granted).
        false: Show the consent screen to the user.
        */
        prompt:skipPrompt ? '' : 'consent'
      });
    });
  } catch (error) {
    console.error("Error during YouTube authentication:", error);
    throw error;
  }
};

export const getAccessToken = async () => {
  console.log('checking access token')
  const storedToken = localStorage.getItem('youtube_access_token')
  const storedTokenExpiry = localStorage.getItem('youtube_token_expiry')

  if ((storedToken && ((Date.now()) < storedTokenExpiry))) {
      console.log(`using token ${storedToken}`);

    return storedToken
  }  
    console.log("⚠️ Token expired or missing, re-authenticating...");
  return await authenticateYouTube(false)
}