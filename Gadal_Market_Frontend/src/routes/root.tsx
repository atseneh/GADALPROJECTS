import { useEffect } from 'react'
import BottomNav from '../components/Nav/bottomNav'
import TopNavDesktop from '../components/Nav/topNav.desktop'
import TopNavMobile from '../components/Nav/topNav.mobile'
import Footer from '../components/footer'
import '../index.css'
import useSmallScreen from '../utils/hooks/useSmallScreen'
import { Outlet,useLocation} from "react-router-dom";
// import { socket } from '../api/socket'
export default   function Root(){
const smallScreen = useSmallScreen()
const {pathname} = useLocation()
useEffect(()=>{
document.body.scrollTo(0,0)
},[pathname])
// useEffect(()=>{
//   socket.emit('join','abe kebe');
//   socket.emit('sendMessage','hello world')
//   // return ()=>{
//   //   socket.disconnect();
//   // }
// },[])
    return (
        <div
        className='hideScrollBar'
        style={{
          overflow:'hidden',
        }}
        >
        {
      smallScreen?<TopNavMobile/>:<TopNavDesktop/>
        }
        <Outlet/>
        {
        smallScreen?<BottomNav/>:<Footer/>
        }

    </div>
    )
}