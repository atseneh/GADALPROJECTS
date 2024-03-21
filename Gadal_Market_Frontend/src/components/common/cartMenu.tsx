import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useContext} from 'react';
import { context } from '../common/cartContext';
export default function CartMenu(){
const navigate = useNavigate()
const {products} = useContext(context)
    return (
        <IconButton
        onClick={()=>navigate('/cart')}
        >
            <Badge color='primary' badgeContent={products?.length}>
            <ShoppingCartOutlinedIcon fontSize='large'/>
            </Badge>
        </IconButton>
    )
}