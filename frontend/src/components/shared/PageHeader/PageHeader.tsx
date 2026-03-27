import type { ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'

interface PageHeaderProps {
  title?: string
  subtitle?: string
  actionLabel?: string
  actionIcon?: ReactNode
  onAction?: () => void
  actionDisabled?: boolean
}

const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  actionDisabled,
}: PageHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        mb: 2,
      }}
    >
      <Box>
        {title && (
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={actionIcon}
          onClick={onAction}
          disabled={actionDisabled}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default PageHeader
