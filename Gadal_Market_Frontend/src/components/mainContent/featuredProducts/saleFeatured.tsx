import {Box,Button,Stack, Typography} from '@mui/material'
import FeaturedCardSkeleton from './skeleton'
import useLoading from '../../../utils/hooks/useLoading'
import useSmallScreen from '../../../utils/hooks/useSmallScreen'
interface saleFeaturedProps {
    serviceName:string
}
export default function SaleFeatured(props:saleFeaturedProps){
const {serviceName} = props
const loading = useLoading()
const smallScreen = useSmallScreen()
return (
   <>
    {
        loading?
        (
        <Box>
            <FeaturedCardSkeleton/>
        </Box>
        ):
        (
            <Box sx={{display:'flex',flexDirection:'column',gap:1,width:'100%'}}>
            <Typography sx={{fontWeight:'bold'}} >
                {serviceName}
            </Typography>
            <Box
            sx={{display:'flex',gap:2,p:1,background:'rgb(239 239 239)',}}
            >  
               <Box
                         sx={{
                            width:140,
                            height:100,
                             borderRadius:'8px',
                             background:'url(/images/sampleProduct2.jpg)',
                             backgroundSize:'cover',                   
                             backgroundRepeat:'no-repeat',
                             backgroundPosition: 'center center',
                            }}
                        >
                        </Box>
                <Stack spacing={2}>
                   <Box>
                   <Typography variant={smallScreen?'caption':'subtitle1'}>Villa,3 bedrooms </Typography>
                    <Box sx={{display:'flex',gap:0.5}}>
                         <Typography sx={{fontWeight:'bold'}} variant='subtitle2'>5,200,000</Typography>
                         <small>birr</small>
                        </Box>
                   </Box>
                    <Button
                    sx={{borderRadius:'16px',fontWeight:'bolder'}}
                    size='small'
                    variant='contained'
                    >BUY NOW</Button>
                </Stack>
            </Box>
            </Box>
        )
    }
   </>
)
}