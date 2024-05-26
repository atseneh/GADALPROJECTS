import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import verifyPayment from "../../api/payment/verifyPayment";
import useReactRouterQuery from "../../utils/hooks/useQuery";
export default function PaymentSuccessful(){
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const query = useReactRouterQuery()
    const {txRef} = useParams()
    const serviceType = query.get('serviceType') as string
    const {mutate:verify,} = useMutation({
        mutationFn:verifyPayment,
        mutationKey:['verify_payment'],
        onSettled:()=>{
            setLoading(false)
        }
    })
    useEffect(()=>{
        verify({
            trxRef:txRef as string,
            serviceType
        })
    },[])
    return (
        <Box
        sx={{
            height:'100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
        }}
        >
         {
            loading ? (
                <CircularProgress/>
            ):
            (
                <Stack>
                <CheckCircleIcon
                sx={{
                    alignSelf:'center',
                    fontSize:'6rem'
                }}
                color="success"
                />
                 <Typography
                  variant="h5"
                  sx={{
                    color:'green'
                  }}
                  >
                    Payment Successfuly Completed
                  </Typography>
                  <Button
                  size="large"
                  onClick={()=>{
                    navigate('/')
                  }}
                  >
                    Back Home
                  </Button>
                 </Stack>
            )
         }
        </Box>
    )
}