import { useEffect } from 'react'
import BottomNav from '../components/Nav/bottomNav'
import TopNavDesktop from '../components/Nav/topNav.desktop'
import TopNavMobile from '../components/Nav/topNav.mobile'
import Footer from '../components/footer'
import '../index.css'
import useSmallScreen from '../utils/hooks/useSmallScreen'
import { Outlet,useLocation} from "react-router-dom";
export default   function Root(){
const smallScreen = useSmallScreen()
const {pathname} = useLocation()
useEffect(()=>{
document.body.scrollTo(0,0)
},[pathname])
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