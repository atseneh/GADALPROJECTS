import { CardContent, Typography,Card, Divider, Stack, IconButton, Tooltip, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getFollowings from "../../api/user/getFollowings";
import { IMAGE_URL } from "../../api/apiConfig";
import unfollowUser from "../../api/user/unfollow";
export default function Following(){
    const loggedInUserId = localStorage.getItem('userId') as string
    const queryClient = useQueryClient();
    const {data:followings,isLoading} = useQuery({
        queryKey:['get_followings'],
        queryFn:()=>getFollowings(loggedInUserId)
    })
    const {mutate:unFollow,isPending} = useMutation({
        mutationFn:unfollowUser,
        mutationKey:['unfollow_user'],
        onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['get_followings']})
        }
    })
    const handleUnfollow = (userToUnfollow:string)=>{
        if(isPending){
            return;
        }
        unFollow({
            user:loggedInUserId,
            userToUnfollow,
        })
    }
    return (
    <Card>
        <CardContent>
        <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
        <Typography variant='h6' fontWeight={'bold'}>
            Your Followings
        </Typography>
       
        <Divider sx={{fontWeight:'bold',mb:1}}/>
         <>
         {
            isLoading ? (
                <Typography>
                    Loading...
                </Typography>
            ):
            (
                <>
                <Grid container spacing={1}>
                {
                    followings?.following?.map((following:any)=>(
                        <Grid xs={12} sm={6} md={3} key={following?._id} sx={{mt:1}}>
          <Box 
                sx={{
                    display:'flex',flexDirection:'column',ml:2,position:'relative',alignSelf:'flex-start',
                    boxShadow: `1px 1px 8px #ABABAB`,
                    p:1,
                    }}>
                <Tooltip title="Unfollow">
                <IconButton 
                    sx={{
                        position:'absolute',
                        right:0,
                        top:0,
                    }}
                    onClick={()=>{
                        handleUnfollow(following?._id)
                    }}
                    >
                        <PersonRemoveIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
                <Box sx={{alignSelf:'center'}}>
                <Stack sx={{ml:2}}>
                <img  
                width={100} 
                src={following?.proflePic ? `${IMAGE_URL}/${following?.proflePic}` : "/images/maleUser.svg"}
                />
                <Typography variant="body2">
                    {
                        `${following?.firstName} ${following?.lastName}`
                    }
                </Typography>
                <Typography variant="body2">
                    {following?.phoneNumber} 
                </Typography>
            </Stack>
               {
                following?.email && (
                    <Typography variant="caption">
                    {
                        following?.email
                    }
                </Typography>
                )
               }
                </Box>
    </Box>    
                        </Grid>
                    ))
                }
         </Grid>
                </>
            )
         }
         </>
        </Box>
        
        </CardContent>
    </Card>
    )
}