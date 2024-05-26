import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import '../../index.css'
export default function ServiceAssurance(){
const smallScreen = useSmallScreen()
    return (
        <>
        <Box
        className="hideScrollBar"
        sx={{
            display:'flex',
            gap:smallScreen?2:3,
            // alignItems:'center',
            ml:smallScreen?2:8,
            overflow:'auto'
            }}>
           <Box sx={{display:'flex',alignItems:'center',gap:1}}>
           <Box>
             <img width={smallScreen?50:60} src="/images/Easy.svg"/>
            </Box>
            <Box>
                <Typography variant={smallScreen?'body2':"h6"} fontWeight={'bold'}>
                    Easy Access
                </Typography>
                <Box sx={{width:130}}>
                <Typography  
                    variant="caption" 
                    fontWeight={'light'}
                   
                    >
                    Your can use our free website any time
                </Typography>
                </Box>
            </Box>
           </Box>
           <Box sx={{display:'flex',alignItems:'center',gap:1}}>
           <Box>
           <img width={smallScreen?60:75} src="/images/Protected.svg"/>
            </Box>
            <Box>
            <Typography variant={smallScreen?'body2':"h6"} fontWeight={'bold'}>
                    Protected
                </Typography>
                <Box sx={{width:120}}>
                <Typography  variant="caption" fontWeight={'light'}>
                    Our website is Safe
                </Typography>
                </Box>
            </Box>
           </Box>
           <Box sx={{display:'flex',alignItems:'center',gap:1}}>
           <Box>
           <img width={smallScreen?60:75} src="/images/oprator.svg"/>
            </Box>
            <Box>
            <Typography variant={smallScreen?'body2':"h6"} fontWeight={'bold'}>
                    12/7 Support
                </Typography>
                <Box sx={{width:120}}>
                <Typography  variant="caption" fontWeight={'light'}>
                    Dedicated Support
                </Typography>
                </Box>
            </Box>
           </Box>
          
        </Box>
        </>
    )
}
