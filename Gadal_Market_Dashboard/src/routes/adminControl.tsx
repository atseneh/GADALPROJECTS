import Stack from "@mui/material/Stack";
import AdminTable from "../components/adminTable";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CreateMainAdmin from "../components/createMainAdmin";
import useReactRouterQuery from '../utils/hooks/useQuery'
import { useLocation, useNavigate } from "react-router-dom";
export default function AdminControl(){
const query = useReactRouterQuery()
const active = query.get('active')
const {pathname} = useLocation()
const navigate = useNavigate()
    return (
        <>
        {
            active==='createAdmin' ?
            (
                <Stack>
                    <CreateMainAdmin/>
                </Stack>
            ):
            (
                <Stack spacing={1}>
                <Button
                onClick={()=>{
                    navigate(`${pathname}?active=createAdmin`)
                }}
                variant="contained"
                sx={{
                    display:'flex',
                    alignItems:'center',
                    gap:.5,
                    color:'white',
                    pr:2,pl:2,
                    alignSelf:'flex-start',
                    borderRadius:'20px'
                }}
                >
                <Typography variant="body1">
                    Create Admin
                </Typography>
                </Button>
                <AdminTable/>
                </Stack>
            )
        }
    
        </>
    )
}