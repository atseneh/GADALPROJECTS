import { Box, Button, TextField, Typography } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
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
       />
       <Button
       size="small"
       sx={{alignSelf:'flex-end',color:'white',width:100,fontWeight:'bold'}}
       variant="contained"
       >
        Send
       </Button>
         {
            [1,2,3].map((item)=>(
                <Box key={item} sx={{display:'flex',flexDirection:'column',gap:1,}}>
                    <Typography alignSelf={'center'}>
                        Today 12:34 PM
                    </Typography>
                <CampaignTextField
                 fullWidth
                 multiline
                 rows={4}
                 InputProps={{readOnly:true}}
                 defaultValue={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus non molestiae incidunt assumenda deserunt voluptatibus cupiditate, repudiandae iste, dolorem quo odio? Pariatur eaque architecto deserunt rerum itaque ad libero rem.'}
                 
                />
                </Box>  
                
            ))
         }
       </Box>
    )
}