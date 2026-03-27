import * as React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { SettingsSection } from '@/stores/ui'
import { getPlugins } from '@/plugins/registry'
import { LLMSection } from './LLMSection'
import { GeneralSection } from './GeneralSection'
import { PromptSection } from './PromptSection'
import { MCPSection } from './MCPSection'
import { SkillsSection } from './SkillsSection'
import { ChannelsSection } from './ChannelsSection'
import { DependenciesSection } from './DependenciesSection'
import { CronSection } from './CronSection'
import { EnvVarsSection } from './EnvVarsSection'
import { TokenUsageSection } from './TokenUsageSection'
import { PrivacySection } from './PrivacySection'
import { KnowledgeSection } from './KnowledgeSection'
import { PermissionManagementSection } from './PermissionManagementSection'
import { VoiceSection } from './VoiceSection'
import { LeaderboardSection } from './LeaderboardSection'
import { ShortcutsSection } from '@/components/shortcuts/ShortcutsSection'

const CORE_SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  llm: LLMSection,
  general: GeneralSection,
  voice: VoiceSection,
  prompt: PromptSection,
  mcp: MCPSection,
  channels: ChannelsSection,
  automation: CronSection,
  envVars: EnvVarsSection,
  skills: SkillsSection,
  knowledge: KnowledgeSection,
  deps: DependenciesSection,
  tokenUsage: TokenUsageSection,
  privacy: PrivacySection,
  permissions: PermissionManagementSection,
  leaderboard: LeaderboardSection,
  shortcuts: ShortcutsSection,
}

export function getSectionComponent(id: string): React.ComponentType | undefined {
  if (CORE_SECTION_COMPONENTS[id]) return CORE_SECTION_COMPONENTS[id]
  for (const plugin of getPlugins()) {
    const section = plugin.settingsSections?.find(s => s.id === id)
    if (section) return section.component
  }
  return undefined
}

export function SettingsSectionBody({ section }: { section: SettingsSection }) {
  const Component = getSectionComponent(section)
  if (!Component) return null
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-muted/5">
      <ScrollArea className="h-full min-h-0 flex-1">
        <div className="max-w-2xl mx-auto p-8">
          {React.createElement(Component)}
        </div>
      </ScrollArea>
    </div>
  )
}
