import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import getPercentOff from "../../utils/helpers/getPercentOff";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import useSmallScreen from "../../utils/hooks/useSmallScreen";
import Rating from "@mui/material/Rating";
import { NavLink } from "react-router-dom";
import { IMAGE_URL } from "../../api/apiConfig";
export default function ProductCard2(props:{data:any}){
    const smallScreen = useSmallScreen()
    const {data} = props
    return (
        <NavLink
        to={`/products/${data?._id}`}
        style={({isTransitioning }) => {
            return {
              color:'black',
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
             <Box
        sx={{display:'flex',gap:1,mt:2,alignItems:smallScreen?'flex-start':'center',flexDirection:smallScreen?'column':'row'}}
        >
            <Box
            sx={{
            width:220,
            height:smallScreen?250:180,
            position:'relative',
             borderRadius:'20px',
             background:`url(${IMAGE_URL}/${data?.productImages?.at(0)})`,
             backgroundSize:'contain',                   
             backgroundRepeat:'no-repeat',
             backgroundPosition: 'center center',
            }}
            >
                <IconButton
                onClick={(e)=>{
                    e.preventDefault()
                    // alert(`${data?._id} added to fav`)
                }}
                sx={{
                 position:'absolute',
                 top:1,
                 right:1,
                 
                }}
                >
                <FavoriteBorderOutlinedIcon
                sx={{
                    border: '2px solid white',
                    borderRadius: '50%',
                    padding: '5px',
                    background:'white'
                }}
                fontSize='small'/>
                </IconButton>
                {
                    // data?.previousPrice && data?.currentPrice && (data?.previousPrice>data?.currentPrice) 
                    true
                    &&(
                        <Box
                        style={{
                            position:'absolute',
                            left:0,
                            top:0,
                            background:'rgb(5 184 21)',
                            color:'white',
                            borderBottomRightRadius:'20px',
                            paddingLeft:8,
                            paddingRight:10,
                            paddingTop:1,
                            paddingBottom:1,
                            borderTopLeftRadius:'20px',
                        }}
                        >
                        
                          
                            <Typography sx={{fontWeight:'bold'}}>
                            {
                                `${getPercentOff(100,80)}% Off`
                            }
                        </Typography>
                         
                        
                        </Box>
                    )
                }
               
            </Box>
        <Stack>
        <Typography variant='h6' fontWeight={'bold'}>
            {data?.title}
        </Typography>
         {
            data?.brand&&(
                <Typography>
                {data?.brand?.description}
            </Typography>
            )
         }
        <Typography variant="caption" >
         {data?.description}           
        </Typography>
        <Box sx={{display:'flex',gap:2,}}>
                <Box sx={{display:'flex',alignItems:'center'}}>
                <Rating readOnly value={data?.reviews?.stars||0} size='small'/>
                <span>| {<small style={{fontWeight:'lighter'}}>
                    {data?.reviews?.length||0}
                    </small>}</span>
                </Box>
                <div style={{color:"rgb(5 184 21)",background:'rgb(244 243 241)',padding:'1px',fontWeight:'bold'}}>
                    {
                        data?.isFixed
                        ?'Fixed':'Negotiable'
                    }
                </div>
            </Box>
       
        <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
        </Box>
        <small></small>
        <Box sx={{display:'flex',gap:2,}}>
              {
                data?.previousPrice
                &&(
                    <Box sx={{display:'flex',gap:1}}>
                <Typography
                sx={{textDecoration:'line-through',color:'#AFAFAF'}}
                fontWeight={'bolder'}>
                {
                new Intl.NumberFormat().format(4000000000)
                }
                </Typography>
                <small>
                  {
                    data?.currency?.sign
                  }
                </small>
                </Box>
                )
              }
                {
                    data?.currentPrice
                    &&(
                        <Box sx={{display:'flex',gap:.5}}>
                <Typography fontWeight={'bold'} >
                {
                new Intl.NumberFormat().format(400000000)
                }
                </Typography>
                <small>Bir</small>
                </Box>
                    )
                }
              </Box>
        </Stack>
        
              
        </Box>

        </NavLink>
       
    )
}