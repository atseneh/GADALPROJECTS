import { Box, Paper,Typography,InputBase,Button,Autocomplete, TextField, IconButton } from "@mui/material";
const options = ['Option 1', 'Option 2'];
import * as React from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
export default function CreateSubAdmin(){
    const [value, setValue] = React.useState<string | null>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [showPassword,setShowPassword] = React.useState(false)
    return (
        <Paper sx={{borderRadius:'8x',alignSelf:'center',p:2,mt:'5%'}}>
       <Box
        sx={{p:2}}
        >
            <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',gap:2}}>
            <Typography fontWeight={'bold'} variant={"h4"} textAlign={'center'}>
                {
                    'Create Sub Admin'
                }
            </Typography>
            <Box
         component={'form'}
         sx={{width:380,p: '2px 4px', display: 'flex',  
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
        <img width={16} src="/icons/icons8_Email_1.svg" style={{marginLeft:'6px'}}/>
                 <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold',
        
          }}
        placeholder="Email Or Phone Number"
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
      
         </Box>
         <Box
         sx={{width:380,p: '2px 4px', display: 'flex',
         background:'#EFEFEF',
         alignItems: 'center',borderRadius:"10px",height:45}}
         >
         <img width={16} src="/icons/icons8_password.svg" style={{marginLeft:'6px'}}/>
                 <InputBase
        sx={{ ml: 1, flex: 1,fontWeight:'bold' }}
        placeholder="Password"
        type={showPassword?"text":"password"}
        inputProps={{ 'aria-label': 'search gadal market' }}
      />
         <IconButton
         onClick={()=>setShowPassword(!showPassword)}
         >
            {
                showPassword?(<VisibilityOffIcon/>):(<VisibilityIcon/>)
            }
         </IconButton>
         </Box>
      
         <Autocomplete
         
        value={value}
        onChange={(event: any, newValue: string | null) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        sx={{alignSelf:'center',width:'30ch',}}
        renderInput={(params) => <TextField sx={{backgroundColor:'white',borderRadius:'20px'}} {...params} label="Sub Category Previlages" />}
      />
       <Button type="submit"                  
                 sx={{color:'white',borderRadius:'30px',p:1,alignSelf:'center'}}
                 variant="contained"
                 size="small"
                 >
                    <Typography variant="body2">
                        Create admin
                    </Typography>
                        </Button>
            </Box>
        </Box>
       </Paper>
    )
}