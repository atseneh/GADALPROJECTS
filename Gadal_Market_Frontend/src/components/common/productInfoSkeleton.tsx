import { Skeleton,Stack } from "@mui/material"
import useSmallScreen from "../../utils/hooks/useSmallScreen"
export default function ProductInfoSkeleton(){
const smallScreen = useSmallScreen()
    return (
        <Stack spacing={1}>
        <Skeleton width={'80%'} height={35}/>
        <Skeleton width={'80%'} height={35}/>
        <Skeleton width={'80%'} height={35}/>
        <Skeleton width={'80%'} height={35}/>
        <Skeleton width={'80%'} height={35}/>
        <Stack direction={'row'} spacing={1}>
        <Skeleton variant="circular" width={35} height={35}/>
        <Skeleton width={'20%'}/>
        <Skeleton width={'20%'}/>  
        </Stack>
        <Stack direction={smallScreen?'column':'row'} spacing={1}>
        <Skeleton width={'60%'} height={35}/>
        <Skeleton width={'60%'} height={35}/>
        <Skeleton width={'60%'} height={35}/>  
        <Skeleton width={'60%'} height={35}/>
        </Stack>
        <Skeleton width={'100%'}/>
        <Skeleton width={'100%'}/>
        </Stack>
    )
}