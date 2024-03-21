import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";

export default function PaymentAttachment(){
    return (
        <Stack
        spacing={2}
        sx={{
            p:1,
            m:1,
            mt:3,
            // position:'relative'
        }}
        >
        <Typography
        variant="h4"
        textTransform={'uppercase'}
      
        >
            Payment Preview
        </Typography>
         {/* company(gadal) detail */}
        <Box
        sx={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between'
        }}
        >
        <Stack>
            <Typography>
                Gadal Technologies plc.
            </Typography>
            <Typography>
            Around Urael
            </Typography>
            <Typography>
            Addis Ababba Ethiopia

            </Typography>
            {/* <Typography fontWeight={'bold'}>
                9830
            </Typography> */}
         </Stack>
         <img width={210} src='/images/footerLogo.svg' alt='Gadal Logo'/>
        </Box>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            #
                        </TableCell>
                        <TableCell>
                            Description
                        </TableCell>
                        <TableCell>
                            Amount
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            1
                        </TableCell>
                        <TableCell>
                            Engagement fee
                        </TableCell>
                        <TableCell>
                            520
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
            <Box
              sx={{
                alignSelf:'flex-end'
            }}
            >
            <TableContainer>
            <Table
            size="small"
            >
                <TableBody>
                    <TableRow>
                        <TableCell>
                            Subtotal
                        </TableCell>
                        <TableCell/>
                        <TableCell>
                            500
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Tax
                        </TableCell>
                        <TableCell/>
                        <TableCell>
                            20
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Total
                        </TableCell>
                        <TableCell/>
                        <TableCell>
                            520
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
            </Box>
            <Box
            sx={{
                position:'absolute',
                bottom:8,
                left:4,
            }}
            >
                <Typography>
                    Thank you for doing bussiness with us
                </Typography>
            </Box>
        </Stack>
    )
}