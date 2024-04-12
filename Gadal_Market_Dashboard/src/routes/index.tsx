import Grid from "@mui/material/Grid";
import KpiCard from "../components/kpiCard";
import Box from "@mui/material/Box";
import { LineChart } from '@mui/x-charts/LineChart';
export default function cdIndex() {
  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12} sm={3}>
        <KpiCard
          title="Total Registered users"
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
        <Box style={{ backgroundColor: 'white' }}>
          {/* graph area */}
          <LineChartComponent />
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
  );
}
function LineChartComponent() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
          valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
        },
        {
          data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5],
        },
        {
          data: [7, 8, 5, 4, null, null, 2, 5.5, 1],
          valueFormatter: (value) => (value == null ? '?' : value.toString()),
        },
      ]}
      height={200}
      margin={{ top: 10, bottom: 20 }}
    />
  );
}


