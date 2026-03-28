---
name: platform-actions
description: Use when the user wants to manage team members, approve join requests, manage AI keys/budget, or perform any platform operation through natural language chat.
---

# Platform Actions

You have access to the `platform` tool for executing TeamClaw platform operations.

## Quick Reference

```
platform(action: "list")                              -- see all available actions
platform(action: "<domain>.<action>", params: {...})  -- execute an action
```

## Available Actions

### team (团队管理)

| Action | Description | Key Params | Role |
|--------|-------------|------------|------|
| `team.list-members` | 列出团队成员及角色 | - | viewer+ |
| `team.list-applications` | 查看待审批的加入申请 | - | editor+ |
| `team.approve-member` | 批准加入申请 | nodeId, name, role | editor+ |
| `team.reject-member` | 拒绝加入申请 | nodeId | editor+ |
| `team.remove-member` | 移除成员 | nodeId | owner |

### ai (AI 管理)

| Action | Description | Key Params | Role |
|--------|-------------|------------|------|
| `ai.add-member-key` | 创建成员 API Key | nodeId, memberName | member |
| `ai.remove-member-key` | 删除成员 Key | nodeId, ownerNodeId | owner |
| `ai.list-keys` | 列出所有 Key 及用量 | - | member |
| `ai.usage` | 查询 AI 用量 | nodeId?, startDate?, endDate? | member |
| `ai.set-budget` | 设置预算上限 | maxBudget, ownerNodeId | owner |

## Common Workflows

### Approve a member request
```
1. platform(action: "team.list-applications")
   → Returns list of pending applications with nodeId, name, email, etc.

2. platform(action: "team.approve-member", params: {
     "nodeId": "<from application>",
     "name": "<from application>",
     "role": "editor"
   })
```

### Check team AI spending
```
1. platform(action: "ai.usage")
   → Returns total team spend and per-member breakdown

2. platform(action: "ai.set-budget", params: {
     "maxBudget": 100,
     "ownerNodeId": "<owner's node ID>"
   })
```

## Important Notes

- **Auth is auto-injected**: teamId, teamSecret, and callerNodeId are automatically included in every request. Never ask the user for these values.
- **Permission errors**: If an action fails with a permission error, explain the required role (owner/editor/viewer) to the user clearly.
- **Use list first**: When the user asks to approve or manage members, always list first so you have the correct nodeId values.
- **Role hierarchy**: owner > editor > viewer. Owners can do everything, editors can manage applications, viewers are read-only.
