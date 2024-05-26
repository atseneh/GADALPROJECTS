import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCampaigns from "../api/getCampaigns";
import createCampaign from "../api/createCampaign";
import { useState } from "react";
const CampaignTextField = styled(TextField)({
    backgroundColor:'white',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  });
export default function Campaign(){
  const [campaignMessage,setCampaignMessage] = useState('')
  const queryClient = useQueryClient();
  const {data:campaigns,isLoading} = useQuery({
    queryKey:['get_campaigns'],
    queryFn:getCampaigns
  })
  const {mutate,isPending} = useMutation({
    mutationFn:createCampaign,
    mutationKey:['create_campaign'],
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['get_campaigns']})
    }
  })
  const handleCampaignCreation = ()=>{
    if(!campaignMessage){
      return
    }
    mutate({
      campaignMessage
    })
  }
    return (
       <Box
       sx={{
        display:'flex',
        flexDirection:'column',
        gap:1,
        
       }}
       >
       <Typography sx={{alignSelf:'center',mt:1,color:'#343333'}} variant="h6" >
        This Message is sent to all registred Users
       </Typography>
       <CampaignTextField
       fullWidth
       multiline
       rows={4}
       value={campaignMessage}
       onChange={(e)=>setCampaignMessage(e.target.value)}
       />
       <Button
       size="small"
       sx={{alignSelf:'flex-end',color:'white',width:100,fontWeight:'bold'}}
       variant="contained"
       onClick={handleCampaignCreation}
       disabled = {isPending}
       >
        Send
       </Button>
         {
          isLoading ? (
            <Box
            sx={{
              alignSelf:'center'
            }}
            >
              <CircularProgress/>
            </Box>
          ):
          (
            <>
             {
              Array.isArray(campaigns) && campaigns?.length > 0 ?
              (
                <>
                 {
            campaigns?.map((campaign)=>(
                <Box key={campaign?._id} sx={{display:'flex',flexDirection:'column',gap:1,}}>
                    <Typography alignSelf={'center'}>
                        {
                          new Date(campaign?.updatedAt).toLocaleDateString()
                        }
                    </Typography>
                <CampaignTextField
                 fullWidth
                 multiline
                 rows={4}
                 InputProps={{readOnly:true}}
                 defaultValue={campaign?.notification}
                />
                </Box>  
                
            ))
            }
                </>
              ):
              (
               <Box
               sx={{
                alignSelf:'center'
               }}
               >
                <Typography>
                  No Campaigns yet
                </Typography>
               </Box>
              )
             }
            </>
          )
         }
       </Box>
    )
}