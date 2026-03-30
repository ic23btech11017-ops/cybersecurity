import { motion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export const PageContainer = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.32 }}
  >
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {subtitle}
      </Typography>
    </Box>
    {children}
  </motion.div>
)
