import { IconButton, Stack, Tooltip } from '@mui/material'
import { Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface ActionButtonsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const ActionButtons = ({ onView, onEdit, onDelete }: ActionButtonsProps) => (
  <Stack direction="row" spacing={0.5} alignItems="center">
    {onView && (
      <Tooltip title="View">
        <IconButton size="small" onClick={onView} sx={{ color: '#3b82f6' }}>
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
    {onEdit && (
      <Tooltip title="Edit">
        <IconButton size="small" onClick={onEdit} sx={{ color: '#f59e0b' }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
    {onDelete && (
      <Tooltip title="Delete">
        <IconButton size="small" onClick={onDelete} sx={{ color: '#ef4444' }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </Stack>
)
