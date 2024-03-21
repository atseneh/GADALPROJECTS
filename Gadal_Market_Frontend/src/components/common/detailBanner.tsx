import { Typography } from "@mui/material";
import  Box  from "@mui/material/Box";
import useSmallScreen from "../../utils/hooks/useSmallScreen";
interface detailBannerProps {
    service:string;
    category:string;
    transactionType:'rent'|'sale'
}
export default function DetailBanner(props:detailBannerProps){
    const {category,service,transactionType} = props
    const smallScreen = useSmallScreen()
    return (
        <Box
        sx={{
            width:'100%',
            height:85,
            display:'flex',
            gap:3,
            alignItems:'center',
             background:'url(/images/Background.svg)',
             backgroundSize:'cover',                   
             backgroundRepeat:'no-repeat',
             backgroundPosition: 'center center',
            }}
        >
              <img width={100} src="/images/propertyy.svg" style={{marginLeft:smallScreen?'8px':'32px'}}/>
         <Box>
            <Typography sx={{color:'white',fontStyle:'italic',fontWeight:'bold',textTransform:'capitalize'}} variant={smallScreen?"h6":'h4'}>
                {
                 `${category} ${service} for ${transactionType}`
                }
            </Typography>
         </Box>
        </Box>
    )
}