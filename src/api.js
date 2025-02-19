import axios from "axios";


const request = axios.create({
  baseURL: 'https://youtube.googleapis.com/youtube/v3',
  /*params property is used to defined default query parameters that
   will automatically be appended to every request made using the 
   created axios instance.
  */
  params: {
    key:import.meta.env.VITE_YOUTUBE_API_KEY
  },
  
})
/*request.get('/videos', { params: { part: 'snippet', chart: 'mostPopular' } });
The final URL will be:
https://youtube.googleapis.com/youtube/v3/videos?key=YOUR_API_KEY
&part=snippet&chart=mostPopular
*/


console.log('API Key:', import.meta.env.VITE_YOUTUBE_API_KEY);


// Add an interceptor to add the token before each request
//second request refers to the type of interceptor being use

/*
 
The interceptor Runs Before Every Request

The interceptor is attached to the request instance.
When you make any request using this instance (e.g., request.get(), request.post(), etc.), the interceptor runs first.
*/
// interceptor function receives the config object as input.
/*
when you use axios.interceptors.request.use, Axios automatically provides 
the request configuration object (config) as the argument to the interceptor function. 
*/
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('youtube_access_token');
  console.log(token)
  if (token) {
        // If a token exists, add it to the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  /*
  The interceptor must always return a config object because Axios
   relies on this return value to proceed with the HTTP request. 
   If you don’t return the config, Axios will not know how to send 
   the request.
  */
  return config;
});

 export default request
