import Paper from "@mui/material/Paper";
import UserList from "./userList";
import { Box, Typography } from "@mui/material";
import Grid from '@mui/material/Grid'
import Convos from "./convos";
import { useState } from "react";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
export default function Messages(){
const [selectedChat,setSelectedChat] = useState()
const handleChatSelection = (meseageDetail:any)=>{
    setSelectedChat(meseageDetail)
}
const handleGoBack = ()=>{
    setSelectedChat(undefined);
}
const smallScreen = useSmallScreen();
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
            {
            //  (!(Boolean(selectedChat)) && smallScreen) || !smallScreen 
            ((smallScreen && !selectedChat) || !smallScreen)
             && (
                <Grid 
                    item 
                    sm={12} 
                    md={4}
                    >
                <UserList
                selectedChat={selectedChat}
                handleChatSelection={handleChatSelection}
                />
                </Grid>
             )
            }
            {
        
        // (Boolean(selectedChat) && smallScreen) || !smallScreen 
        ((smallScreen && selectedChat) || !smallScreen)
        && (
            <Grid item sm={12} md={8}>
            <Convos
            messageDetail={selectedChat}
            onGoBack={handleGoBack}
            />             
            </Grid>
                )
            }
        </Grid>
     </Box>
    )
}