import Stack from "@mui/material/Stack";
import Price from "../components/price";

export default function PriceUpdate(){
    return (
      <Stack spacing={2}>
        <Price
        mainTitle="Post Price"
        priceType={1}
        />
         <Price
        mainTitle="Engagment Price"
        priceType={2}
        />
      </Stack>
    )
}