import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import { hasPermission, type FeatureKey } from '../constants/permissions.config'

/**
 * Check if the current user has permission for a specific feature.
 *
 * Usage:
 *   const canCreate = usePermission(FEATURES.PATIENT_CREATE)
 */
export const usePermission = (feature: FeatureKey): boolean => {
  const role = useSelector((state: RootState) => state.auth.user?.role)
  return useMemo(() => hasPermission(role, feature), [role, feature])
}

/**
 * Check multiple feature keys at once.
 *
 * Usage:
 *   const { canCreate, canDelete } = usePermissions({
 *     canCreate: FEATURES.PATIENT_CREATE,
 *     canDelete: FEATURES.PATIENT_DELETE,
 *   })
 */
export const usePermissions = <K extends string>(
  featureMap: Record<K, FeatureKey>
): Record<K, boolean> => {
  const role = useSelector((state: RootState) => state.auth.user?.role)
  return useMemo(() => {
    const result = {} as Record<K, boolean>
    for (const key in featureMap) {
      result[key] = hasPermission(role, featureMap[key])
    }
    return result
  }, [role, featureMap])
}
