import Grid from "@mui/material/Grid";
import KpiCard from "../components/kpiCard";
import Box from "@mui/material/Box";

export default function Index(){
    return (
        <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Registred users"
        icon="/icons/resisteredUsers1.svg"
        growth={18}
        kpiNumber={52000}
        />
      </Grid>

        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Posted Products"
        icon="/icons/products.svg"
        growth={18}
        kpiNumber={52000}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total sold out Products"
        icon="/icons/soldProducts.svg"
        growth={18}
        kpiNumber={52000}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Rented Products"
        icon="/icons/rentedProducts.svg"
        growth={18}
        kpiNumber={52000}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Visitors"
        growth={18}
        kpiNumber={52000}
        />
        </Grid>
        <Grid item xs={12} sm={9}>
            <Box>
                {/* graph area */}
            </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="New Users"
        growth={18}
        kpiNumber={52000}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Premium post"
        icon="/icons/premiumPost.svg"
        growth={18}
        kpiNumber={52000}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Gold post"
        icon="/icons/goldPost.svg"
        growth={18}
        kpiNumber={52000}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Free post"
        icon="/icons/goldPost.svg"
        growth={18}
        kpiNumber={52000}
        />
        </Grid>
    </Grid>
    )
}