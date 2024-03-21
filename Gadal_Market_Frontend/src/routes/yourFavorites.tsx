import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useSmallScreen from "../utils/hooks/useSmallScreen";
import Favourites from "./profile/favourites";
export default function YourFav(){
const smallScreen = useSmallScreen()
    return (
       <>
        <Box
        sx={{
            width:'100%',
            height:85,
            display:'flex',
            mt:2,
            gap:1,
            alignItems:'center',
             background:'url(/images/Background.svg)',
             backgroundSize:'cover',                   
             backgroundRepeat:'no-repeat',
             backgroundPosition: 'center center',
            }}
        >
         <Box>
            <Typography sx={{color:'white',fontStyle:'italic',fontWeight:'bold',textTransform:'capitalize',ml:4}} variant={smallScreen?"h6":'h3'}>
              Your favorites
            </Typography>
         </Box>
        </Box>
        <Favourites hideTitle/>
       </>
    )
}