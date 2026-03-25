import { Box, Paper, Typography } from '@mui/material'

interface FutureModulePageProps {
  title: string
  description?: string
}

const FutureModulePage = ({
  title,
  description = 'This module is planned for future development.',
}: FutureModulePageProps) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      <Box sx={{ color: 'text.secondary' }}>{description}</Box>
    </Paper>
  )
}

export default FutureModulePage
