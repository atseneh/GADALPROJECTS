import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import getPublicProfileDetail from "../../api/user/getPublicProfileDetail";
import { Avatar, Box, Button, Divider, Grid, Pagination, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { IMAGE_URL } from "../../api/apiConfig";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import getProducts from "../../api/products/getProducts";
import ProductCard from "../../components/products/productCard";
import CardSkeleton from "../../components/products/cardSkeleton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import followUser from "../../api/user/follow";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
export default function PublicProfile(){
    const {userId} = useParams();
    const loggedinUser = localStorage.getItem('userId') as string
    const queryClient = useQueryClient()
    const [activeTab,setActiveTab] = useState(0)
    const smallScreen = useSmallScreen();
    const variant = smallScreen?'caption':'body1'
    const theme = useTheme()
    const handleTabSelection = (tab:number)=>{
    setActiveTab(tab)
  }
    const {data:profileDetail,isLoading} = useQuery({
        queryKey:['profile_detail',userId],
        queryFn:()=>getPublicProfileDetail(userId as string),
    })
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const {mutate:follow,isPending:followPending} = useMutation({
      mutationFn:followUser,
      mutationKey:['follow_user'],
      onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['profile_detail']})
      }
  })
    const handleFollow = (userToFollow:string)=>{
      if(followPending){
          return;
      }
      follow({
          user:loggedinUser,
          userToFollow,
      })
  }
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageNumber(value);
      };
      const {data:posts,isLoading:postsLoading} = useQuery({
        queryKey:['user_posts',userId,pageSize,pageNumber,activeTab],
        queryFn:()=>getProducts({
            consignee:userId as string,
            // pageSize,
            // pageNumber,
            productType:activeTab===1 ? 2 : activeTab === 2 ? 1 : activeTab===3 ? 3 : activeTab === 4 ? 4 : undefined
        })
    })
    return (
      <>
      <Grid
      container
      spacing={2}
      sx={{
        p:2,
    }}
      >
        <Grid
        item
        xs={12}
        sm={4}
        >
         <Stack
        spacing={1}
      
        >
        <Avatar
            alt="Profile pic"
            src={profileDetail?.proflePic ? `${IMAGE_URL}/${profileDetail?.proflePic}` : "/images/maleUser.svg"}
            sx={{ width: 100, height: 90 }}
            />
          <Stack>
            <Typography 
            variant="h6" 
            fontWeight={"bold"} 
            sx={{
                // alignSelf:'center',
                textTransform:'capitalize'
            }}
            >
                {
                    isLoading?<Skeleton/>:
                    `${profileDetail?.firstName} ${profileDetail?.lastName}`
                }
            </Typography>
             <Box sx={{display:'flex',alignItems:'center',gap:1}}>
             <img  src="/images/icons8_phone_1.svg"/>
             <Typography variant="body2" fontWeight={'bold'}>
                    {
                        isLoading?<Skeleton/>:
                        `Phone: ${profileDetail?.phoneNumber}`
                    }
                </Typography>
             </Box>
             <Box sx={{display:'flex',alignItems:'center',gap:1}}>
             <img  src="/images/icons8_paper_plane.svg"/>
             <Typography variant="body2" fontWeight={'bold'}>
                    {
                        isLoading?<Skeleton/>:
                        `Email: ${profileDetail?.email}`
                    }
                </Typography>
             </Box>
             <Box sx={{display:'flex',alignItems:'center',gap:1}}>
             <BusinessCenterIcon fontSize="small" sx={{color:'rgb(232 201 207)'}}/>
               {
                isLoading ? <Skeleton/> : (
                    <Typography variant="body2" fontWeight={'bold'}>
                    {`${profileDetail?.postCount || 0} Products posted`}
                </Typography>
                )
               }
             </Box>
             <Box sx={{display:'flex',alignItems:'center',gap:1}}>
             <PeopleAltIcon fontSize="small" sx={{color:'rgb(232 201 207)'}}/>
               {
                isLoading ? <Skeleton/> : (
                    <Typography variant="body2" fontWeight={'bold'}>
                    {`${profileDetail?.followers?.length} Followers`}
                </Typography>
                )
               }
             </Box>
             {
              (loggedinUser !== userId) && (
                <>
                {
                  profileDetail?.followers?.includes(loggedinUser) ? (
                    <Typography
                    sx={{
                      mt:2,
                      color:'green'
                    }}
                    >
                      Following
                    </Typography>
                  ):
                  (
                    <Button
                    size="small" 
                    sx={{
                      color:'black',
                      background:'rgb(254 222 161)',
                      alignSelf:'flex-start',
                      mt:2,
                    }}
                    variant="outlined"
                    onClick={()=>{
                        handleFollow(userId as string)
                    }}
                    disabled={followPending}
                      >
                  <AddIcon sx={{fontSize:'1rem'}} fontSize="small"/>
                  Follow
                    </Button>
                  )
                }
                </>
              )
             }
            </Stack>
        </Stack>
        </Grid>
      
        <Grid
        item
        xs={12}
        sm={8}
        >
        <Stack
        spacing={1}
        >
            <Typography
            variant="h5"
            >
              Ads
            </Typography>
             <Box
             sx={{
              display:'flex',
              alignItems:'center',
              gap:1,
             }}
             >
             {
            ['All','Property','Machinery','Vehicle','Others'].map((item,index)=>(
                <Box 
                onClick={(e)=>handleTabSelection(index)}
                sx={{display:'flex',alignItems:'center',gap:1,
                borderRadius:'16px',
                cursor:'pointer',
                background:activeTab===index?theme.palette.primary.main:'#EFEFEF',color:'black',
                pt:.7,pb:.7,pl:2,pr:2    
            }}>
             <Typography variant={variant}>
                {item}
             </Typography>
            </Box>
            ))
            }
             </Box>
            <Divider/>
            
              <Grid
              container
              spacing={2}
              >
              {
                postsLoading ? (
                    [1,2,3,4].map((item)=>(
                        <Grid 
                        item 
                        xs={12} 
                        sm={4} 
                        key={item}
                        >
                        <CardSkeleton key={item}/>
                        </Grid>
                        
                       ))
                ):
                (
                    <>
                     {
                posts?.products?.map((product:any)=>(
                    <Grid
                    key={product?._id}
                    item
                    xs={12}
                    sm={4}
                    >
                    <ProductCard
                    data={product}
                    />
                    </Grid>
                ))
              }
                    </>
                )
              }
             
              </Grid>
              {/* {
                  posts?.products?.length>0&&(
                    <Pagination
                    count={Math.ceil(posts?.metadata?.totalProducts/pageSize)}
                    page={pageNumber}
                    onChange={handlePaginationChange}
                    
                  />
                  )
                } */}
        </Stack>
        </Grid>
      </Grid>
      </>
    )
}