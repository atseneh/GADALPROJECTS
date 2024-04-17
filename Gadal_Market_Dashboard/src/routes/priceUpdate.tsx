import Stack from "@mui/material/Stack";
import PostPrice from "../components/postPrice";
import EngagmentPrice from "../components/engagmentPrice";

export default function PriceUpdate(){
    return (
      <Stack spacing={2}>
        <PostPrice/>
         <EngagmentPrice/>
      </Stack>
    )
}