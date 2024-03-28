import { Box, Paper,Typography,InputBase,Button,Autocomplete, TextField, IconButton } from "@mui/material";
const options = ['Option 1', 'Option 2'];
import * as React from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
export default function ChangePassword(){
    const [showPassword,setShowPassword] = React.useState<{[key:string]:boolean}>({
        old:false,
        new:false,
        confirm:false
    })
    const handlePasswordsVisibility = (name:string)=>{
        setShowPassword({...showPassword,[name]:!showPassword[name]})
    }
    return (
        <Paper sx={{borderRadius:'8x',alignSelf:'center',p:2,mt:'5%'}}>
       <Box
        sx={{p:2}}
        >
            <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',gap:2}}>
            <Typography fontWeight={'bold'} variant={"h4"} textAlign={'center'}>
                {
                    'Change Password'
                }
            </Typography>
         <Box
         sx={{width:380,p: '2px 4px', display: 'flex',
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
         
         <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="Old password"
        type={showPassword['old']?"text":"password"}
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
         <IconButton
         onClick={()=>handlePasswordsVisibility('old')}
         >
            {
                showPassword['old']?(<VisibilityOffIcon/>):(<VisibilityIcon/>)
            }
         </IconButton>
         </Box>
         <Box
         sx={{width:380,p: '2px 4px', display: 'flex',
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
         
                 <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="New Password"
        type={showPassword['new']?"text":"password"}
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
         <IconButton
         onClick={()=>handlePasswordsVisibility('new')}
         >
            {
                showPassword['new']?(<VisibilityOffIcon/>):(<VisibilityIcon/>)
            }
         </IconButton>
         </Box>
         <Box
         sx={{width:380,p: '2px 4px', display: 'flex',
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
         
                 <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="Confirm Password"
        type={showPassword['confirm']?"text":"password"}
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
         <IconButton
         onClick={()=>handlePasswordsVisibility('confirm')}
         >
            {
                showPassword['confirm']?(<VisibilityOffIcon/>):(<VisibilityIcon/>)
            }
         </IconButton>
         </Box>
       <Button type="submit"                  
                 sx={{color:'white',borderRadius:'30px',p:1,alignSelf:'center'}}
                 variant="contained"
                 size="small"
                 >
                    <Typography variant="body2">
                        Save
                    </Typography>
                        </Button>
            </Box>
        </Box>
       </Paper>
    )
}