import type { PatientEntryFormDto } from '../../../utilities/models'

export const TITLE_OPTIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']
export const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER']
export const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Guardian',
  'Friend',
  'Other',
]

export const outlineSx = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 2,
  p: 2,
}

export interface PatientSectionProps {
  formData: PatientEntryFormDto
  onInputHandleChange: (property: keyof PatientEntryFormDto, value: string) => void
  onInputFocus: (property: keyof PatientEntryFormDto) => void
}
