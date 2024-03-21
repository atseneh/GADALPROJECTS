import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function PostSuccess(){
 const navigate = useNavigate()
    return (
    <Box sx={{display:'flex',flexDirection:'column',p:2,mt:'5%',mb:'10%',ml:'10%',mr:'10%'}}>
        <Box sx={{alignSelf:'center',display:'flex',flexDirection:'column',gap:1}}>
            <Typography variant="h5" sx={{color:'green',textAlign:'center'}}>
            Congratulation Your Item is Successfully Posted On Gadal Market !!
            </Typography>
            <Button
            onClick={()=>navigate('/')}
            variant="contained" sx={{alignSelf:'center',color:'white'}}>
                Continue Browsing
            </Button>
        </Box>
    </Box>
    )
}