import { registerPlugin } from '@/plugins/registry'
import { registerVersionHistoryProvider } from '@/stores/version-history'
import { Users } from 'lucide-react'
import { lazy } from 'react'
import type { VersionedFileInfo, FileVersion } from '@/stores/version-history'
import { useOssSyncInit } from './hooks/useOssSyncInit'
import { useP2pAutoReconnect } from './hooks/useP2pAutoReconnect'

const TeamSection = lazy(() => import('./components/TeamSection').then(m => ({ default: m.TeamSection })))

registerPlugin({
  id: 'team-sync',

  settingsSections: [{
    id: 'team',
    label: 'Team',
    labelKey: 'settings.nav.team',
    icon: Users,
    component: TeamSection,
    group: 'primary',
    color: 'text-violet-500',
  }],

  useInit() {
    useOssSyncInit()
    useP2pAutoReconnect()
  },

  onWorkspaceChange(workspacePath: string) {
    import('./stores/team-mode').then(({ useTeamModeStore }) => {
      useTeamModeStore.getState().loadTeamConfig(workspacePath).catch(() => {})
    })
  },

  onWorkspaceReset() {
    import('./stores/team-mode').then(({ useTeamModeStore }) => {
      useTeamModeStore.setState({
        teamMode: false,
        teamModelConfig: null,
        teamApiKey: null,
        _appliedConfigKey: null,
        myRole: null,
        p2pConnected: false,
        p2pConfigured: false,
      })
    })
    import('./stores/team-oss').then(({ useTeamOssStore }) => {
      useTeamOssStore.getState().cleanup()
    })
  },

  onTelemetryEvent(event: string) {
    if (event === 'feedback-changed' || event === 'feedback-export-forced') {
      import('./telemetry-export').then(m => m.scheduleTeamFeedbackExport(event === 'feedback-export-forced'))
    }
  },

  sidebarWidgets: [],
})

// Register version history provider
registerVersionHistoryProvider({
  listFiles: async (workspacePath, docType) => {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<VersionedFileInfo[]>('team_list_all_versioned_files', { workspacePath, docType: docType ?? null })
  },
  listVersions: async (workspacePath, docType, filePath) => {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<FileVersion[]>('team_list_file_versions', { workspacePath, docType, filePath })
  },
  restore: async (workspacePath, docType, filePath, versionIndex) => {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke('team_restore_file_version', { workspacePath, docType, filePath, versionIndex })
  },
})
