import { Avatar, Badge, Box, Divider, Stack, Typography,Paper,IconButton, InputBase, Button } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { useState } from "react";
import { IMAGE_URL } from "../../api/apiConfig";
interface ConvosProps {
  messageDetail:any
}
export default function Convos(props:ConvosProps){
  const {messageDetail} = props
  const [message,setMessage] = useState('')
  
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
          height:400,
          border:'1px solid #EFEFEF',
          display:'flex',
          flexDirection:'column',
          gap:1,
          p:1,
          overflowY:'auto',
          position:'relative'
        }}
        >
          {/* user details */}
             <Box
          sx={{
            display:'flex',
            gap:1,
            alignItems:'center',
            borderRadius:0,
            borderBottom:'2px solid #EFEFEF',
            p:1,
          }}
          >
          <Badge variant="dot" color="success" overlap="circular" badgeContent=" ">
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
              {`${messageDetail?.interestedParty?.phoneNumber}`}
              </Typography>
            </Stack>
          </Box>
          
          <Box
          sx={{
            height:300,
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
            src={`${IMAGE_URL}/${messageDetail?.product?.productImages?.at(0)}`}
            style={{
              objectFit:'contain'
            }}
            onError={(e)=>e.currentTarget.src = '/images/icons8_Photo_Gallery.svg'}
            />
            <Stack>
              <Typography fontWeight={'bold'}>
                {
                  messageDetail?.product?.title
                }
              </Typography>
              <Typography sx={{textTransform:'capitalize'}}>
                {
                  messageDetail?.product?.location?.descripton
                }
              </Typography>
              <Typography>
                {
                  new Intl.NumberFormat('en-Us',{maximumFractionDigits:3}).format(messageDetail?.product?.currentPrice)
                }
              </Typography>
            </Stack>
            
          </Paper>
          {/* conversations */}
         <Box sx={{mt:2,p:1,display:'flex',flexDirection:'column',gap:1,}}>
          {
            messageDetail?.conversations?.map((convo:any)=>(
               <Box 
               key={convo?._id}
                sx={{
                  alignSelf:convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.interestedParty?._id ? 'flex-end':
                            !convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.productOwner?._id ? 'flex-end':'flex-start',
                  background:convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.interestedParty?._id ? '#DAFDFC':
                             !convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.productOwner?._id ? '#DAFDFC':'#FDE6C4',          
                  // background:convo?.isFromInterestedParty && localStorage.getItem('userId') === messageDetail?.interestedParty?._id ?'#DAFDFC':"#FDE6C4",
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
         </Box>
          </Box>

         {/* action area */}
         <Box
         sx={{
          display:'flex',alignItems:'center',
          justifyContent:'space-between',
          gap:2,
          p:1,
         }}
         >
         
          <Stack direction={'row'} alignItems={'center'}>
            <Menu
            menuButton={
              <IconButton>
              <EmojiEmotionsOutlinedIcon fontSize="large" color="primary"/>
            </IconButton>
            }
            direction="top"
            arrow={false}
            viewScroll="initial"
            >
            <MenuItem>
            <EmojiPicker
            style={{
              margin:0,
              padding:0,
            }}
            width={320}
            height={350}
            onEmojiClick={(emojiData)=>setMessage(message+emojiData?.emoji)}
            />
            </MenuItem>
            </Menu>
            <IconButton>
              <KeyboardVoiceOutlinedIcon fontSize="large" color="primary"/>
            </IconButton>
            <IconButton size="small">
              <AttachFileOutlinedIcon fontSize="large" color="primary"/>
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
         <Button
         variant="contained"
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
         </Box>
        </Box>
          )
        }
        </>
    )
}