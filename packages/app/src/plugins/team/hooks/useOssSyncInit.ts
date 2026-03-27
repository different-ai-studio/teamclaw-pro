import { useEffect } from 'react'
import { useWorkspaceStore } from '@/stores/workspace'
import { useTeamOssStore } from '@/stores/team-oss'
import { isTauri } from '@/lib/utils'

export function useOssSyncInit() {
  const workspacePath = useWorkspaceStore((s) => s.workspacePath)
  const initialize = useTeamOssStore((s) => s.initialize)
  const cleanup = useTeamOssStore((s) => s.cleanup)

  useEffect(() => {
    if (!workspacePath || !isTauri()) return

    cleanup()
    initialize(workspacePath).catch((err: unknown) => {
      console.warn('[team-plugin] OSS sync init failed (non-critical):', err)
    })

    return () => {
      cleanup()
    }
  }, [workspacePath, initialize, cleanup])
}
