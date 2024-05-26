import {Stack, Box, InputBase, Avatar, Badge, Typography, Chip } from "@mui/material";
import Search from "@mui/icons-material/Search";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getMessagesOfUser from "../../api/messages/getMessagesOfUser";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import { SocketCon } from "../../components/context/socketContext";
import { useContext, useState } from "react";
import updateSeen from "../../api/messages/updateSeen";
interface UserListProps {
   selectedChat:any,
   handleChatSelection:(messageDetail:any)=>void
}
export function getBadgeVariant(buyer:string,owner:string,connectedUsers:string[]):'dot'|'standard'{
  if(localStorage.getItem('userId') === buyer){
    return connectedUsers.includes(owner) ? 'dot' : 'standard'
  }
  else if(localStorage.getItem('userId') === owner) {
    return connectedUsers.includes(buyer) ? 'dot' : 'standard'
  }
  return 'standard'
}
export default function UserList(props:UserListProps){
    const {selectedChat,handleChatSelection} = props
    const {connectedUsers} = useContext(SocketCon)
    const [searchTerm,setSearchTerm] = useState('')
    const queryClient = useQueryClient();
    const {data:messages,isLoading,refetch,isRefetching} = useQuery({
      queryKey:['get_messages'],
      queryFn:()=>getMessagesOfUser(localStorage.getItem('userId') as string,searchTerm)
    })
    const {mutate} = useMutation({
      mutationKey:['update_seen',],
      mutationFn:updateSeen,
      onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['get_messages']})
        queryClient.invalidateQueries({queryKey:['get_unread_Messages_count']})
      }
    })
    const smallScreen = useSmallScreen()
    return (
        <Stack
        spacing={1.5}
        sx={{
          border:'1px solid #EFEFEF',
          p:1,
          overflowY:'auto',
          height:smallScreen ? '100vh' : 'calc(100vh - 183px)',
          width:smallScreen?'100vw':'auto',
          
        }}
        >
           <Box
            component={'form'}
            onSubmit={(e)=>{
              e.preventDefault()
              refetch();
              // navigate(`/search?searchQuery=${searchTerm}`)
            }}
            sx={{
              p: '2px 4px', 
              display: 'flex',
              alignItems: 'center',
              border:`1px solid black`,
              borderRadius:"20px",
              background:'#EFEFEF',
              mt:1,
              width:smallScreen ? '90%' :'auto'
            }}
         >
            <Search fontSize="small" sx={{ml:1}}/>
             <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search.."
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}     
            />
      
         </Box>
         {
          isLoading || isRefetching ? (
            <Typography variant="body2">
              Loading...
            </Typography>
          ):
          (
            <>
            {
         messages?.length > 0 ?
         (
          <>
           
         {
        messages?.map((message:any)=>(
        <Stack
        key={message?._id}
        direction={'row'}
        alignItems={'center'}
        onClick={()=>{
          handleChatSelection(message);
          mutate({
            messageId:message?._id,
            userId:localStorage.getItem('userId') as string
          })
        }}
        sx={{
            cursor:'pointer',
            background:selectedChat?._id === message?._id ? '#FFDFA1':'',
            padding:selectedChat?._id === message?._id ? 1:.3,
           '&:hover':{
            background:'#FFDFA1',
            // width:smallScreen ? '80%' :'auto'
           }
        }}
        >
          <Box
          sx={{
            display:'flex',
            gap:1,
            alignItems:'center',
            flexGrow:1,
          }}
          >
            <Badge 
              variant={
                getBadgeVariant(message?.interestedParty?._id,message?.productOwner?._id,connectedUsers)
              }
              color="success" 
              overlap="circular" 
              // badgeContent=" "
              >
                <Avatar/>
            </Badge>
            <Stack>
              <Typography fontWeight={'bold'} sx={{textTransform:'capitalize'}}>
                {/* {`${message?.interestedParty?.firstName} ${message?.interestedParty?.lastName}`} */}
                {
                  localStorage.getItem('userId') === message?.interestedParty?._id ?
                  `${message?.productOwner?.firstName} ${message?.productOwner?.lastName}`
                  :
                  `${message?.interestedParty?.firstName} ${message?.interestedParty?.lastName}`
                }
              </Typography>
                {
                  message?.lastConversation?.message?.messageType === 'image' && (
                    <Typography variant="body2">
                      Photo
                    </Typography>
                  )
                }
                {
                  message?.lastConversation?.message?.messageType === 'text' && (
                    <Typography variant="body2">
                {
                message?.lastConversation?.message?.messae?.length>22 ? `${message?.lastConversation?.message?.message?.slice(0,22)}...`:message?.lastConversation?.message?.message
                }
              </Typography>
                  )
                }
            </Stack>
          </Box>
            <Stack
            spacing={.5}
            sx={{
              mr:smallScreen ? 3 : 0
            }}
            >
               <Typography variant="caption">
                {
                 new Date(message?.lastConversation?.updatedAt).toDateString()
                }
            </Typography>
            {
              message?.unreadCount > 0 && (
                <Chip 
                color="primary" 
                label={message?.unreadCount}
                size="small"
                sx={{alignSelf:'flex-end',color:'white'}}
                />
              )
            }
            </Stack>
        </Stack>
        ))
        }
          </>
         ):
         (
          <Typography
          sx={{
            alignSelf:'center',
          }}
          >
            No Messages yet ? 
          </Typography>
         )
        }
            </>
          )
         }
        </Stack>
    )
}