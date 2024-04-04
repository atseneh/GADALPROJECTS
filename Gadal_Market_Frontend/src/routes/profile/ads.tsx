import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Stack, Typography,IconButton,useTheme, Pagination} from '@mui/material'
import useSmallScreen from '../../utils/hooks/useSmallScreen';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getUsersAds from '../../api/user/getUsersAds';
import { IMAGE_URL } from '../../api/apiConfig';
import getProducts from '../../api/products/getProducts';
export default function Ads(){
const smallScreen = useSmallScreen()
const variant = smallScreen?'caption':'body1'
const [pageNumber, setPageNumber] = useState(1);
const [pageSize, setPageSize] = useState(5);
const {data:yourAds,isLoading} = useQuery({
    queryKey:['products',pageSize,pageNumber],
    queryFn:()=>getUsersAds(localStorage.getItem('userId') as string)
   })
const [activeTab,setActiveTab] = useState(0)
const handleTabSelection = (tab:number)=>{
    setActiveTab(tab)
}
const theme = useTheme()
const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
  setPageNumber(value);
};
    return (
        <Card
        sx={{borderRadius:'20px',mt:2}}
        >
            <CardContent>
            <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
        <Typography variant='h6' fontWeight={'bold'}>
            Your Ads
        </Typography>
       
        <Divider sx={{fontWeight:'bold'}}/>
        </Box>
          <Box sx={{display:'flex',alignItems:"center",gap:smallScreen?1:4,mt:2}}>
            {
            ['All','Sold Out','Disabled','Deleted'].map((item,index)=>(
                <Box 
                onClick={(e)=>handleTabSelection(index)}
                sx={{display:'flex',alignItems:'center',gap:1,
                borderRadius:'16px',
                cursor:'pointer',
                background:activeTab===index?theme.palette.primary.main:'#EFEFEF',color:'black',
                pt:.7,pb:.7,pl:2,pr:2    
            }}>
             <Typography variant={variant}>
                {item}
             </Typography>
            </Box>
            ))
            }
          </Box>
                {
                    isLoading ? (
                        <Typography
                         variant='body2'
                         sx={{
                            mt:2
                         }}
                         >
                            Loading...
                        </Typography>
                    ):
                    (
                        <>
                          {
            yourAds?.products?.map((product:any)=>(
                <AdCard 
                 ad={product}
                 key={product?._id}
                />
            ))
          }
                 
                {
                  yourAds?.products?.length>0&&(
                    <Pagination
                    count={Math.ceil(yourAds?.metadata?.totalProducts/pageSize)}
                    page={pageNumber}
                    onChange={handlePaginationChange}
                    sx={{mt:4,}}
                  />
                  )
                }
                        </>
                    )
                }
            </CardContent>
        </Card>
    )
}
function AdCard({ad}:{ad:any}){
const smallScreen = useSmallScreen()
    return ( 
        <Box
        sx={{display:'flex',gap:1,mt:2,alignItems:smallScreen?'flex-start':'center',flexDirection:smallScreen?'column':'row'}}
        >
             <Box
    sx={{
        width:200,
        height:170,
        position:'relative',
         borderRadius:'20px',
         background:`url(${IMAGE_URL}/${ad?.productImages?.at(0)})`,
         backgroundSize:'cover',                   
         backgroundRepeat:'no-repeat',
         backgroundPosition: 'center center',
    }}/>
        <Stack>
        <Typography variant='h5' fontWeight={'bold'}>
            {ad?.title}
        </Typography>
        <Typography variant='h6' >
            {
                `${new Intl.NumberFormat().format(ad?.currentPrice)} Brr`
            }
        </Typography>
        <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
            <Button
            size={smallScreen?'small':'medium'} variant='contained' sx={{color:'white'}}>
                Sold out
            </Button>
            <Button size={smallScreen?'small':'medium'} variant='contained' sx={{background:'#EFEFEF',color:'#535252'}}>
                Edit
            </Button>
            <Button size={smallScreen?'small':'medium'} variant='contained' sx={{background:'#EFEFEF',color:'#535252'}}>
                {
                    smallScreen?
                    'Disable':
                    'Enable Ad'
                }
            </Button>
            <IconButton >
                <DeleteIcon color='error' />
            </IconButton>
        </Box>
        </Stack>
        
        </Box>
    )
}