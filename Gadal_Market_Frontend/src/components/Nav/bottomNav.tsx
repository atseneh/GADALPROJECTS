import { Box, Card,Button} from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useScrollDirection } from "../../utils/hooks/useScrollDirection";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate,useLocation} from "react-router-dom";
import { styled } from '@mui/material/styles';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { useContext } from "react";
import { SocketCon } from "../context/socketContext";
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    color:'white'
  },
}));
function BottomNav() {
    const direction = useScrollDirection()
    const navigate = useNavigate()
    const location = useLocation()
    const {pathname} = location
    // const theme = useTheme()
    const loggedIn = localStorage.getItem('token')
    const {unreadCount} = useContext(SocketCon)
  return (
    <>
    
      {
        direction==='up'&&(
            <Card
            sx={{mt:1,position:'fixed',bottom:0,left:0,right:0}}
            >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            
            
          }}
        >
          <Button
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor:'pointer',
            color:pathname==='/'?'primary':'inherit'
          }}
          onClick = {()=>{
            navigate('/')
          }}
        >
          <HomeIcon  />
          <small style={{ fontWeight: "bold" }}>Home</small>
        </Button>
          <Button
            
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor:'pointer',
              color:pathname==='/categories'?'primary':'inherit'
            }}
            onClick={()=>navigate('/categories')}
          >
            <CategoryOutlinedIcon  />
            <small style={{ fontWeight: "bold" }}>Category</small>
          </Button>
          <Button
          
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor:'pointer',
              color:pathname==='/post'?'primary':'inherit'
              
            }}
            onClick = {()=>{
              if(loggedIn){
              navigate('/post')
              return;
              }
              navigate('/login')
            }}
          >
            <AddCircleOutlineOutlinedIcon color="primary"/>
            <small style={{ fontWeight: "bold" }}>Post</small>
          </Button>
            {
              loggedIn ? (
                <>
                <Button
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor:'pointer',
              color:pathname==='/yourFavs'?'primary':'inherit'
            }}
            onClick = {()=>{
              navigate('/yourFavs')
            }}
          >
            <FavoriteBorderOutlinedIcon  />
            <small style={{ fontWeight: "bold" }}>Favourites</small>
          </Button>
            <Button
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor:'pointer',
            color:pathname==='/messages'?'primary':'inherit'
          }}
          onClick = {()=>navigate('/messages')}
        >
          <StyledBadge
           color="primary"
           badgeContent={unreadCount}
           
          >
          <ChatBubbleOutlineOutlinedIcon/>
          </StyledBadge>
          <small style={{ fontWeight: "bold" }}>Messages</small>
        </Button>
                </>
              ):
              (
                null
                )
            }
        </Box>
      </Card>
        )
      }
    </>
  );
}

export default BottomNav;
