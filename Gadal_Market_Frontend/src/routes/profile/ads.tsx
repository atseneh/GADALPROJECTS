import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Stack, Typography,IconButton,useTheme, Pagination, Popover} from '@mui/material'
import useSmallScreen from '../../utils/hooks/useSmallScreen';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getUsersAds from '../../api/user/getUsersAds';
import { IMAGE_URL } from '../../api/apiConfig';
import getProducts from '../../api/products/getProducts';
import updateProduct from '../../api/products/updateProduct';
import CustomAlert from '../../components/common/customAlert';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
export default function Ads(){
const smallScreen = useSmallScreen()
const variant = smallScreen?'caption':'body1'
const [pageNumber, setPageNumber] = useState(1);
const [pageSize, setPageSize] = useState(5);
const [activeTab,setActiveTab] = useState(0)
const handleTabSelection = (tab:number)=>{
    setActiveTab(tab)
}
const {data:yourAds,isLoading} = useQuery({
    queryKey:['products',pageSize,pageNumber,activeTab],
    queryFn:()=>getUsersAds({
        userId:localStorage.getItem('userId') as string,
        soldOut:activeTab === 1,
        disabled:activeTab === 2,
        deleted:activeTab === 3
    })
   })

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
const queryClient = useQueryClient();
const smallScreen = useSmallScreen()
const [notificationSnackbarOpen,setNotificationSnackbarOpen] = useState(false)
const [notificationSeverity,setNotficationSeverity] = useState<'error'|'success'|undefined>()
const handleNotificationSnackbarClose = ()=>{
  setNotificationSnackbarOpen(false)
}
const navigate = useNavigate();
const productUpdateMutation = useMutation({
    mutationKey:['product-update'],
    mutationFn:updateProduct,
    onSuccess:()=>{
      setNotficationSeverity('success')
      queryClient.invalidateQueries({queryKey:['products']})
      queryClient.invalidateQueries({queryKey:['product']})
    },
    onError:()=>{
      setNotficationSeverity('error')
    },
    onSettled:()=>{
      setNotificationSnackbarOpen(true)
    }

  })
  const handleProductUpdate = (data:any)=>{
    if(productUpdateMutation.isPending) {
      return;
    }
  productUpdateMutation.mutate(data)
  }
  const handleSoldOut = (productId:string)=>{
    const payload = {
      productId,
      derivedState:5
    }
  handleProductUpdate(payload)
  }
  const handleProductEdit = (productId:string)=>{
    navigate(`/editPost/${productId}`)
  }
  const handleDisableOrEnableAdd = (productId:string,status:number)=>{
    const payload = {
      productId,
      recordStatus:status
    }
  handleProductUpdate(payload)
  }
  const handleProductDelete = (productId:string,)=>{
    const payload = {
      productId,
      recordStatus:3
    }
  handleProductUpdate(payload)
  }
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setDeleteAnchorEl(null);
  };

  const openDelete = Boolean(deleteAnchorEl);
  const id = openDelete ? 'delete-popover' : undefined;

    return ( 
        <Box
        sx={{display:'flex',gap:1,mt:2,alignItems:smallScreen?'flex-start':'center',flexDirection:smallScreen?'column':'row'}}
        >
     {/* <NavLink
      to={`/products/${ad?._id}`}
      style={({isTransitioning }) => {
          return {
            color:'black',
            textDecoration:'none',
            viewTransitionName: isTransitioning ? "slide" : "",
          };
        }}
     > */}
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
     {/* </NavLink> */}
        <Stack>
        <Typography variant='h5' fontWeight={'bold'}>
            {ad?.title}
        </Typography>
        <Typography variant='h6' >
            {
                `${new Intl.NumberFormat().format(ad?.currentPrice)} Brr`
            }
        </Typography>
            {
              ad?.recordStatus !== 3 && (
                <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                <Button
                size={smallScreen?'small':'medium'} 
                variant='contained' 
                sx={{color:'white'}}
                onClick={()=>{
                    handleSoldOut(ad?._id)
                }}
                disabled = {productUpdateMutation.isPending || ad?.derivedState === 5}
                >
                    Sold out
                </Button>
                <Button 
                  size={smallScreen?'small':'medium'} 
                  variant='contained' 
                  sx={{background:'#EFEFEF',color:'#535252'}}
                  onClick={()=>{
                    handleProductEdit(ad?._id)
                  }}
                  >
                    Edit
                </Button>
                <Button 
                  size={smallScreen?'small':'medium'} 
                  variant='contained' 
                  sx={{background:'#EFEFEF',color:'#535252'}}
                  onClick={()=>{
                    handleDisableOrEnableAdd(ad?._id,ad?.recordStatus === 1 ? 2 : 1)
                  }}
                  >
                    {
                        ad.recordStatus === 1 ? 'Disable ad' : 'Enable ad'
                    }
                </Button>
               
                    <IconButton 
                    onClick={handleClick}
                    disabled = {productUpdateMutation.isPending || ad?.recordStatus === 3}
                    >
                        <DeleteIcon color='error' />
                    </IconButton>
                <Popover
            id={id}
            open={openDelete}
            anchorEl={deleteAnchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Stack
            >
               <Typography sx={{ p: 2 }}>Are You sure?</Typography>
               <Stack
               direction={'row'}
               >
                <Button
                onClick={handleClose}
                >
                  No
                </Button>
                <Button
                color="error"
                onClick={()=>{
                  handleProductDelete(ad?._id)
                  handleClose();
                }}
                >
                  Yes
                </Button>
               </Stack>
            </Stack>
                  </Popover>
            </Box>
              )
            }
        </Stack>
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={notificationSeverity}
            errorMessage={productUpdateMutation.error?.message}
            successMessage="Product Updated Successfully"
            />
           )
          }
        </Box>
    )
}