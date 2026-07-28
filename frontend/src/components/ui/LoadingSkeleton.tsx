import { Skeleton, Grid, Box } from '@mui/material';

export function LoadingSkeletonCard() {
  return (
    <Box sx={{ p: 2.5, borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
      <Skeleton variant="text" width="60%" height={28} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '8px' }} />
    </Box>
  );
}

export function LoadingSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={2.5}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
          <LoadingSkeletonCard />
        </Grid>
      ))}
    </Grid>
  );
}
