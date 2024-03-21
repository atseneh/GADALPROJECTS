import Box from "@mui/material/Box"
import useSmallScreen from "../utils/hooks/useSmallScreen"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { styled } from '@mui/material/styles';
import { Stack, Table, TableBody, TableContainer, TableHead, TableRow,IconButton, Paper, Button, Divider } from "@mui/material"
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/common/orderSummary";
import { IMAGE_URL } from "../api/apiConfig";
import { useContext } from "react";
import { context } from "../components/common/cartContext";
import CustomAlert from "../components/common/customAlert";
import React from "react";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        fontWeight: theme.typography.fontWeightBold,
    },
    [`&.${tableCellClasses.body}`]: {
        fontWeight: theme.typography.fontWeightBold,
    },
  }));
export default function Cart(){
    const smallScreen = useSmallScreen()
    const navigate = useNavigate()
    const {products,removeFromCart}  = useContext(context)
    const [notificationSnackbarOpen,setNotificationSnackbarOpen] = React.useState(false)
    const handleNotificationSnackbarClose = ()=>{
      setNotificationSnackbarOpen(false)
    }
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
              <img width={220} src="/images/cartImg.svg" style={{marginLeft:smallScreen?'8px':'100px'}}/>
         <Box>
            <Typography sx={{color:'white',fontStyle:'italic',fontWeight:'bold',textTransform:'capitalize'}} variant={smallScreen?"h6":'h2'}>
              Cart
            </Typography>
         </Box>
        </Box>
        {
            products?.length>0?(
                <Grid container spacing={2} sx={{mt:2}} justifyContent={'center'}>
                <Grid xs={12} sm={6} md={9}  item>
                    {
                        smallScreen?
                        (
                        <MobileCart/>
                        )
                        :
                        (
                            <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead >
                                    <TableRow style={{fontWeight:'bold'}}>
                                        <StyledTableCell >
                                            Products
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Price
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Engagment Fee
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Remove
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                        products?.map((product:any)=>(
                                    <TableRow>
                                         <StyledTableCell>
                                            <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                                            <Box
                                            sx={{
                                                width:100,
                                                height:100,
                                                position:'relative',
                                                // borderRadius:'20px',
                                                background:`url(${IMAGE_URL}/${product?.productImages?.at(0)})`,
                                                backgroundSize:'contain',                   
                                                backgroundRepeat:'no-repeat',
                                                backgroundPosition: 'center center',
                                            }}/>
                                                    <Stack>
                                                    <Typography fontWeight={'bold'}>
                                                        {product?.title}
                                                    </Typography>
                                                    <Typography variant='caption' fontWeight={'bold'} >
                                                      {product?.location?.descripton}
                                                    </Typography>
                                                    </Stack>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                        {
                            `${new Intl.NumberFormat().format(product?.currentPrice)} Brr`
                        }
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {product?.engagmentFee}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <IconButton
                                            onClick={()=>{
                                                removeFromCart(product?._id)
                                                setNotificationSnackbarOpen(true)
                                            }}
                                            >
                                                <CloseIcon fontSize="large" color="error"/>
                                            </IconButton>
                                        </StyledTableCell>
                                    </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
                         </TableContainer>  
                        )
                    }
                </Grid>
                {
                    smallScreen&&(<Divider sx={{m:1}}/>)
                }
                <Grid xs={12} sm={6} md={3} item>
                   <OrderSummary/>
                    <Box>
                    <Button 
                    onClick={()=>navigate('/payment?paymentType=engagement')}
                    fullWidth sx={{color:'white',mt:1}}  variant="contained">
                                Checkout Engagement Fee
                            </Button>
                    </Box>
                </Grid>
            </Grid>
            )
            :
            (
                <Box sx={{display:'flex',flexDirection:'column',p:3,m:2}}>
                    <Box sx={{alignSelf:'center'}}>
                    <img width={150} src="/images/Icon feather-shopping-cart.svg"/>
                    <Typography sx={{mt:1}}>No items Added to the cart</Typography>
                    
                </Box>
                    </Box>
            )
        }
       
        {
           notificationSnackbarOpen&&(
            <CustomAlert
            open={notificationSnackbarOpen}
            handleSnackBarClose = {handleNotificationSnackbarClose}
            severity={'success'}
            successMessage="Item Removed From Cart"
            // errorMessage={postMutation.error as string}
            />
           )
          }
        </>
    )
}
function MobileCart(){
    const {products,removeFromCart}  = useContext(context)
    return (
        <>
        {
            products?.map((data:any)=>(
                <Box 
                sx={{
                    display:'flex',
                    flexDirection:'column',
                    position:'relative'
                }}
                >
                <Stack spacing={0.5} sx={{alignSelf:'center'}}>
                    <img 
                    width={90}
                    height={90}
                    style={{objectFit:'contain',marginLeft:'20px'}}
                    src={`${IMAGE_URL}/${data?.productImages?.at(0)}`}/>
                    <Typography variant="h6">
                        {data?.title}
                    </Typography>
                    <Typography variant="body2" fontWeight={'bold'}>
                    {data?.location?.descripton}
                    </Typography>
                    <Typography variant="h6">
                    {
                        `${new Intl.NumberFormat().format(data?.currentPrice)} Brr`
                    }
                    </Typography>
                    <Typography variant="body2">
                        Engagment Fee : {data?.engagmentFee}
                    </Typography>
                </Stack>
                <IconButton
                onClick={()=>{
                    removeFromCart(data?._id)
                }}
                 sx={{
                    position:'absolute',
                    right:2,
                    top:0
                 }}
                >
                    <CloseIcon/>
                </IconButton>
                <Divider sx={{m:1}}/>
                </Box>
            ))
        }
        </>
    )
}