import {Box,Button,Stack, Typography} from '@mui/material'
import FeaturedCardSkeleton from './skeleton'
import useSmallScreen from '../../../utils/hooks/useSmallScreen'
import { useQuery } from '@tanstack/react-query'
import getFetauredProducts from '../../../api/products/getfeaturedProducts'
import { IMAGE_URL } from '../../../api/apiConfig'
import { useNavigate } from 'react-router-dom'
interface saleFeaturedProps {
    serviceName:string,
    serviceType:number
}
export default function SaleFeatured(props:saleFeaturedProps){
const {serviceName,serviceType} = props
const smallScreen = useSmallScreen()
const {data:featuredProducts,isLoading} = useQuery({
    queryKey:['get_featured_products2',serviceType],
    queryFn:()=>getFetauredProducts(serviceType,2)
  })
const navigate = useNavigate();
return (
   <>
    {
        isLoading?
        (
        <Box>
            <FeaturedCardSkeleton/>
        </Box>
        ):
        (
           <>
           {
            Array.isArray(featuredProducts?.products) && featuredProducts?.products?.length>0 && (
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
                                 background:`url(${IMAGE_URL}/${featuredProducts?.products?.at(0)?.productImages?.at(0)})`,
                                 backgroundSize:'cover',                   
                                 backgroundRepeat:'no-repeat',
                                 backgroundPosition: 'center center',
                                }}
                            >
                            </Box>
                    <Stack spacing={2}>
                       <Box>
                       <Typography variant={smallScreen?'caption':'subtitle1'}>
                        {
                            featuredProducts?.products?.at(0)?.title
                        }
                       </Typography>
                        <Box sx={{display:'flex',gap:0.5}}>
                             <Typography sx={{fontWeight:'bold'}} variant='subtitle2'>
                                {
                                    new Intl.NumberFormat('en-Us',{maximumFractionDigits:3}).format(
                                        featuredProducts?.products?.at(0)?.currentPrice
                                    )
                                }
                             </Typography>
                             <small>birr</small>
                            </Box>
                       </Box>
                        <Button
                        sx={{borderRadius:'16px',fontWeight:'bolder'}}
                        size='small'
                        variant='contained'
                        onClick={()=>{
                        navigate(`/products/${featuredProducts?.products?.at(0)?._id}`)
                        }}
                        >
                        BUY NOW
                        </Button>
                    </Stack>
                </Box>
                </Box>
            )
           }
           </>
        )
    }
   </>
)
}