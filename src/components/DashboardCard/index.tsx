import { Card, Grid, Box, Typography } from '@material-ui/core';

const DashboardCard: React.FC = () => {
  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography variant="h4">Account Balance</Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                $54,584.23
              </Typography>
              <Typography variant="h4">1.0045983485234 BTC</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DashboardCard;
