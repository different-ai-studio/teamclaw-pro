import { useEffect } from 'react'
import { useWorkspaceStore } from '@/stores/workspace'
import { isTauri } from '@/lib/utils'

export function useP2pAutoReconnect() {
  const workspacePath = useWorkspaceStore((s) => s.workspacePath)
  const openCodeReady = useWorkspaceStore((s) => s.openCodeReady)

  useEffect(() => {
    if (!workspacePath || !openCodeReady || !isTauri()) return

    const timer = setTimeout(async () => {
      try {
        const { useTeamModeStore } = await import('../stores/team-mode')
        if (!useTeamModeStore.getState().teamMode) return

        const { invoke } = await import('@tauri-apps/api/core')
        await invoke('p2p_reconnect')

        const status = await invoke<{ connected?: boolean; role?: string }>('p2p_sync_status').catch(() => null)
        if (status) {
          useTeamModeStore.setState({
            p2pConnected: status.connected ?? false,
            myRole: (status.role as 'owner' | 'editor' | 'viewer') ?? null,
          })
        }
        console.log('[team-plugin] P2P auto-reconnect completed')
      } catch (err) {
        console.warn('[team-plugin] P2P auto-reconnect failed (non-critical):', err)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [workspacePath, openCodeReady])
}
