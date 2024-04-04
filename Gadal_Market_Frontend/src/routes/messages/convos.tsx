import { Avatar, Badge, Box, Divider, Stack, Typography,Paper,IconButton, InputBase, Button } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { useContext, useRef, useState } from "react";
import { IMAGE_URL } from "../../api/apiConfig";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import addMessage from "../../api/messages/addMesage";
import getConversation from "../../api/messages/getConversation";
import { SocketCon } from "../../components/context/socketContext";
import { getBadgeVariant } from "./userList";
interface ConvosProps {
  messageDetail:any,
  onGoBack:()=>void
}
export default function Convos(props:ConvosProps){
  const {messageDetail,onGoBack} = props
  const {connectedUsers} = useContext(SocketCon)
  const [message,setMessage] = useState('')
  const newMessageRef = useRef<HTMLDivElement|null>(null)
  const smallScreen = useSmallScreen();
  const {data:conversations,isLoading:convosLoading} = useQuery({
    queryKey:['get_conversations',messageDetail],
    queryFn:()=>getConversation(messageDetail?._id)
  })
  const queryClient = useQueryClient();
  const { isPending, submittedAt, variables, mutate, isError } = useMutation({
    mutationFn:addMessage,
    mutationKey:['add_message'],
    onSettled:async ()=>{
      queryClient.invalidateQueries(({queryKey:['get_messages']}))
      if(newMessageRef.current){
        newMessageRef.current.scrollIntoView({behavior:'smooth'})
      }
      return await queryClient.invalidateQueries(({queryKey:['get_conversations']}))
    }
  })
  const handleMessageSent = (message:string)=>{
    const messaePayload = {
      messageId:messageDetail?._id,
      message,
      sender:localStorage.getItem('userId') as string,
      receiver:localStorage.getItem('userId') === conversations?.product?.consignee ? conversations?.interestedParty : conversations?.product?.consignee
    }
    mutate(messaePayload)
    setMessage('');
  }

    return (
        <>
        {
          !messageDetail ? 
          (
           <Box
           sx={{
            p:1,
            display:'flex',
            flexDirection:'column'
           }}
           >
             <Typography
              alignSelf={'center'}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                
              }}
              >
               Select a chat from the left side 
            </Typography>
           </Box>
          ):
          (
            <Box 
        sx=
        {{
          height:smallScreen ? '100vh' : 'calc(100vh - 183px)',
          border:'1px solid #EFEFEF',
          display:'flex',
          flexDirection:'column',
          gap:1,
          p:1,
          overflowY:'auto',
          position:'relative',
          width:smallScreen?'100vw':'100%'
        }}
        >
          {/* user details */}
             <Box
          sx={{
            display:'flex',
            gap:2,
            alignItems:'center',
            borderRadius:0,
            borderBottom:'2px solid #EFEFEF',
            p:1,
          }}
          >
           {
            smallScreen && (
              <IconButton
              onClick={onGoBack}
              >
              <ArrowBackIcon/>
            </IconButton>
            )
           }
          <Badge 
            variant={
              getBadgeVariant(messageDetail?.interestedParty?._id,messageDetail?.productOwner?._id,connectedUsers)
            }
            color="success" 
            overlap="circular"
            >
             <Avatar/>
            </Badge>
            <Stack>
              <Typography fontWeight={'bold'} sx={{textTransform:'capitalize'}}>
                {
                  localStorage.getItem('userId') === messageDetail?.interestedParty?._id ?
                  `${messageDetail?.productOwner?.firstName} ${messageDetail?.productOwner?.lastName}`
                  :
                  `${messageDetail?.interestedParty?.firstName} ${messageDetail?.interestedParty?.lastName}`
                }
              </Typography>
              <Typography variant="body2">
              {
                  localStorage.getItem('userId') === messageDetail?.interestedParty?._id ?
                  `${messageDetail?.productOwner?.phoneNumber}`
                  :
                  `${messageDetail?.interestedParty?.phoneNumber}`
                }
              </Typography>
            </Stack>
          </Box>
          {/* product info and conversations */}
          
             {
              convosLoading ? (
                <Typography
                sx={{alignSelf:'center'}}
                >
                  Loading...
                </Typography>
              ):
              (
                <Box
          sx={{
            overflowY:'auto',
            display:'flex',
            flexDirection:'column',
            gap:1,
          }}
          >
               {/* product information */}
          <Paper
          sx={{
            display:'flex',
            alignItems:'center',
            gap:1,
            borderRadius:0,
            alignSelf:'center',
            p:1,
          }}
          >
            <img
            width={100}
            height={80}
            src={`${IMAGE_URL}/${conversations?.product?.productImages?.at(0)}`}
            style={{
              objectFit:'contain'
            }}
            onError={(e)=>e.currentTarget.src = '/images/icons8_Photo_Gallery.svg'}
            />
            <Stack>
              <Typography fontWeight={'bold'}>
                {
                  conversations?.product?.title
                }
              </Typography>
              <Typography sx={{textTransform:'capitalize'}}>
                {
                  conversations?.product?.location?.descripton
                }
              </Typography>
              <Typography>
                {
                  new Intl.NumberFormat('en-Us',{maximumFractionDigits:3}).format(conversations?.product?.currentPrice)
                }
              </Typography>
            </Stack>
            
          </Paper>
          {/* conversations */}
         <Box 
          sx={{
            mt:2,
            p:1,
            display:'flex',
            flexDirection:'column',
            gap:1,
            // height:'calc(100vh - 59px)',
            height:'100%',
            overflowY:'auto',
            pr:smallScreen?4:2,
            border:'1px solid black'
            }}>
          {
            conversations?.conversations?.map((convo:any)=>(
               <Box 
               key={convo?._id}
                sx={{
                  // alignSelf:convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.interestedParty?._id ? 'flex-end':
                  //           !convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.productOwner?._id ? 'flex-end':'flex-start',
                  // background:convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.interestedParty?._id ? '#DAFDFC':
                  //            !convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.productOwner?._id ? '#DAFDFC':'#FDE6C4',          
                  alignSelf:convo?.sender === localStorage.getItem('userId') ? 'flex-end' : 'flex-start',
                  background:convo?.sender === localStorage.getItem('userId') ? '#DAFDFC' : '#FDE6C4',
                  p:1,
                  borderRadius:'8px',
                }}
               >
               <Typography>
                  {
                    convo.message
                  }
                 </Typography>
               </Box>
            ))
          }
          {
            isPending && (
              <Box 
               sx={{
                //  alignSelf:variables?.isFromBuyer && localStorage.getItem('userId') === messageDetail?.interestedParty?._id ? 'flex-end':
                //            !variables?.isFromBuyer && localStorage.getItem('userId') === messageDetail?.productOwner?._id ? 'flex-end':'flex-start',
                //  background:variables?.isFromBuyer && localStorage.getItem('userId') === messageDetail?.interestedParty?._id ? '#DAFDFC':
                //             !variables?.isFromBuyer && localStorage.getItem('userId') === messageDetail?.productOwner?._id ? '#DAFDFC':'#FDE6C4',          
                alignSelf:variables?.sender === localStorage.getItem('userId') ? 'flex-end' : 'flex-start',
                background:variables?.sender === localStorage.getItem('userId') ? '#DAFDFC' : '#FDE6C4',

                 p:1,
                 borderRadius:'8px',
                 opacity:.5,
               }}
              >
              <Typography>
                 {
                   variables.message
                 }
                </Typography>
              </Box>
            )
          }
          {/* empty div to scroll to when new messages arrive and sent */}
          <div
          ref={newMessageRef}
          >

          </div>
         </Box>
          </Box>
              )
             }

         {/* action area */}
        <Box
       sx={{
        position:'absolute',
        bottom:2,
        left:0,
        right:22,
        borderTop:'1px solid #F1F1F1'
      }}
      component={'form'}
      onSubmit={(e)=>{
        e.preventDefault();
        if(!message){
          return;
        }
        handleMessageSent(message);
      }}
        >
        <Box
         sx={{
          display:'flex',alignItems:'center',
          justifyContent:'space-between',
          gap:1,
          p:.5,
         }}
         >
         
          <Stack direction={'row'} alignItems={'center'}>
          
            <IconButton>
              <KeyboardVoiceOutlinedIcon 
              fontSize={smallScreen ? 'medium' : "large"} 
              color="primary"
              />
            </IconButton>
            <IconButton size="small">
              <AttachFileOutlinedIcon 
                fontSize={smallScreen ? 'medium' : "large"} 
                color="primary"
                />
            </IconButton>
          </Stack>
          <Box
           sx={{
            p:'4px 6px',borderRadius:"20px",
            background:'#EFEFEF',
            flexGrow:1,
          }}
           >
             <InputBase
             value={message}
             onChange={(e)=>setMessage(e.target.value)}
             autoFocus
            sx={{ ml:1}}
            placeholder="Type Message.."
            
      />
      
         </Box>
          {
            smallScreen ? (
              <>
               {
                message ? (
                  <IconButton
                  type="submit"
                  >
                  <SendIcon 
                  color="primary"            
                  />
                    </IconButton>
                ):
                null
               }
              </>
            
            ):
            (
              <Button
         variant="contained"
         type="submit"
         sx={{
          color:'white',
          display:'flex',
          alignItems:'center',
          gap:1,
          
         }}
         >
          <Typography variant="body2">
            Send
          </Typography>
          <SendIcon fontSize="small"/>
         </Button>
            )
          }
         </Box>
        </Box>
        </Box>
          )
        }
        </>
    )
}