import { Stack } from "@mui/material";
import UiAsset from "../components/uiAsset";

export default function UiUpdate(){
    return (
     <Stack spacing={1}>
          <UiAsset
       title="Banner"
       assetUrls={['/images/MainBanner.svg']}
       />
         <UiAsset
       title="Background"
       assetUrls={['/images/Background.svg']}
       />
     </Stack>
    )
}