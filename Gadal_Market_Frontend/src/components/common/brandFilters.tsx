import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import useReactRouterQuery from '../../utils/hooks/useQuery';
import { useQuery } from '@tanstack/react-query';
import getBrandByCategory from '../../api/categories/getBrandbyCategory';
import { Box, Divider, Stack } from '@mui/material';
import getBrandFilters from '../../api/categories/getBrandFiltersbyCategory';
import { useNavigate, useSearchParams } from 'react-router-dom';
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 1,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      color:'white'
    },
  }))
export default function BrandFilters(){
    let query = useReactRouterQuery()
    const categoryId = query.get('cat')
    const navigate = useNavigate()
    const {data:brandFilters} = useQuery({
        queryKey:['brand_filters',categoryId],
        queryFn:()=>getBrandFilters(categoryId as string)
    })
    const [searchParams, setSearchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const addSearchParam = (brand:string) => {
      params.set('brand', brand);
      setSearchParams(params);
    };
  const handleBrandSelection = (brand:string)=>{
    if(params.get('brand') === brand) {
      searchParams.delete('brand')
      navigate(`?${searchParams.toString()}`);
      return;
  }
  addSearchParam(brand)
  }
    return(
       <>
       {
        Array.isArray(brandFilters)&&brandFilters.length>0&&(
            <Stack
            sx={{m:2,}}
            direction={'row'}
            spacing={6}
            >
              {
                brandFilters?.map((brand:any)=>(
                     <StyledBadge badgeContent={brand?.productCount} color="primary">
                        <img width={70} onClick={()=>{handleBrandSelection(brand?._id)}} style={{cursor:'pointer'}} src={brand?.icon}/>
                    </StyledBadge>
                  
                ))
              }
            </Stack>
        )
       }
       </>  
    )
}