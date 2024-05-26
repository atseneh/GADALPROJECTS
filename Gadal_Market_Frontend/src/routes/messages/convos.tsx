import { Avatar, Badge, Box, Divider, Stack, Typography,Paper,IconButton, InputBase, Button, Popover } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { useContext, useEffect, useRef, useState } from "react";
import { IMAGE_URL } from "../../api/apiConfig";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import addMessage from "../../api/messages/addMesage";
import getConversation from "../../api/messages/getConversation";
import { SocketCon } from "../../components/context/socketContext";
import { getBadgeVariant } from "./userList";
import updateSeen from "../../api/messages/updateSeen";
import { NavLink } from "react-router-dom";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useDropzone } from "react-dropzone";
import Modal from '@mui/material/Modal';
import { CloseOutlined, DeleteOutline, PauseCircleOutlineOutlined, PlayCircleOutline, StopCircleOutlined } from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Lightbox from "yet-another-react-lightbox";
interface ConvosProps {
  messageDetail:any,
  onGoBack:()=>void
}

export default function Convos(props:ConvosProps){
  const {messageDetail,onGoBack} = props
  const {unreadCount} = useContext(SocketCon)
  const {connectedUsers} = useContext(SocketCon)
  const [message,setMessage] = useState('')
  const newMessageRef = useRef<HTMLDivElement|null>(null)
  const smallScreen = useSmallScreen();
  const theme = useTheme();
  const onMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedImage, setSelectedImage] = useState<any>();
  const [openLightBox,setOpenLightBox] = useState(false)
  const [openImagePreview,setOpenImagePreview] = useState(false)
  const [activeImage,seActiveImage] = useState('0')
  const openImages = (acceptedImages:any) => {
    const newFile =   {
        file:acceptedImages?.at(0),
        preview: URL.createObjectURL(acceptedImages?.at(0)),
      }
    console.log(newFile)
    setSelectedImage(newFile)
  };
const onDrop = (acceptedFiles:any) => {
    openImages(acceptedFiles);
  };
   //image dropzone initialization
const { getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple:false,
    accept:{
        'image/png':['.png'],
        'image/jpg':['.jpg'],
        'image/jpeg':['.jpeg'],
      },
})
const [recordedVoice,setRecordedVoice] = useState<Blob | null>(null)
console.log(recordedVoice)
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const [recording, setRecording] = useState<boolean>(false);
const audioChunksRef = useRef<Blob[]>([]);
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorderRef.current = mediaRecorder;
  mediaRecorder.ondataavailable = (event) => {
    audioChunksRef.current.push(event.data); 
  };
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = [];
    setRecordedVoice(audioBlob);
  };

  mediaRecorder.start();
  setRecording(true);
};
const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }
};
const abortRecording = ()=>{
  if(mediaRecorderRef?.current){
    mediaRecorderRef.current = null
    setRecording(false)
    setRecordedVoice(null)
  }
}
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'emoji-popover' : undefined
  const {data:conversations,isLoading:convosLoading} = useQuery({
    queryKey:['get_conversations',messageDetail],
    queryFn:()=>getConversation(messageDetail?._id)
  })
  const queryClient = useQueryClient();
  const { isPending, submittedAt, variables, mutate, isError } = useMutation({
    mutationFn:addMessage,
    mutationKey:['add_message'],
    onSuccess:()=>{
      setMessage('');
      setSelectedImage(null)  
    },
    onSettled:async ()=>{
      queryClient.invalidateQueries(({queryKey:['get_messages']}))
      if(newMessageRef.current){
        newMessageRef.current.scrollIntoView({behavior:'smooth'})
      }
      return await queryClient.invalidateQueries(({queryKey:['get_conversations']}))
    } 
  })
  const {mutate:mutateSeen} = useMutation({
    mutationKey:['update_seen',],
    mutationFn:updateSeen,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['get_messages']})
      queryClient.invalidateQueries({queryKey:['get_unread_Messages_count']})
    }
  })
  const handleMessageSent = (message?:string)=>{
    if(recording){
      stopRecording();
    }
    const formData = new FormData()
    formData.append('sender',localStorage.getItem('userId') as string,)
    formData.append('receiver',localStorage.getItem('userId') === conversations?.product?.consignee ? conversations?.interestedParty : conversations?.product?.consignee)
    if(selectedImage){
      formData.append('file',selectedImage?.file)
      formData.append('message',JSON.stringify({
        message:'',
        messageType:'image'
      }))
    }
    if(recordedVoice){
      formData.append('file',recordedVoice)
      formData.append('message',JSON.stringify({
        message:'',
        messageType:'voice'
      }))
    }
   if(message && !selectedImage && !recordedVoice){
    formData.append('message',JSON.stringify({
      message:message,
      messageType:'text'
    }))
   }
    formData.append('messageId',messageDetail?._id,)
    // const messaePayload = {
    //   messageId:messageDetail?._id,
    //   message:{
    //     message,
    //     messageType:'text'
    //   },
    //   sender:localStorage.getItem('userId') as string,
    //   receiver:localStorage.getItem('userId') === conversations?.product?.consignee ? conversations?.interestedParty : conversations?.product?.consignee
    // }
    mutate(formData)
  }
 useEffect(()=>{
  mutateSeen({
    messageId:messageDetail?._id,
    userId:localStorage.getItem('userId') as string
  })
  if(newMessageRef.current){
    newMessageRef.current.scrollIntoView({behavior:'smooth'})
  }
 },[unreadCount,newMessageRef])
 useEffect(()=>{
  if(selectedImage){
    setOpenImagePreview(true)
    return;
  }
  setOpenImagePreview(false)
 },[selectedImage])
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
          <NavLink
           to={`/products/${conversations?.product?._id}`}
           style={({isTransitioning }) => {
               return {
                 color:'black',
                 textDecoration:'none',
                 viewTransitionName: isTransitioning ? "slide" : "",
                 alignSelf:'center',
               };
             }}
          >
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
          </NavLink>
          {/* conversations */}
         <Box 
          sx={{
            mt:2,
            p:1,
            display:'flex',
            flexDirection:'column',
            gap:1,
            height:'100vh',
            overflowY:'auto',
            pr:smallScreen?4:2,
            }}>
          {
            conversations?.conversations?.map((convo:any)=>(
               <Box 
               key={convo?._id}
                sx={{
                  alignSelf:convo?.sender === localStorage.getItem('userId') ? 'flex-end' : 'flex-start',
                  background:convo?.sender === localStorage.getItem('userId') ? '#DAFDFC' : '#FDE6C4',
                  p:1,
                  borderRadius:'8px',
                }}
               >
                {
                  convo?.message?.messageType === 'text' && (
                    <Typography>
                    {
                      convo.message?.message
                    }
                   </Typography>
                  )
                }
                {
                  convo?.message?.messageType === 'image' && (
                    <Paper
                    sx={{
                    p:1,
                    cursor:'pointer',
                    }}
                    onClick = {()=>{
                      setOpenLightBox(true)
                    }}
                    >
                      <img
                      src={
                        `${IMAGE_URL}/${convo?.message?.message}`
                      }
                      style={{
                        width:200,
                        objectFit:'contain'
                      }}
                      />
                    </Paper>
                  )
                }
               </Box>
            ))
          }
         
          {
            isPending && (
              <Box 
               sx={{
                alignSelf:variables?.get('sender') === localStorage.getItem('userId') ? 'flex-end' : 'flex-start',
                background:variables?.get('sender') === localStorage.getItem('userId') ? '#DAFDFC' : '#FDE6C4',
                 p:1,
                 borderRadius:'8px',
                 opacity:.5,
               }}
              >
              {
                JSON.parse(variables.get('message') as string)?.messageType ==='text' && (
                  <Typography>
                  {
                   JSON.parse(variables?.get('message') as string)?.message
                   }
                 </Typography>
                )
              }
                {
                JSON.parse(variables.get('message') as string)?.messageType ==='image' && (
                  <Paper
              sx={{
                p:1,
                // alignSelf:'flex-end'
              }}
              >
                <img
                src={
                  selectedImage?.preview
                }
                style={{
                  width:200,
                  objectFit:'contain'
                }}
                />
              </Paper>
                )
              }
               {
            JSON.parse(variables.get('message') as string)?.messageType ==='voice' && (
              <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              sx={{
                p:.5,
                border:'1px solid black',
                alignSelf:'flex-end',
                width:250
              }}
              >
              <IconButton
              size="small"
              >
                {/* <PlayCircleOutline 
                fontSize="large"
                color="primary"
                /> */}
                 <PauseCircleOutlineOutlined 
                fontSize="large"
                color="primary"
                />
              </IconButton>
              </Stack>
            )
          }
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
         {
          !convosLoading && (
            <Box
            sx={{
             borderTop:'1px solid #F1F1F1',
             pr:1,
           }}
           component={'form'}
           onSubmit={(e)=>{
             e.preventDefault();
             if(!message && !recordedVoice){
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
               <IconButton
               onClick={handleClick}
               sx={{
                visibility: recording ? 'hidden' : 'vissible'
               }}
               >
                   <EmojiEmotionsOutlinedIcon 
                   fontSize={smallScreen ? 'medium' : "large"} 
                   color="primary"
                   />
                 </IconButton>
                 <Popover
                             id={id}
                             open={open}
                             anchorEl={anchorEl}
                             onClose={handleClose}
                             anchorOrigin={{
                               vertical: 'top',
                               horizontal: 'right',
                             }}
                             transformOrigin={{
                               vertical: 'bottom',
                               horizontal: 'left',
                             }}
                             slotProps={{
                               paper:{
                                 sx:{
                                   mb:8,
                                   // boxShadow:'none',
                                   borderRadius:'8px',
                                   height:300,
                                   width:320,  
                                   // maxHeight:500
                                 }
                               }
                             }}
                 >
                 <Picker 
              data={data}
              onEmojiSelect={(emoji:any)=>{
                setMessage(`${message}${emoji?.native}`)
              }}
            />
                 </Popover>
                 <IconButton
                 onClick={startRecording}
                 sx={{
                  visibility:recording ? 'hidden' : 'vissible'
                 }}
                 >
                   <KeyboardVoiceOutlinedIcon 
                   fontSize={smallScreen ? 'medium' : "large"} 
                   color="primary"
                   />
                 </IconButton>  
                 <div
                   {...getRootProps({className: 'dropzone'})}
                   style={{
                    visibility:recording ? 'hidden' : 'visible'
                   }}
                 >
                  <input {...getInputProps()} /> 
                 <IconButton size="small">
                   <AttachFileOutlinedIcon 
                     fontSize={smallScreen ? 'medium' : "large"} 
                     color="primary"
                     />
                 </IconButton>
                 </div>
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
                 placeholder= {recording ? 'Recording...' : "Type Message.."}
                 readOnly={recording}
                />
           
              </Box>
               {
                 smallScreen ? (
                   <>
                    {
                     message || recording ? (
                      <Stack
                      direction={'row'}
                      alignItems={'center'}
                      gap={1}
                      >
                        <IconButton
                        onClick={abortRecording}
                        >
                          <DeleteOutline
                          color="error"
                          />
                        </IconButton>
                         <IconButton
                       type="submit"
                       >
                       <SendIcon 
                       color="primary"            
                       />
                         </IconButton>
                      </Stack>
                     ):
                     null
                    }
                   </>
                 
                 ):
                 (
                  <Stack
                  direction={'row'}
                  alignItems={'center'}
                  gap={1}
                  >
                    <IconButton
                    sx={{
                      visibility:recording?'':'hidden'
                    }}
                    onClick={abortRecording}
                    >
                      <DeleteOutline
                      color="error"
                      />
                    </IconButton>
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
                  </Stack>
                 )
               }
              </Box>
             </Box>
          )
         }
        </Box>
          )
        }
        <Modal
  open={openImagePreview}
  onClose={()=>setOpenImagePreview(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={{
     position: 'absolute' as 'absolute',
     top:onMobile? '40%':'50%',
     left: '50%',
    //  bottom:2,
     transform: 'translate(-50%, -50%)',
     width: onMobile ? '100%':400,
     bgcolor: 'background.paper',
     border: '2px solid #000',
    //  boxShadow: 24,
     p: 2,
    //  m:2,
  }}>
    <Stack
    spacing={1}
    >
      <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      >
        <Typography
        variant="h6"
        >
          Send Photo
        </Typography>
        <IconButton
        onClick={()=>{
          setSelectedImage(null)
          setOpenImagePreview(false)
        }}
        >
          <CloseOutlined/>
        </IconButton>
      </Stack>
      <Divider/>
      <img
      alt="selected image"
      src={selectedImage?.preview}
      height={400}
      style={{
        objectFit:'contain'
      }}
      />
    
     <Button
      variant="contained"
      sx={{
        color:'white',
        alignSelf:'flex-end',
        textTransform:'capitalize'
      }}
      onClick={()=>{
        handleMessageSent();
        setOpenImagePreview(false)
      }}
      >
        Send
      </Button>
     </Stack>
  </Box>
</Modal>
<Lightbox
        index={Number(activeImage)}
        open={openLightBox}
        close={()=>setOpenLightBox(false)}
        slides={
          conversations?.conversations?.filter((convo:any)=>convo?.message?.messageType === 'image')?.map((i:any)=>(
              {
                  src: `${IMAGE_URL}/${i?.message?.message}`,
                  
              }
          ))
         }
        />
        </>
    )
}