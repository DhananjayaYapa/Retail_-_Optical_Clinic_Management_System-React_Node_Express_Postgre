import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import WcOutlinedIcon from '@mui/icons-material/WcOutlined'
import { Avatar, Box, Button, Chip, Divider, Paper, Switch, Typography } from '@mui/material'
import type { PatientFullApiRecord } from '../../../utilities/models'
import { getDisplayName, getInitials } from '../../../utilities/helpers/patient.helpers'
import { DUMMY_VISITS } from '../../../utilities/constants/patient.constants'

interface PatientProfileProps {
  patient: PatientFullApiRecord
  onToggleStatus?: (patient: PatientFullApiRecord) => void
  canToggleStatus?: boolean
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.25 }}>
      {value || '—'}
    </Typography>
  </Box>
)

const btnSx = { textTransform: 'none', fontSize: '0.7rem', py: 0.25, px: 1 } as const
const qIconSx = { fontSize: 14 } as const

const QuickInfo = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {icon}
    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
      {label}: {value || '—'}
    </Typography>
  </Box>
)

const PatientProfile = ({
  patient,
  onToggleStatus,
  canToggleStatus = true,
}: PatientProfileProps) => {
  const initials = getInitials(patient.fullName)
  const displayName = getDisplayName(patient.fullName)
  const isActive = !patient.deletedAt
  const phoneNumber =
    patient.phoneNumbers.find((p) => p.isPrimary || p.phoneType === 'MOBILE')?.phoneNumber || '—'

  const addressParts = [
    patient.address?.addressLine1,
    patient.address?.addressLine2,
    patient.address?.city,
  ].filter(Boolean)
  const address = addressParts.length > 0 ? addressParts.join(', ') : '—'
  const provinceCountry = [patient.address?.province, patient.address?.postalCode]
    .filter(Boolean)
    .join(', ')

  return (
    <Paper sx={{ borderRadius: 2, p: 3, height: '100%', minWidth: 600 }}>
      {/* Top Section — Avatar + Name + Actions + Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'primary.main',
            fontSize: '1.25rem',
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {displayName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Button size="small" variant="outlined" startIcon={<EditOutlinedIcon />} sx={btnSx}>
              Edit Profile
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<CalendarTodayOutlinedIcon />}
              sx={btnSx}
            >
              Book App
            </Button>
            <Button size="small" variant="outlined" startIcon={<ScienceOutlinedIcon />} sx={btnSx}>
              Start Exam
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <Chip
            size="small"
            label={isActive ? 'Active' : 'Inactive'}
            color={isActive ? 'success' : 'default'}
            variant={isActive ? 'filled' : 'outlined'}
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
          {canToggleStatus && (
            <Switch checked={isActive} size="small" onChange={() => onToggleStatus?.(patient)} />
          )}
        </Box>
      </Box>

      {/* Quick Info Strip */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 2,
          py: 1,
          px: 1.5,
          bgcolor: 'action.hover',
          borderRadius: 1,
        }}
      >
        <QuickInfo
          icon={<BadgeOutlinedIcon sx={qIconSx} />}
          label="ID"
          value={patient.patientCode}
        />
        <QuickInfo
          icon={<CalendarMonthOutlinedIcon sx={qIconSx} />}
          label="DOB"
          value={new Date(patient.dateOfBirth).toLocaleDateString()}
        />
        <QuickInfo icon={<WcOutlinedIcon sx={qIconSx} />} label="Gender" value={patient.gender} />
        <QuickInfo icon={<PhoneOutlinedIcon sx={qIconSx} />} label="Phone" value={phoneNumber} />
        <QuickInfo
          icon={<LocalHospitalOutlinedIcon sx={qIconSx} />}
          label="DOC"
          value={patient.insuranceInfo?.preferredDoctor || '—'}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Details Section — Two Columns */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* LEFT Column — Personal Information */}
        <Box sx={{ flex: 1, border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
              '&:last-child': { borderBottom: 0 },
            }}
          >
            Personal Information
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <InfoItem label="Full Name" value={patient.fullName} />
              <InfoItem label="Phone Number" value={phoneNumber} />
              <InfoItem label="Address" value={address} />
              <InfoItem label="Province & Country" value={provinceCountry} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <InfoItem label="Email" value="—" />
              <InfoItem label="Guardian" value={patient.additionalInfo?.guardian || ''} />
              <InfoItem label="Branch" value={patient.branch?.name || ''} />
              <InfoItem label="Gender" value={patient.gender} />
            </Box>
          </Box>
        </Box>

        {/* RIGHT Column — Billing (top) + Recent Visit History (bottom) */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Insurance & Billing */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 },
              }}
            >
              Insurance & Billing
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <InfoItem
                  label="Health Card Number"
                  value={patient.insuranceInfo?.healthCardNumber || ''}
                />
                <InfoItem
                  label="Expire Date"
                  value={
                    patient.insuranceInfo?.expiryDate
                      ? new Date(patient.insuranceInfo.expiryDate).toLocaleDateString()
                      : ''
                  }
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <InfoItem
                  label="Vision Code"
                  value={patient.insuranceInfo?.healthCardVisionCode || ''}
                />
              </Box>
            </Box>
          </Box>

          {/* Recent Visit History */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2, flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 },
              }}
            >
              Recent Visit History
            </Typography>
            {DUMMY_VISITS.map((visit) => (
              <Box
                key={visit.date}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {visit.reason}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {visit.doctor}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {new Date(visit.date).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default PatientProfile
