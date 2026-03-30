import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'
import type { ReactNode } from 'react'

export type CrudMode = 'create' | 'edit' | 'view' | 'delete'

interface CrudDialogProps {
  open: boolean
  onClose: () => void
  mode: CrudMode
  title: string
  onSubmit?: () => void
  loading?: boolean
  /** Name of the item being deleted (for the confirmation message) */
  deleteName?: string
  children?: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg'
}

const modeConfig: Record<CrudMode, { submitLabel: string; submitColor: 'primary' | 'error' }> = {
  create: { submitLabel: 'Create', submitColor: 'primary' },
  edit: { submitLabel: 'Save Changes', submitColor: 'primary' },
  view: { submitLabel: '', submitColor: 'primary' },
  delete: { submitLabel: 'Delete', submitColor: 'error' },
}

export const CrudDialog = ({
  open,
  onClose,
  mode,
  title,
  onSubmit,
  loading = false,
  deleteName,
  children,
  maxWidth = 'sm',
}: CrudDialogProps) => {
  const theme = useTheme()
  const config = modeConfig[mode]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.15rem', pb: 1 }}>{title}</DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        {mode === 'delete' ? (
          <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.error.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningIcon sx={{ color: 'error.main', fontSize: 28 }} />
            </Box>
            <Typography variant="body1" textAlign="center">
              Are you sure you want to delete{' '}
              <Typography component="span" fontWeight={700}>
                {deleteName || 'this item'}
              </Typography>
              ? This action cannot be undone.
            </Typography>
          </Stack>
        ) : (
          children
        )}
      </DialogContent>

      {mode !== 'view' && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            color={config.submitColor}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {loading ? 'Processing...' : config.submitLabel}
          </Button>
        </DialogActions>
      )}

      {mode === 'view' && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
