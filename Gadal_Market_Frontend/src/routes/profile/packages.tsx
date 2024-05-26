import { CardContent, Typography,Card, Divider, Stack, IconButton, Tooltip, Grid, Box, Link,useTheme,Chip, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getUsersPackage from "../../api/user/getUsersPackage";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
function packageIsExpired(endDateString: string): boolean {
    const date = new Date(endDateString);
    const today = new Date();
    // Set hours, minutes, seconds, and milliseconds to 0 for comparison
    today.setHours(0, 0, 0, 0);

    return date < today;
}
export default function Packages(){
    const theme = useTheme()
    const navigate = useNavigate()
    const {data:userPackages,isLoading} = useQuery({
        queryKey:['users_package'],
        queryFn:()=>getUsersPackage()
    })
    const allPackagesAreExpired = userPackages?.every((p:any)=> !p?.isValid)
    return(
      <Card>
        <CardContent>
        <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
          <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          >
          <Typography variant='h6' fontWeight={'bold'}>
                    Your Packages
         </Typography>
          {
            allPackagesAreExpired && (
              <Button
              variant="contained"
              size="small"
              sx={{
               color:'white',
               display:'flex',
               alignItems:'center'
              }}
              onClick={()=>{
                navigate('/get_packages')
              }}
              >
               <AddIcon fontSize="small"/>
               <Typography
               variant="body2"
               >
               New Package
               </Typography>
              </Button>
            )
          }
          </Stack>
        <Divider sx={{fontWeight:'bold',mb:1}}/>
         {
            isLoading ? 
            (
                <Typography>
                    Loading...
                </Typography>
            )
            :
            (
                <>
                {
                    Array.isArray(userPackages) && userPackages?.length > 0 ? (
                       
                        <Grid container spacing={1}>
                          {
                            userPackages?.map((packageDetail:any)=>(
                                <Grid item xs={12} sm={6} md={4}>
                                  <Card>
                                  <CardContent
                                    sx={{
                                        display:'flex',
                                        flexDirection:'column',
                                        p:1,
                                        alignSelf:'center',
                                        gap:1,
                                    }}
                                    >
                                      <Box
                                      sx={{
                                        display:'flex',
                                        alignItems:'center',
                                        justifyContent:'space-between'
                                      }}
                                      >
                                      <Typography 
                                        variant="h5"
                                        sx={{
                                            color:theme.palette.primary.main
                                        }}
                                        >
                                            {packageDetail?.description}
                                        </Typography>
                                        {
                                        !packageDetail?.isValid ?
                                       <Chip
                                        label="Expired" 
                                        color="error"
                                        sx={{
                                            ':hover':{
                                                background:theme.palette.error.main
                                            }
                                        }}
                                        />
                                         :
                                       <Chip 
                                       label="Active" 
                                       color="success"
                                       sx={{
                                        ':hover':{
                                            background:theme.palette.success.main
                                        }
                                    }}
                                       />
                                        }
                                      </Box>
                                        <Divider/>
                                        <Stack
                                        spacing={1}
                                        direction={'row'}
                                        alignItems={'center'}
                                        >
                                          <CheckCircleOutlineIcon color="success" fontSize="small"/>
                                          <Typography>
                                            {packageDetail?.remainingGoldPosts}  Gold posts remining
                                        </Typography>
                                        </Stack>
                                        <Stack
                                        spacing={1}
                                        direction={'row'}
                                        alignItems={'center'}
                                        >
                                        <CheckCircleOutlineIcon color="success" fontSize="small"/>

                                        <Typography>
                                        {packageDetail?.remainingPremiumPosts} Premium posts remining
                                        </Typography>
                                        </Stack>
                                        <Stack
                                        spacing={1}
                                        direction={'row'}
                                        alignItems={'center'}
                                        >
                                       <CheckCircleOutlineIcon color="success" fontSize="small"/>
                                       <Typography>
                                        {packageDetail?.remainingPremiumPosts} Premium posts remining
                                        </Typography>
                                       </Stack>
                                       <Stack
                                        spacing={1}
                                        direction={'row'}
                                        alignItems={'center'}
                                        >
                                       <CheckCircleOutlineIcon color="success" fontSize="small"/>
                                      <Typography>
                                            {packageDetail?.remainingBasicPosts} Basic Post remaining
                                        </Typography>
                                      </Stack>
                                      <Stack
                                        spacing={1}
                                        direction={'row'}
                                        alignItems={'center'}
                                        >
                                       <CheckCircleOutlineIcon color="success" fontSize="small"/>
                                      <Typography>
                                            {packageDetail?.remainingFreeEstimationPosts} Free Estimation Remaining
                                        </Typography>
                                      </Stack>
                                       
                                        {
                                            !packageIsExpired(packageDetail?.endDate) && (
                                              <Stack
                                              spacing={1}
                                              direction={'row'}
                                              alignItems={'center'}
                                              >
                                             <CheckCircleOutlineIcon color="success" fontSize="small"/>
                                                 <Typography>
                                                Will expire at {new Date(packageDetail?.endDate).toLocaleDateString()}
                                            </Typography> 
                                               </Stack>
                                            )

                                        }
                                    </CardContent>
                                  </Card>
                                </Grid>
                            ))
                          }
                        </Grid>
                    ):
                    (
                        <Box 
                        sx={{
                          ml:2,
                          display:'flex',
                          alignItems:'center',
                          gap:1,
                        }}
                        >
                        <Typography 
                        sx={{
                          textTransform:'capitalize'
                        }}
                        >
                                  You have not subscribed to any gadal packages yet ,
                          </Typography>
                          <Link
                          href="/get_packages"
                          sx={{
                              color:'blue',
                              textDecoration:'none',
                              textTransform:'capitalize'
                          }}
                          >
                              Get Started With one
                          </Link>
                        </Box>
            
                        )
                }
                </>
            )
         }
            </Box>
        </CardContent>
      </Card>
    )
}