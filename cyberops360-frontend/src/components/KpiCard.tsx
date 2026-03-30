import { Box, Card, CardActionArea, CardContent, Chip, Typography, alpha, useTheme } from '@mui/material'
import type { ReactElement } from 'react'

interface KpiCardProps {
  label: string
  value: string
  delta: string
  color: string
  icon: ReactElement
  onClick?: () => void
}

export const KpiCard = ({ label, value, delta, color, icon, onClick }: KpiCardProps) => {
  const theme = useTheme()

  const content = (
    <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: alpha(color, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="overline"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.68rem',
            display: 'block',
            lineHeight: 1.5,
          }}
        >
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5, lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Chip
          label={delta}
          size="small"
          variant="outlined"
          sx={{
            borderColor: alpha(color, 0.4),
            color,
            fontWeight: 600,
            fontSize: '0.72rem',
            height: 24,
          }}
        />
      </Box>
    </CardContent>
  )

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      {onClick ? (
        <CardActionArea onClick={onClick}>{content}</CardActionArea>
      ) : (
        content
      )}
    </Card>
  )
}
