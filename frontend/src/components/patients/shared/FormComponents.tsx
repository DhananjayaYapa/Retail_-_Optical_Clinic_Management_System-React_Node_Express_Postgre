import type { ReactNode } from 'react'
import { Box, Divider, TextField, Typography } from '@mui/material'
import type { PatientEntryFormDto } from '../../../utilities/models'
import type { FormFieldDto } from '../../../utilities/helpers/controlledFormValidator'

export interface FormRowProps {
  label: string
  field: FormFieldDto<string>
  property: keyof PatientEntryFormDto
  onInputHandleChange: (property: keyof PatientEntryFormDto, value: string) => void
  onInputFocus: (property: keyof PatientEntryFormDto) => void
  type?: string
  select?: boolean
  multiline?: boolean
  rows?: number
  highlight?: boolean
  children?: ReactNode
}

export const SectionHeader = ({ title }: { title: string }) => (
  <>
    <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
      {title}
    </Typography>
    <Divider sx={{ mb: 1.5 }} />
  </>
)

export const FormRow = ({
  label,
  field,
  property,
  onInputHandleChange,
  onInputFocus,
  type,
  select,
  multiline,
  rows,
  highlight,
  children,
}: FormRowProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
    <Typography
      variant="body2"
      sx={{
        minWidth: 120,
        pt: 0.8,
        textAlign: 'left',
        whiteSpace: 'nowrap',
        color: 'text.secondary',
        fontWeight: 500,
      }}
    >
      {label}
      {field.isRequired && (
        <Typography component="span" color="error.main" sx={{ ml: 0.3 }}>
          *
        </Typography>
      )}
      {' :'}
    </Typography>
    <TextField
      fullWidth
      size="small"
      type={type}
      select={select}
      multiline={multiline}
      rows={rows}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      value={field.value}
      error={!!field.error}
      helperText={field.error}
      disabled={field.disable}
      onFocus={() => onInputFocus(property)}
      onChange={(e) => onInputHandleChange(property, e.target.value)}
      sx={
        highlight
          ? {
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                transition: 'background-color 0.3s',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'success.main',
                },
              },
            }
          : undefined
      }
    >
      {children}
    </TextField>
  </Box>
)
