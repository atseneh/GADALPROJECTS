import { Button, Card, CardContent, Divider, Grid, Stack, Typography,IconButton, Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useTheme } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getPackageDefinitions from '../api/package/getPackageDefinitions';
import getPostTypeDefinitions from '../api/postTypes/getPostTypeDefinitions';
export default function PackageSubscription(){
    const navigate = useNavigate()
    const {data:pacageDefs,isLoading} = useQuery({
        queryKey:['package_definition'],
        queryFn:getPackageDefinitions
    })
    const {data:postTypeDefinitions,isLoading:postTypeLoading} = useQuery({
        queryKey:['postTypeDefinition'],
        queryFn:getPostTypeDefinitions
    })
    const basicPostPrice = postTypeDefinitions?.find((postType:any)=>postType?.name === 'Basic')?.price
    const goldPostPrice = postTypeDefinitions?.find((postType:any)=>postType?.name === 'Gold')?.price
    const premiumPostPrice = postTypeDefinitions?.find((postType:any)=>postType?.name === 'Premium')?.price
    return (
        <>
        <Box sx={{mt:2,ml:4}}>
        </Box>
        <Box
        sx={{display:'flex',flexDirection:'column',ml:'8%',mr:'8%',mt:3}}
        >
            <Box
        sx={{display:'flex',flexDirection:'column',alignSelf:'center',mb:3}}
        >
        <Typography variant='h4' fontWeight={'bold'} sx={{alignSelf:'center'}}>
            Package Options
        </Typography>
        <Typography fontWeight={'bold'}>
            Choose a Package that Works for you!
        </Typography>
        </Box>
        <Grid container spacing={2}>
            {
                isLoading || postTypeLoading ?(
                <>
                {
                    [1,2,3].map((item)=>(
                        <Grid
                         item xs={12}
                         sm={6} 
                         md={4}
                         key={item}
                         >
                        <Skeleton
                        variant='rectangular'
                        width={300}
                        height={320}
                        animation={'wave'}
                        />
                    </Grid>
                    ))
                }
                </>
                ):
                (
                    <>
                    {
                          pacageDefs?.map((packageDef:any)=>(
                            <Grid item xs={12} sm={6} md={4} key={packageDef._id}>
                                <PostCard
                              packageInfo={packageDef}
                              basicPrice={basicPostPrice}
                              goldPrice={goldPostPrice}
                              premiumPrice={premiumPostPrice}
                             />
                            </Grid>
                        ))
                    }
                    </>
                )
              
            }
           
        </Grid>
        </Box>
        </>
    )
}
interface PostCardProps {
 packageInfo:any,
 basicPrice:number,
 goldPrice:number,
 premiumPrice:number
}
function PostCard(props:PostCardProps){
    const theme = useTheme()
    const navigate = useNavigate()
    const {packageInfo,basicPrice,goldPrice,premiumPrice} = props
    return (
    <Card
    sx={{
        borderRadius:'8px',
        // mt:active?0:3,
        // background:active?theme.palette.primary.main:''
    }}
    >
        <CardContent>
            <Box
            sx={{
                display:'flex',
                flexDirection:'column',
                gap:1,
                // pt:active?4:1,
                // pb:active?3:1,
                height:330,
                position:'relative'
            }}
            >
           <Stack
           spacing={.5}
           sx={{
            alignSelf:'center'
           }}
           >
           <Typography
            variant='h6' 
            sx={{
                fontWeight:'bold',
                color:'#2E87CC'
            }}
            >
                {packageInfo?.name}
            </Typography>
            <Typography
             sx={{
                fontWeight:'bold',
                ml:1
            }}
             variant='h5'
             >
                    ETB {
                        (packageInfo?.numberOfBasicPosts * basicPrice) + 
                        (packageInfo?.numberOfGoldPosts * goldPrice) +
                        (packageInfo?.numberOfPremiumPosts * premiumPrice)
                    }
            </Typography>
           </Stack>
            <Divider/>
            <Stack spacing={1} sx={{mt:1}}>
            
             
                <Box sx={{display:'flex',gap:1}} >
                <Typography fontWeight={'bold'}>
                    <CheckIcon fontSize='inherit'/>
                </Typography>
                <Typography variant='body2' fontWeight={'bold'}>
                {`${packageInfo?.numberOfBasicPosts} Basic Posts`}
            </Typography>
                </Box>
                      <Box sx={{display:'flex',gap:1}}>
                      <Typography fontWeight={'bold'}>
                          <CheckIcon fontSize='inherit'/>
                      </Typography>
                      <Typography variant='body2' fontWeight={'bold'}>
                      {packageInfo?.numberOfPremiumPosts} Premium Post
                  </Typography>
                      </Box>
                            <Box sx={{display:'flex',gap:1}}>
                            <Typography fontWeight={'bold'}>
                                <CheckIcon fontSize='inherit'/>
                            </Typography>
                            <Typography variant='body2' fontWeight={'bold'}>
                            {packageInfo?.numberOfGoldPosts} Gold Post
                        </Typography>
                            </Box>
                            <Box sx={{display:'flex',gap:1}}>
                            <Typography fontWeight={'bold'}>
                                <CheckIcon fontSize='inherit'/>
                            </Typography>
                            <Typography variant='body2' fontWeight={'bold'}>
                            {packageInfo?.numberOfFreeEstimations} Free Estimations
                        </Typography>
                            </Box>
                            <Box sx={{display:'flex',gap:1}}>
                            <Typography fontWeight={'bold'}>
                                <CheckIcon fontSize='inherit'/>
                            </Typography>
                            <Typography variant='body2' fontWeight={'bold'}>
                            {packageInfo?.offPercent}% Off
                        </Typography>
                            </Box>

            
            
            </Stack>
             <Button type="submit"
                 onClick={
                    ()=>{
                        navigate(`/payment?paymentType=package&packageId=${packageInfo?._id}`)
                    }
                 }
                 fullWidth 
                 sx={{
                    // color:active?theme.palette.primary.main:'white',
                    color:'white',
                    borderRadius:'4px',
                    p:1,
                    // background:!active?theme.palette.primary.main:'white',
                    position:'absolute',
                    bottom:1,
                }}
                 variant="contained"
                 >
                    <Typography variant='body2' fontWeight={'bold'}>
                        {
                         'Get Started'   
                        }
                    </Typography>
                        </Button>
            </Box>
        </CardContent>
    </Card>
    )
}