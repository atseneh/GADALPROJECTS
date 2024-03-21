import {Stack, Box, InputBase, Avatar, Badge, Typography } from "@mui/material";
import Search from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import getMessagesOfUser from "../../api/messages/getMessagesOfUser";
interface UserListProps {
   selectedChat:any,
   handleChatSelection:(messageDetail:any)=>void
}
export default function UserList(props:UserListProps){
    const {selectedChat,handleChatSelection} = props
    // const [selectedChat,setSelectedChat] = useState('')
    const {data:messages,isLoading} = useQuery({
      queryKey:['get_messages'],
      queryFn:()=>getMessagesOfUser(localStorage.getItem('userId') as string)
    })
    return (
        <Stack
        spacing={1.5}
        sx={{
          border:'1px solid #EFEFEF',
          p:1,overflowY:'auto',
          height:400
        }}
        >
         <Box
        //  component={'form'}
         sx={{p: '2px 4px', display: 'flex', alignItems: 'center',border:`1px solid black`,borderRadius:"20px",background:'#EFEFEF',mt:1,}}
         >
            <Search fontSize="small" sx={{ml:1}}/>
             <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search.."
            
      />
      
         </Box>
         {
        messages?.map((message:any)=>(
        <Stack
        key={message?._id}
        direction={'row'}
        alignItems={'center'}
        onClick={()=>handleChatSelection(message)}
        sx={{
            cursor:'pointer',
            background:selectedChat?._id === message?._id ? '#FFDFA1':'',
            padding:selectedChat?._id === message?._id ? 1:.3,
           '&:hover':{
            background:'#FFDFA1',
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
          <Badge variant="dot" color="success" overlap="circular" badgeContent=" ">
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
              <Typography variant="body2">
                {
                message?.conversations?.at(-1)?.message?.length>22 ? `${message?.conversations?.at(-1)?.message?.slice(0,22)}...`:message?.conversations?.at(-1)?.message
                }
              </Typography>
            </Stack>
          </Box>
            <Typography variant="caption">
                {
                 new Date(message?.updatedAt).toDateString()
                }
            </Typography>
        </Stack>
        ))
        }
        </Stack>
    )
}