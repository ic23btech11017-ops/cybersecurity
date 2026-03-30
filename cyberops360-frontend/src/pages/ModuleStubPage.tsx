import { Card, CardContent, Chip, Grid, Typography } from '@mui/material'
import { PageContainer } from '../components/PageContainer'

export const ModuleStubPage = ({
  title,
  subtitle,
  bullets,
}: {
  title: string
  subtitle: string
  bullets: string[]
}) => (
  <PageContainer title={title} subtitle={subtitle}>
    <Grid container spacing={2}>
      {bullets.map((bullet) => (
        <Grid size={{ xs: 12, md: 4 }} key={bullet}>
          <Card>
            <CardContent>
              <Chip label={title} size="small" color="primary" sx={{ mb: 2 }} />
              <Typography variant="body1">{bullet}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </PageContainer>
)
