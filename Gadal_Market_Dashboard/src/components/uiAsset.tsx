import { Paper, Typography,Box,Stack,IconButton, Button } from "@mui/material"
import { useState } from "react"
import LensIcon from '@mui/icons-material/Lens';
//for active banner
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
interface UiAssetProps {
    title:string,
    assetUrls:string[],
}
export default function UiAsset(props:UiAssetProps){
    const {title,assetUrls} = props
    const [selectedImage,setSelectedImage] = useState(0)
    return (
        <Paper
        sx={{
            display:'flex',
            flexDirection:'column',
            gap:1,
            p:1,
        }}
        >
        <Typography variant="h5" fontWeight={'bold'}>
            {title}
        </Typography>
        <Box 
        sx={{p:1,}}
        >
         <img width={'100%'} src={assetUrls[selectedImage]}/>
         <Box sx={{display:'flex',flexDirection:'column',mb:1}}>
         <Stack direction={'row'} sx={{alignSelf:'center'}}>
         {
            assetUrls?.map((i,index:number)=>(
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
         <Box  sx={{display:'flex',alignItems:'center',gap:1,alignSelf:'flex-end'}}>
            <Button
            size="small"
            variant="contained"        
            sx={{bgcolor:'white',color:'#F23F4B',border:'1px solid #F23F4B',fontWeight:'bold'}}
            >
                Remove
            </Button>
            <Button
            size="small"
            variant="contained"        
            sx={{bgcolor:'#ABABAB',color:'white',border:'1px solid #ABABAB',fontWeight:'bold'}}
            >
                Change
            </Button>
            <IconButton>
                <AddCircleOutlineOutlinedIcon fontSize="large"/>
            </IconButton>
         </Box>
         </Box>
        </Box>
        </Paper>
    )
}