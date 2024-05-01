import { Stack } from "@mui/material";
import UiAsset from "../components/uiAsset";
import { useQuery } from "@tanstack/react-query";
import getUiAssets from "../api/getUiAssets";
import { IMAGE_URL } from "../api/apiConfig";
export default function UiUpdate(){
  const {data:assets,isLoading} = useQuery({
    queryKey:['get_assets'],
    queryFn:getUiAssets
  })
  const banners = assets?.find((asset:any)=>asset?.assetType === 2)
  const bannerImages = Array.isArray(banners?.filePath) && banners?.filePath?.length > 0 ? banners?.filePath?.map((path:string)=>`${IMAGE_URL}/${path}`):[]
  const backgrounds = assets?.find((asset:any)=>asset?.assetType === 4)
  const backgroundImages = Array.isArray(backgrounds?.filePath) && backgrounds?.filePath?.length > 0 ? backgrounds?.filePath?.map((path:string)=>`${IMAGE_URL}/${path}`):[]
    return (
     <Stack spacing={1}>
          <UiAsset
       title="Banner"
       assetUrls={bannerImages}
       assetType={2}
       />
         <UiAsset
       title="Background"
       assetUrls={backgroundImages}
       assetType={4}
       />
     </Stack>
    )
}