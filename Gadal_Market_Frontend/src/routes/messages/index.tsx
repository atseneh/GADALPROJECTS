import Paper from "@mui/material/Paper";
import UserList from "./userList";
import { Box, Typography } from "@mui/material";
import Grid from '@mui/material/Grid'
import Convos from "./convos";
import { useState } from "react";
export default function Messages(){
const [selectedChat,setSelectedChat] = useState()
const handleChatSelection = (meseageDetail:any)=>{
    setSelectedChat(meseageDetail)
}
    return (
     <Box
     sx={{
        p:1,
        display:'flex',
        flexDirection:'column',
        gap:1,
        
     }}
     >
        <Typography variant="h5" fontWeight={'bold'}>
            Chats
        </Typography>
        <Grid container>
            <Grid item xs={12} sm={4}>
            <UserList
            selectedChat={selectedChat}
            handleChatSelection={handleChatSelection}
            />
            </Grid>
            <Grid item xs={12} sm={8}>
                <Convos
                messageDetail={selectedChat}
                />             
            </Grid>
        </Grid>
     </Box>
    )
}