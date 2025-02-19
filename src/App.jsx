//neon hongangie0@gmail.com
//replit haasieyreaimni@gmail.com
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container } from "react-bootstrap";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import HomePage from "./pages/Home/HomePage";
import"./_app.css"
import LoginPage from "./pages/Login/LoginPage";
import { BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import { useEffect, useState } from "react";
import {AuthProvider} from "./components/AuthProvider";
import { Provider } from "react-redux";
import store from "./redux/store";
import WatchPage from "./pages/Watch/WatchPage";
import SearchPage from './pages/Search/SearchPage';

export  function Layout() {
  const [sidebar, toggleSidebar] = useState(false)
  
  const handleToggleSidebar = () => toggleSidebar((value) => !value)
  
  useEffect(() => {
    console.log("VITE_YOUTUBE_API_KEY:", import.meta.env.VITE_YOUTUBE_API_KEY);
    console.log("VITE_GOOGLE_CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  }, []);
  return (
     <>
      <Header handleToggleSidebar={handleToggleSidebar} />
      <div className="app_container ">
        <Sidebar sidebar={sidebar} handleToggleSidebar={handleToggleSidebar} />
        <Container fluid className="app_main ">
          <Outlet/>
        </Container>
      </div>
    </>
  )
}


export default function App() {
  
  
  return (
    <Provider store={store}>
    <AuthProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/" element={<Layout />}>
          <Route index element={<HomePage/>} />
              {/* <Route path="/search" element={}/> */}
              <Route path="watch/:id" element={<WatchPage />} />
              
              <Route path="search/:query" element={<SearchPage />} /> 
              
              

           </Route>
        <Route path="*" element={<LoginPage/>} />
      </Routes>
      </BrowserRouter>
      </AuthProvider>
      </Provider>
  )
}
