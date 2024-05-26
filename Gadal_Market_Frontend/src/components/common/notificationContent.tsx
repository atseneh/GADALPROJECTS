import { CircularProgress, Divider } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getNotifications from "../../api/notifications/getNotifications";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import updateSeen from "../../api/notifications/updateSeen";
export default function NotificationContent(){
const loggedinUser = localStorage.getItem('userId') as string
const queryClient = useQueryClient();
const {data:notifications,isLoading} = useQuery({
    queryKey:['get_notifications'],
    queryFn:()=>getNotifications(loggedinUser)
})
const {mutate:seen} = useMutation({ 
    mutationFn:updateSeen,
    mutationKey:['notification_update_seen'],
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['get_unread_Notifications_count']})
    }
})
useEffect(()=>{
seen(loggedinUser)
},[])
    return (
     <Stack
     spacing={1}
     sx={{
        p:1,
     }}
     >
        <Typography
        variant="h6"
        fontWeight={'bold'}
        >
            Notifications
        </Typography>
        <Divider/>
         {
            isLoading  ? (
                <Stack
                sx={{
                    position:'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                >
                    <CircularProgress/>
                </Stack>
            ):
            (
                <>
                 {
        !(Array.isArray(notifications) && notifications?.length > 0) ? (
           <Stack
           spacing={.5}
           sx={{
            position:'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }}
           >
        <NotificationsNoneOutlinedIcon
        sx={{
            alignSelf:'center'
        }}
        fontSize="large"
        />
         <Typography>
            No Notifications Yet 
        </Typography>
        </Stack>
        ):
        (
         <>
         {
             notifications?.map((notification:any)=>(
                <React.Fragment
                key={notification?._id}
                >
                 {
                    notification?.product ? (
                        <NavLink
                        to={`/products/${notification?.product}`}
                        style={({isTransitioning }) => {
                            return {
                              color:'#295EF9',
                              textDecoration:'none',
                              viewTransitionName: isTransitioning ? "slide" : "",
                            };
                          }}
                        >
                    <Typography>
                        {
                        notification?.notification
                        }
                 </Typography>
                        </NavLink>
                    ):
                    (
                        <Typography
                        >
                        {
                           notification?.notification
                        }
                        </Typography>
                    )
                 }
                 <Divider/>
                </React.Fragment>
                ))
         }
         </>
        )
       }
                </>
            )
            
         }
     </Stack>
    )
}