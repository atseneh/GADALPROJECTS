import Stack from "@mui/material/Stack";
import ProductTable from "../components/productTable";
import ProductActivityButtons from "../components/productActivityButtons";
import { useEffect, useState } from "react";
import ProductEditForm from "../components/productEditForm";
import useReactRouterQuery from '../utils/hooks/useQuery'
import CreateSubAdmin from "../components/createSubAdmin";
import Box from "@mui/material/Box";
import ChangePassword from "../components/changePassword";
import AddProduct from "../components/addProduct";
import { useLocation,useNavigate, useParams } from "react-router-dom";
export default function Products(){
const [itemToEditId,setItemEditId] = useState('')
const {serviceId} = useParams()
const {pathname} = useLocation()
const navigate = useNavigate()
const handleItemToEditId = (id:string)=>{
    setItemEditId(id)
    navigate(`${pathname}?active=editProduct`)
}
const showTable = ()=>{
    setItemEditId('')
    navigate(-1)
}
let query = useReactRouterQuery()
const [selectedCategory,setSelectedCategory] = useState('')
const handleCategoryChange = (categoryId:string)=>{
    setSelectedCategory(categoryId)
}
const active = query.get('active')
useEffect(()=>{
    setSelectedCategory('')
},[serviceId])
    return (
        <Stack spacing={1}>
        <ProductActivityButtons
        selectedCategory={selectedCategory}
        selecteCategory = {handleCategoryChange}
        />
        {
            active === 'table'&&(
                <ProductTable
                selectedCategory={selectedCategory}
                onEdit={handleItemToEditId}
                />
            )
        }
        {
            active==='editProduct'&&
            (
                <ProductEditForm
                goBack={showTable}
                productId={itemToEditId}
                />
            )
        }
        {
          active==='subAdmin'&&(
            <Box
            sx={{
                display:'flex',
                flexDirection:'column'
            }}
            >
                <CreateSubAdmin/>
            </Box>
          )
        }
         {
          active==='chagePassword'&&(
            <Box
            sx={{
                display:'flex',
                flexDirection:'column'
            }}
            >
                <ChangePassword/>
            </Box>
          )
        }
        {
          active==='addProduct'&&(
            <Box
            sx={{
                display:'flex',
                flexDirection:'column'
            }}
            >
                <AddProduct/>
            </Box>
          )
        }
        </Stack>
    )
}