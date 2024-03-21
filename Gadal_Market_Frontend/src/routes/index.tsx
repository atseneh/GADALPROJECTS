import '../index.css'
import MainContent from '../components/mainContent'
import AppCta from '../components/cta/appCta'
import Box from '@mui/material/Box'
import ServiceAssurance from '../components/common/serviceAssurance'
import useSmallScreen from '../utils/hooks/useSmallScreen'
function Index() {
const smallScreen = useSmallScreen()
  return (
     <div
    className='hideScrollBar'
    style={{
      overflow:'hidden',
    }}
    >
      <MainContent/>
       {
        smallScreen?
        (
    <ServiceAssurance/>
        )
        : (
          <Box sx={{m:2}}>
          <AppCta/>
          </Box>
        )
       }
      
      
    
    </div>
   
  )
}

export default Index
