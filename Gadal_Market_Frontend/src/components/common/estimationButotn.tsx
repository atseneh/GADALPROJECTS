import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"
export default function EstimationButton(){
    const navigate = useNavigate()
    return (
        <Box sx={{mt:7}}>
        <Button 
        onClick={()=>navigate('/estimation')}
        sx={{background:'#EFF1F0',borderRadius:'16px',border:'1px solid black',fontWeight:'bold'}} 
        variant='contained'>
            <img width={18} src='/images/pricing.svg' style={{marginRight:'4px'}}/>
            Get Estimation
            </Button>
     </Box>
    )
}