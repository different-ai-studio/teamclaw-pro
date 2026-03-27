import { isTauri } from '@/lib/utils'

const TEAM_EXPORT_DEBOUNCE_MS = 5 * 60 * 1000
let teamExportTimerId: ReturnType<typeof setTimeout> | null = null
let lastTeamExportAt = 0

export function scheduleTeamFeedbackExport(force: boolean = false) {
  if (!isTauri()) return

  const now = Date.now()
  const elapsed = now - lastTeamExportAt
  if (!force && elapsed < TEAM_EXPORT_DEBOUNCE_MS && teamExportTimerId) return

  if (teamExportTimerId) clearTimeout(teamExportTimerId)

  const delay = force ? 1000 : (elapsed >= TEAM_EXPORT_DEBOUNCE_MS ? 3000 : TEAM_EXPORT_DEBOUNCE_MS - elapsed)
  teamExportTimerId = setTimeout(async () => {
    teamExportTimerId = null
    try {
      const { invoke } = await import('@tauri-apps/api/core')
      await Promise.all([
        invoke('telemetry_export_team_feedback', {}),
        invoke('telemetry_export_leaderboard', {}),
      ])
      lastTeamExportAt = Date.now()
    } catch (err) {
      console.error('[team-plugin] Failed to export team data:', err)
    }
  }, delay)
}
