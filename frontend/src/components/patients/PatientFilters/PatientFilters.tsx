import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import type { PatientFilterFormDto, PatientFilterOptions } from '../../../utilities/models'
import { AGE_RANGE_OPTIONS } from '../../../utilities/constants/patient.constants'

interface PatientFiltersProps {
  filters: PatientFilterFormDto
  options: PatientFilterOptions
  onInputHandleChange: (property: keyof PatientFilterFormDto, value: string) => void
  onInputFocus: (property: keyof PatientFilterFormDto) => void
  onReset: () => void
}

const PatientFilters = ({
  filters,
  options,
  onInputHandleChange,
  onInputFocus,
  onReset,
}: PatientFiltersProps) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pb: '16px !important' }}>
        {/* Row 1: Dropdowns + Reset */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md>
            <TextField
              fullWidth
              size="small"
              select
              label="First Name"
              value={filters.firstName.value}
              disabled={filters.firstName.disable}
              error={!!filters.firstName.error}
              helperText={filters.firstName.error}
              onFocus={() => onInputFocus('firstName')}
              onChange={(event) => onInputHandleChange('firstName', event.target.value)}
            >
              <MenuItem value="">All First Names</MenuItem>
              {options.firstNames.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md>
            <TextField
              fullWidth
              size="small"
              select
              label="Last Name"
              value={filters.lastName.value}
              disabled={filters.lastName.disable}
              error={!!filters.lastName.error}
              helperText={filters.lastName.error}
              onFocus={() => onInputFocus('lastName')}
              onChange={(event) => onInputHandleChange('lastName', event.target.value)}
            >
              <MenuItem value="">All Last Names</MenuItem>
              {options.lastNames.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md>
            <TextField
              fullWidth
              size="small"
              select
              label="Age Range"
              value={filters.ageRange.value}
              disabled={filters.ageRange.disable}
              error={!!filters.ageRange.error}
              helperText={filters.ageRange.error}
              onFocus={() => onInputFocus('ageRange')}
              onChange={(event) => onInputHandleChange('ageRange', event.target.value)}
            >
              {AGE_RANGE_OPTIONS.map((item) => (
                <MenuItem key={item.value || 'all'} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md>
            <TextField
              fullWidth
              size="small"
              select
              label="Doctor"
              value={filters.doctor.value}
              disabled={filters.doctor.disable}
              error={!!filters.doctor.error}
              helperText={filters.doctor.error}
              onFocus={() => onInputFocus('doctor')}
              onChange={(event) => onInputHandleChange('doctor', event.target.value)}
            >
              <MenuItem value="">All Doctors</MenuItem>
              {options.doctors.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md>
            <TextField
              fullWidth
              size="small"
              select
              label="Health Card Number"
              value={filters.healthCardNumber.value}
              disabled={filters.healthCardNumber.disable}
              error={!!filters.healthCardNumber.error}
              helperText={filters.healthCardNumber.error}
              onFocus={() => onInputFocus('healthCardNumber')}
              onChange={(event) => onInputHandleChange('healthCardNumber', event.target.value)}
            >
              <MenuItem value="">All Health Cards</MenuItem>
              {options.healthCardNumbers.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs="auto">
            <Button variant="outlined" size="small" onClick={onReset} sx={{ height: 40 }}>
              Reset
            </Button>
          </Grid>
        </Grid>

        {/* Row 2: Radio filters */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={4}>
            <FormControl disabled={filters.gender.disable}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                value={filters.gender.value}
                onChange={(event) => onInputHandleChange('gender', event.target.value)}
              >
                <FormControlLabel value="MALE" control={<Radio size="small" />} label="Male" />
                <FormControlLabel value="FEMALE" control={<Radio size="small" />} label="Female" />
                <FormControlLabel value="OTHER" control={<Radio size="small" />} label="Other" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl disabled={filters.userStatus.disable}>
              <FormLabel>User Status</FormLabel>
              <RadioGroup
                row
                value={filters.userStatus.value}
                onChange={(event) => onInputHandleChange('userStatus', event.target.value)}
              >
                <FormControlLabel value="ALL" control={<Radio size="small" />} label="All" />
                <FormControlLabel value="ACTIVE" control={<Radio size="small" />} label="Active" />
                <FormControlLabel
                  value="INACTIVE"
                  control={<Radio size="small" />}
                  label="Inactive"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl disabled={filters.healthCardStatus.disable}>
              <FormLabel>Health Card Status</FormLabel>
              <RadioGroup
                row
                value={filters.healthCardStatus.value}
                onChange={(event) => onInputHandleChange('healthCardStatus', event.target.value)}
              >
                <FormControlLabel value="ALL" control={<Radio size="small" />} label="All" />
                <FormControlLabel value="ACTIVE" control={<Radio size="small" />} label="Active" />
                <FormControlLabel value="EXPIRED" control={<Radio size="small" />} label="Expire" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PatientFilters
