import {Card,Stack,Typography,Box,useTheme} from '@mui/material'
import '../../../index.css'
interface featuredRentProps {
    serviceName:string
}
export default function RentFeatured(props:featuredRentProps){
    const {serviceName} = props
    const theme = useTheme()
    return (
      <>
     
            <Box 
            sx={{overflow:'auto'}}
            >
            <Typography fontWeight={'bold'} variant='h6' color={theme.palette.primary.main}>
             {serviceName}
            </Typography>
             <Box 
             className="hideScrollBar"
             sx={{overflow:'auto',display:'flex',gap:2}}>
             <Box>
             <FeaturedCard />
             </Box>
             <Box>
             <FeaturedCard />
             </Box>
                 <Box>
             <FeaturedCard  />
                 </Box>
                 <Box>
             <FeaturedCard  />
                 </Box>
             </Box>
            </Box>
       
      </>
    )
}
function FeaturedCard(){
    return (
        <Card
        sx={{mt:.7,p:1,}}
        >
        
         <Stack spacing={1}>
      
         <Box>
                <Box
                 sx={{
                    width:300,
                    height:220,
                    //  borderRadius:'8px',
                     background:'url(/images/sampleProduct.jpg)',
                     backgroundSize:'contain',                   
                     backgroundRepeat:'no-repeat',
                     backgroundPosition: 'center center',
                    }}
                >
                </Box>
                <Box sx={{display:'flex',gap:0.5}}>
                 <Typography>5,200,000</Typography>
                 <small>birr</small>
                </Box>
                </Box>
         </Stack>
        </Card>
    )
}