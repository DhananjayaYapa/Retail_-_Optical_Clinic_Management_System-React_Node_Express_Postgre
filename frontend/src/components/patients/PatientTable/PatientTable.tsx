import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useMemo } from 'react'
import type { HealthCardStatus, PatientListItem } from '../../../utilities/models'
import { calculateAge, getHealthCardColor } from '../../../utilities/helpers/patient.helpers'

interface PatientTableProps {
  rows: PatientListItem[]
  onUpdate?: (patient: PatientListItem) => void
  onRowClick?: (patient: PatientListItem) => void
  canUpdate?: boolean
}

const PatientTable = ({ rows, onUpdate, onRowClick, canUpdate = true }: PatientTableProps) => {
  const columns = useMemo<GridColDef<PatientListItem>[]>(
    () => [
      {
        field: 'patientId',
        headerName: 'Patient ID',
        minWidth: 120,
        flex: 0.8,
      },
      {
        field: 'patientName',
        headerName: 'Patient Name',
        minWidth: 180,
        flex: 1.3,
      },
      {
        field: 'dateOfBirth',
        headerName: 'DOB',
        minWidth: 120,
        flex: 0.8,
        valueFormatter: (value) => new Date(value).toLocaleDateString(),
      },
      {
        field: 'age',
        headerName: 'Age',
        minWidth: 70,
        flex: 0.5,
        sortable: false,
        valueGetter: (_value, row) => calculateAge(row.dateOfBirth),
      },
      {
        field: 'gender',
        headerName: 'Gender',
        minWidth: 90,
        flex: 0.6,
      },
      {
        field: 'phoneNumber',
        headerName: 'Phone Number',
        minWidth: 130,
        flex: 0.9,
      },
      {
        field: 'healthCardStatus',
        headerName: 'Healthcard Status',
        minWidth: 150,
        flex: 0.9,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value.replace('_', ' ')}
            color={getHealthCardColor(params.value as HealthCardStatus)}
            variant={params.value === 'NOT_AVAILABLE' ? 'outlined' : 'filled'}
          />
        ),
      },
      {
        field: 'refDoctor',
        headerName: 'Ref Doctor',
        minWidth: 150,
        flex: 1,
      },
      ...(canUpdate
        ? [
            {
              field: 'actions',
              headerName: 'Action',
              minWidth: 90,
              sortable: false,
              filterable: false,
              renderCell: (params: { row: PatientListItem }) =>
                params.row.deletedAt ? null : (
                  <Tooltip title="Update patient">
                    <IconButton
                      size="small"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        onUpdate?.(params.row)
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ),
            },
          ]
        : []),
    ],
    [onUpdate, canUpdate]
  )

  return (
    <Paper sx={{ borderRadius: 2 }}>
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Patient List
        </Typography>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        getRowClassName={(params) => (params.row.deletedAt ? 'row-disabled' : '')}
        onRowClick={(params) => {
          if (params.row.deletedAt) return
          onRowClick?.(params.row as PatientListItem)
        }}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'rgba(2, 6, 23, 0.04)',
          },
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row.row-disabled': {
            opacity: 0.45,
            cursor: 'default',
            pointerEvents: 'none',
          },
        }}
      />
    </Paper>
  )
}

export default PatientTable
