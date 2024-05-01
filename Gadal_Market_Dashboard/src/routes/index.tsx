import Grid from "@mui/material/Grid";
import KpiCard from "../components/kpiCard";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import getDashboardMetrics from "../api/dashboard";

export default function Index(){
  const {data:dashboardMetrics,isLoading} = useQuery({
    queryKey:['dashboard_metrics'],
    queryFn:getDashboardMetrics
  })
    return (
        <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Registred users"
        icon="/icons/resisteredUsers1.svg"
        growth={dashboardMetrics?.percentRegisteredSinceLastWeek}
        kpiNumber={dashboardMetrics?.totalRegisteredUsers}
        loading={isLoading}
        />
      </Grid>

        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Posted Products"
        icon="/icons/products.svg"
        growth={18}
        kpiNumber={dashboardMetrics?.totalPostedProducts}
        loading={isLoading}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total sold out Products"
        icon="/icons/soldProducts.svg"
        growth={18}
        kpiNumber={dashboardMetrics?.totalSoldOutProducts}
        loading={isLoading}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Rented Products"
        icon="/icons/rentedProducts.svg"
        growth={18}
        kpiNumber={dashboardMetrics?.totalRentedProducts}
        loading={isLoading}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Visitors"
        growth={18}
        kpiNumber={52000}
        loading={isLoading}
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
        loading={isLoading}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Premium post"
        icon="/icons/premiumPost.svg"
        growth={18}
        kpiNumber={dashboardMetrics?.totalPremiumPosts}
        loading={isLoading}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Gold post"
        icon="/icons/goldPost.svg"
        growth={18}
        kpiNumber={dashboardMetrics?.totalGoldPosts}
        loading={isLoading}
        />
        </Grid>
        <Grid item xs={12} sm={3}>
        <KpiCard
        title="Total Free post"
        icon="/icons/goldPost.svg"
        growth={18}
        kpiNumber={dashboardMetrics?.totalFreePosts}
        loading={isLoading}
        />
        </Grid>
    </Grid>
    )
}