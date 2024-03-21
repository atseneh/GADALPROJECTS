import {Box, Stack,IconButton} from '@mui/material'
import useSmallScreen from '../../utils/hooks/useSmallScreen'
import { useEffect, useState } from 'react'
import LensIcon from '@mui/icons-material/Lens';
//for active banner
import TripOriginIcon from '@mui/icons-material/TripOrigin';
const images = [
'/images/MainBanner.svg','/images/MainBanner.svg'
]
export default function MainBanner(){
const [selectedImage,setSelectedImage] = useState(0)
const smallScreen = useSmallScreen()

    return(
        <Box 
        sx={{ml:smallScreen?0:2,mr:smallScreen?4:2,}}
        >
         <img width={'100%'} src={images[selectedImage]}/>
         <Box sx={{display:'flex',flexDirection:'column',mb:1}}>
         <Stack direction={'row'} sx={{alignSelf:'center'}}>
         {
            images?.map((i,index:number)=>(
             <IconButton
              onClick={()=>setSelectedImage(index)}
              size='small' key={i} sx={{fontSize:'.5rem'}}
              >
             {
                selectedImage === index ? (<LensIcon fontSize='inherit'/>):(<TripOriginIcon fontSize='inherit'/>)
             }
             </IconButton>
            ))
          }
         </Stack>
         </Box>
        </Box>
    )
} 