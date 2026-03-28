import type { ReactNode } from 'react'
import { usePermission } from '../../utilities/hooks/usePermission'
import type { FeatureKey } from '../../utilities/constants/permissions.config'

interface AuthorizeProps {
  /** Feature key to check permission for */
  feature: FeatureKey
  /** Content to render when user has permission */
  children: ReactNode
  /** Render fallback instead of hiding (optional) */
  fallback?: ReactNode
}

/**
 * Declarative RBAC guard component.
 *
 * Usage:
 *   <Authorize feature={FEATURES.PATIENT_CREATE}>
 *     <Button>Add New Patient</Button>
 *   </Authorize>
 */
const Authorize = ({ feature, children, fallback = null }: AuthorizeProps) => {
  const allowed = usePermission(feature)
  return allowed ? <>{children}</> : <>{fallback}</>
}

export default Authorize
