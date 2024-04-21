import {Box,Stack,IconButton, Typography} from '@mui/material'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Rating from '@mui/material/Rating';
import useSmallScreen from '../../utils/hooks/useSmallScreen';
import { NavLink } from 'react-router-dom';
import getPercentOff from '../../utils/helpers/getPercentOff';
import { IMAGE_URL } from '../../api/apiConfig';
import { useMutation,useQueryClient } from '@tanstack/react-query';
import addProductToFav from '../../api/products/addProductToFav';
import removeProductFromFav from '../../api/products/removeProductFromFav';
export default function ProductCard(props:{data:any}){
const {data} = props 
const smallScreen = useSmallScreen()
const queryClient = useQueryClient()
const loggedInUserId = localStorage.getItem('userId')
const {mutate:addFav,isPending:addPending,variables} = useMutation({
    mutationFn:addProductToFav,
    mutationKey:['addToFav'],
    // onSuccess:()=>{
    //     queryClient.invalidateQueries({queryKey:['newProducts']})
    //     queryClient.invalidateQueries({queryKey:['products']})
    // },
    onSettled: async () => {
        return await queryClient.invalidateQueries({ queryKey: ['newProducts'] })
      },
})
const {mutate:removeFav,isPending:removePending} = useMutation({
    mutationFn:removeProductFromFav,
    mutationKey:['removeFromFav'],
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['newProducts']})
        queryClient.invalidateQueries({queryKey:['products']})
    }
})
    return(
       <>
      
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
            <Box sx={{display:'flex',flexDirection:'column',gap:.5}}>
            <Box
            sx={{
            width:'100%',
            height:smallScreen?250:170,
            position:'relative',
             borderRadius:'20px',
             background:`url(${IMAGE_URL}/${data?.productImages?.at(0)})`,
             backgroundSize:'contain',                   
             backgroundRepeat:'no-repeat',
             backgroundPosition: 'center center',
             border:'1px solid #EBEDEF'

            }}
            >
               {
                data?.consignee !== localStorage.getItem('userId')&&(
                    <IconButton
                    onClick={(e)=>{
                        e.preventDefault()
                        if(addPending || removePending){
                            return;
                        }
                        if(data?.likedBy?.includes(loggedInUserId)){
                            removeFav(
                                {
                                    productId:data?._id,
                                    userId:localStorage.getItem('userId') as string
                                }
                            )
                            return;
                        }
                        addFav(
                            {
                                productId:data?._id,
                                userId:localStorage.getItem('userId') as string
                            }
                        )
                    }}
                    sx={{
                     position:'absolute',
                     top:1,
                     right:1,
                     
                    }}
                    >
                     {
                        addPending ? (
                            <FavoriteBorderOutlinedIcon
                            sx={{
                                border: '2px solid white',
                                borderRadius: '50%',
                                padding: '5px',
                                background:'rgb(255 170 1)',
                                color:'white'
                            }}
                            fontSize='small'/>
                        ):
                        (
                          <>
                          {
                            removePending ? (
                                <FavoriteBorderOutlinedIcon
                                sx={{
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    padding: '5px',
                                    background:'white',
                                    color:"black"
                                }}
                                fontSize='small'/>
                            ):
                            (
                                <FavoriteBorderOutlinedIcon
                                sx={{
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    padding: '5px',
                                    background:data?.likedBy?.includes(loggedInUserId)?'rgb(255 170 1)':'white',
                                    color:data?.likedBy?.includes(loggedInUserId)?'white':"black"
                                }}
                                fontSize='small'/>
                            )
                          }
                          </>
                        )
                     }
                    </IconButton>
                )
               }
                {
                    data?.previousPrice && data?.currentPrice && (data?.previousPrice>data?.currentPrice) &&(
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
                                `${getPercentOff(data?.previousPrice as number,data?.currentPrice as number)}% Off`
                            }
                        </Typography>
                         
                        
                        </Box>
                    )
                }
                {
                    data?.postType!==3&&(
                    <Box
                    style={{
                        position:'absolute',
                        right:0,
                        bottom:0,
                        background:data?.postType===2?'gold':'silver',
                        color:'white',
                        borderBottomRightRadius:'20px',
                        paddingLeft:8,
                        paddingRight:10,
                        paddingTop:1,
                        paddingBottom:1,
                        borderTopLeftRadius:'20px',
                    }}
                    > 
                    <Typography>
                      {data?.postType===1?'Premium':'Gold'}
                    </Typography>
                    </Box>
                    )
                }
               
            </Box>
            <Box>
            <Typography >
                {data?.title}
            </Typography>
                {
                    data?.brand&&(
                        <Typography variant='caption'>
                        {data?.brand?.description}
                    </Typography>
                    )
                }
            </Box>
            <Box sx={{display:'flex',gap:2,}}>
                <Box sx={{display:'flex',alignItems:'center'}}>
                <Rating readOnly value={data?.reviews?.stars||0} size='small'/>
                <span>| {<small style={{fontWeight:'lighter'}}>{data?.reviews?.stars||0}</small>}</span>
                </Box>
                <div style={{color:"rgb(5 184 21)",background:'rgb(244 243 241)',padding:'1px',fontWeight:'bold'}}>
                    {
                        data?.isFixed?'Fixed':'Negotiable'
                    }
                </div>
            </Box>
            <small></small>
              <Box sx={{display:'flex',gap:2,}}>
              {
                (data?.previousPrice>data?.currentPrice)&&(
                    <Box sx={{display:'flex',gap:1}}>
                <Typography
                sx={{textDecoration:'line-through',color:'#AFAFAF'}}
                fontWeight={'bolder'}>
                {
                new Intl.NumberFormat().format(data?.previousPrice)
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
                    data?.currentPrice&&(
                        <Box sx={{display:'flex',gap:.5}}>
                <Typography fontWeight={'bold'} >
                {
                new Intl.NumberFormat().format(data?.currentPrice)
                }
                </Typography>
                <small>Bir</small>
                </Box>
                    )
                }
              </Box>
            </Box>
           </NavLink>
       
       </>
    )
}