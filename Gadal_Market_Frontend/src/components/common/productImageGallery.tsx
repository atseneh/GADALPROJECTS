import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Lightbox from "yet-another-react-lightbox";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import { useTheme } from "@mui/material";
import { useState } from "react";
import IconButton  from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
interface imageType {
    id:string,
    path:string
}
export default function ProductImageGallery(props:{images:imageType[],loading:boolean}){
    const smallScreen = useSmallScreen()
    const {images,loading} = props
    const theme = useTheme()
    const [selectedImage,setSelectedImage] = useState('0')
    const selectedImgeDetail = images?.find((image:any)=>image.id == selectedImage)
    const [openLightBox,setOpenLightBox] = useState(false)
    return (
        <>
        {
        loading?
        (
            <Box sx={{display:'flex',gap:1,alignItems:'flex-start',flexDirection:smallScreen?'column-reverse':'row'}}>
                 <Stack 
                 spacing={1}
                 direction={smallScreen?'row':'column'}
                 
                 > 
                <Skeleton variant="rectangular" width={120} height={90}/>
                <Skeleton variant="rectangular" width={120} height={90}/>
                </Stack>
                <Skeleton variant="rectangular" width={400} height={400}/>
            </Box>
        ):
        (
            <Box sx={{display:'flex',gap:1,alignItems:'flex-start',flexDirection:smallScreen?'column-reverse':'row'}}>
            <Stack 
                 spacing={1}
                 direction={smallScreen?'row':'column'}
                 
                 > 
                 {
                     images?.map((image:any)=>(
                     <Box
                     onClick={()=>setSelectedImage(image.id)}
                      sx={{
                      width:120,
                      height:90,
                      background:`url(${image.path})`,
                      backgroundSize:'contain',                   
                      backgroundRepeat:'no-repeat',
                      backgroundPosition: 'center center',
                      border:image.id === selectedImage ?`2px solid ${theme.palette.primary.main}`:'',
                      cursor:'pointer',
                     }}
                     />
                 
                     ))
                 }
             </Stack>
             <Box
             sx={{
                 width:'100%',
                 height:350,
                 position:'relative',
                 background:`url(${selectedImgeDetail?.path})`,
                 backgroundSize:'contain',                   
                 backgroundRepeat:'no-repeat',
                 backgroundPosition: 'center center',
                 cursor:'pointer',
                }}
                onClick={()=>setOpenLightBox(true)}
             >
              
                 {/* <IconButton
                 sx={{
                     position:'absolute',
                     bottom:0,
                     right:1,
                     color:'white',
                     fontWeight:'bold'
                 }}
                 onClick={()=>setOpenLightBox(true)}
                 >
                     <FullscreenIcon color="inherit"/>
                 </IconButton> */}
             </Box>
            </Box>
        )
        }
        <Lightbox
        index={Number(selectedImage)}
        open={openLightBox}
        close={()=>setOpenLightBox(false)}
        slides={
         images?.map((i:any)=>(
             {
                 src:i.path
             }
         ))
        }
        />
        </>
    )
}