import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../../app/store/configureStore';

export default function Review() {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
        </Grid>
      </Grid>
    </>
  );
}