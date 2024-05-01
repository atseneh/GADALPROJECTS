import { Box, Divider, Grid, Paper, Typography,useTheme } from "@mui/material";
import sideNavItems from "../utils/sideNavItems";
import TopNav from "../components/topNav";
import { Outlet, useLocation,useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
function replaceDashWithSpace(inputString:string) {
  // Check if the string has words separated by "-"
  if (/-/.test(inputString)) {
    // Replace "-" with a space
    return inputString.replace(/-/g, ' ');
  } else {
    // If no "-", return the original string
    return inputString;
  }
}
export default function Root(){
const theme = useTheme()
const {pathname} = useLocation()
const navigate = useNavigate()
let topTitle = ''
const params = useParams()
const {title} = params
if(pathname==='/'){
  topTitle = 'Dashboard'
}
if(title){
  topTitle = replaceDashWithSpace(title)
}
 return (
   <Grid container spacing={2}>
    <Grid item xs={12} md={2}>
    <Paper
    sx={{
        display:'flex',flexDirection:'column',p:1,
        alignItems:'center',borderRadius:'8px',
        minHeight:'100vh'
    }}
    >
        <img width={150} src="/logo.svg"/>
        <Divider sx={{m:1}}/>
        <Box sx={{display:'flex',flexDirection:'column',gap:3}}>
        {
        sideNavItems.filter(nav=>!nav.hidden)?.map((item)=>(
        <Grid
         container spacing={1}
         alignItems={'center'}
         onClick={()=>{
          navigate(item.path)
         }}
          sx={{
            cursor:'pointer',
            color:item.path.includes(title as string)?'white':'',
            background:item.path.includes(title as string)?theme.palette.primary.main:'',
            pb:item.path.includes(title as string)?1:0 ,
            borderRadius:item.path.includes(title as string)?'8px':0,
            '&:hover':{
                color:'white',
                background:theme.palette.primary.main,
                pb:1 ,
                borderRadius:'8px',
            },
          }}
          >
        <Grid item lg={2}>
         <img width={18} src={item.iconPath}/>
        </Grid>
        <Grid item lg={10}>
         <Typography fontSize={'1rem'} variant="body2" fontWeight={'bold'}>
            {item.description}
        </Typography>
        </Grid>
        </Grid>
        ))
     }
        </Box>
    </Paper>
    </Grid>
    <Grid item xs={12} sm={10}>
     <TopNav title={topTitle}/>
     <Box sx={{mt:1}}>
      <Outlet/>
     </Box>
    </Grid>
   
   </Grid>
 )   
}