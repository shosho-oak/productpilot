import type { ConversationData } from "./types"

export const CONVERSATIONS: ConversationData[] = [
  // ── c1: Export CSV (pinned) ───────────────────────────────────────────────
  {
    id: "c1",
    title: "Export CSV feature",
    time: "2 hours ago",
    pinned: true,
    messages: [
      { role: "user", content: "Users want to export dashboard data to CSV.", time: "10:32 AM" },
      {
        role: "ai",
        content:
          "Got it. I've seen this pattern before — it usually surfaces when users are doing performance reviews or sharing data with stakeholders who live in spreadsheets.\n\nHere's what I understand:\n\n**Feature:** CSV export from any dashboard view\n**Trigger:** Users need offline access to filtered data\n**Likely gap:** No current export mechanism exists\n\nWhere would you like to start?",
        chips: ["User Story", "Acceptance Criteria", "Edge Cases", "KPIs", "Generate All →"],
        time: "10:32 AM",
      },
      { role: "user", content: "Start with the user story.", time: "10:33 AM" },
      {
        role: "ai",
        content:
          "Quick clarification before I draft — is this scoped to a specific persona, or should I write it broadly?\n\nBased on your dashboard analytics, your heaviest power users are **marketing managers** and **ops leads**. Targeting one will make the acceptance criteria much sharper.",
        chips: ["Marketing managers", "Ops leads", "Keep it broad"],
        time: "10:33 AM",
      },
      { role: "user", content: "Marketing managers.", time: "10:34 AM" },
      {
        role: "ai",
        content: "Here's the user story, scoped to campaign reporting:",
        story: {
          as: "a marketing manager",
          want: "export dashboard data to CSV",
          so: "I can analyze campaign performance offline and share it with my team.",
        },
        followUp:
          "I've anchored this to campaign analysis — there's also a common secondary use case around **stakeholder reporting**. Want me to draft that variant too, or generate the full artifact set based on this one?",
        followUpChips: ["Generate everything", "Add stakeholder variant"],
        time: "10:34 AM",
      },
      { role: "user", content: "Generate everything.", time: "10:35 AM" },
      {
        role: "ai",
        content:
          "All 5 artifacts are ready in the panel →\n\nOne thing worth flagging before you take this to sprint planning: the edge case around **large exports (>10,000 rows)** is a non-trivial engineering problem. I've noted it in the Edge Cases artifact — worth a quick sync with your tech lead before committing to a timeline.",
        checklist: [
          "User Story — marketing manager, campaign analysis persona",
          "Acceptance Criteria — 3 testable requirements with clear exit criteria",
          "Edge Cases — 3 scenarios, including a flagged engineering risk",
          "KPIs — 3 metrics tied to feature adoption and retention",
          "Priority Score — High impact · Low effort · Next sprint",
        ],
        time: "10:35 AM",
      },
    ],
    artifacts: [
      {
        id: "c1-a1",
        type: "user-story",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "3 min ago",
        version: "v1",
        textContent:
          "As a marketing manager,\nI want to export dashboard data to CSV\nso that I can analyze campaign performance offline and share it with my team.",
      },
      {
        id: "c1-a2",
        type: "acceptance-criteria",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "3 min ago",
        version: "v1",
        textContent:
          "- User can export CSV from any dashboard view.\n- Export respects currently active filters.\n- File downloads successfully within 5 seconds.",
      },
      {
        id: "c1-a3",
        type: "edge-cases",
        status: "Draft",
        author: "Sarah Chen",
        timestamp: "3 min ago",
        version: "v1",
        textContent:
          "- No data available — show an informative empty state.\n- Large exports (>10,000 rows) may time out — needs engineering input. [Engineering risk]\n- Invalid filters applied — validate before triggering download.",
      },
      {
        id: "c1-a4",
        type: "kpis",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "3 min ago",
        version: "v1",
        textContent:
          "Export usage rate — % of active users who export per week\nFeature adoption — Time-to-first-export after onboarding\nRetention impact — Churn delta: exporters vs. non-exporters",
      },
      {
        id: "c1-a5",
        type: "priority",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "3 min ago",
        version: "v1",
        textContent:
          "Priority: High\nImpact: High\nEffort: Low\nRecommendation: Implement in the next sprint. High ROI with minimal engineering investment — strong quick win.",
      },
    ],
  },

  // ── c2: Mobile onboarding (pinned) ────────────────────────────────────────
  {
    id: "c2",
    title: "Mobile onboarding flow",
    time: "Yesterday",
    pinned: true,
    messages: [
      {
        role: "user",
        content: "We're seeing 67% drop-off at step 2 of mobile onboarding. That's the notification permissions screen.",
        time: "10:15 AM",
      },
      {
        role: "ai",
        content:
          "A 67% drop at the permissions step is a strong signal — users are either hitting the native prompt too early, or they don't understand the value exchange yet.\n\n**Most common causes:**\n- Requesting permissions before users experience the product's value\n- No context screen before the native dialog\n- Too many permissions requested at once\n\nWhich platform is this — iOS, Android, or both?",
        time: "10:15 AM",
      },
      {
        role: "user",
        content: "iOS primarily. We ask for notifications on step 2, before users complete their first action.",
        time: "10:16 AM",
      },
      {
        role: "ai",
        content:
          "That's the issue — iOS users are being asked for a commitment before they understand why they'd want notifications.\n\nThe fix is a **soft-ask screen** before the native prompt: explain the value in plain language, show 2–3 specific examples, then trigger the system dialog only if they agree.\n\nThis pattern typically moves opt-in rates from 25–30% up to 60–70% in comparable products.\n\nShould I draft a user story and acceptance criteria for the redesigned flow?",
        chips: ["User Story", "Acceptance Criteria", "Both"],
        time: "10:16 AM",
      },
      { role: "user", content: "Yes, both.", time: "10:17 AM" },
      {
        role: "ai",
        content:
          "Both artifacts are ready in the panel →\n\nI've written the user story from the perspective of a first-time iOS user. The acceptance criteria include the soft-ask pattern, and I've flagged one key edge case: users who decline the soft-ask should never see the native prompt in that session.",
        checklist: [
          "User Story — first-time iOS user, notification value framing",
          "Acceptance Criteria — 5 requirements including soft-ask screen and session behavior",
        ],
        time: "10:17 AM",
      },
    ],
    artifacts: [
      {
        id: "c2-a1",
        type: "user-story",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "Yesterday",
        version: "v1",
        textContent:
          "As a first-time iOS user,\nI want to understand why the app needs notifications before being asked,\nso that I can make an informed decision without feeling pressured.",
      },
      {
        id: "c2-a2",
        type: "acceptance-criteria",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "Yesterday",
        version: "v1",
        textContent:
          "- A soft-ask screen is shown before the native iOS notifications prompt.\n- The soft-ask explains the value with 2-3 specific use case examples.\n- Users who decline the soft-ask are not shown the native dialog in that session.\n- Users can enable notifications from Settings at any time after declining.\n- The soft-ask screen design matches the overall app visual language.",
      },
    ],
  },

  // ── c3: Q3 Backlog Prioritization ─────────────────────────────────────────
  {
    id: "c3",
    title: "Prioritize Q3 backlog",
    time: "3 days ago",
    messages: [
      {
        role: "user",
        content: "I have 12 features queued for Q3 and leadership wants us to cut to 5. Can you help me prioritize?",
        time: "2:10 PM",
      },
      {
        role: "ai",
        content:
          "Happy to help. To prioritize well I need two things:\n\n**1. A framework** — which would you prefer?\n- Impact vs Effort (simple, fast)\n- RICE scoring (Reach × Impact × Confidence ÷ Effort)\n- MoSCoW (Must / Should / Could / Won't)\n\n**2. A primary objective** — what is Q3 optimizing for? Revenue, retention, activation, or NPS?",
        chips: ["Impact vs Effort", "RICE", "MoSCoW"],
        time: "2:10 PM",
      },
      { role: "user", content: "Impact vs Effort. We're focused on improving retention.", time: "2:11 PM" },
      {
        role: "ai",
        content:
          "Based on a retention lens and what I know about your product, here's a prioritization matrix.\n\n**Quick Wins** (high impact, low effort) should be your Q3 starting point — they deliver retention value fast without heavy engineering investment.\n\nI've deprioritized anything with high effort and unclear retention impact. Those can live in a Q4 consideration bucket.",
        checklist: [
          "Prioritization matrix — Impact vs Effort, retention lens",
          "4 quadrants: Quick Wins, Strategic, Fill-ins, Deprioritize",
        ],
        time: "2:11 PM",
      },
    ],
    artifacts: [
      {
        id: "c3-a1",
        type: "prioritization",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "3 days ago",
        version: "v1",
        textContent:
          "QUICK WINS\n- Export CSV — High impact, Low effort\n- Onboarding redesign — High impact, Medium effort\n\nSTRATEGIC\n- Advanced analytics filters — High impact, High effort\n- Custom dashboard layouts — High impact, High effort\n\nFILL-INS\n- Dark mode — Low impact, Low effort\n- Email digest notifications — Low impact, Low effort\n\nDEPRIORITIZE\n- Legacy API v1 support — Low impact, Very high effort\n- Custom export formats — Low impact, Medium effort",
      },
    ],
  },

  // ── c4: Release Notes v2.1 ────────────────────────────────────────────────
  {
    id: "c4",
    title: "Release notes v2.1",
    time: "1 week ago",
    messages: [
      {
        role: "user",
        content:
          "I need customer-facing release notes for v2.1. Changes: CSV export (new feature), improved dashboard filters with multi-select, date range picker bug fix, 40% performance improvement on large datasets.",
        time: "3:45 PM",
      },
      {
        role: "ai",
        content:
          "I can write these in a few formats:\n\n- **Customer-facing** — plain language, benefit-first, no technical jargon\n- **Technical** — detailed changelog for developers or internal teams\n- **Hybrid** — brief customer summary + expandable technical details\n\nWhich format works best for your audience?",
        chips: ["Customer-facing", "Technical", "Hybrid"],
        time: "3:45 PM",
      },
      { role: "user", content: "Customer-facing. They get emailed to all users.", time: "3:46 PM" },
      {
        role: "ai",
        content:
          "Release notes are ready in the panel →\n\nI've led with the CSV export since it's your highest-impact change. Everything is described in terms of what users can now do, not what changed internally — that framing lands much better in email.",
        checklist: ["Release Notes — customer-facing, benefit-led, email-ready"],
        time: "3:46 PM",
      },
    ],
    artifacts: [
      {
        id: "c4-a1",
        type: "release-notes",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "1 week ago",
        version: "v1",
        textContent:
          "# What's new in v2.1\n\n## Export your data\nYou can now export any dashboard view to CSV with a single click. Active filters are preserved in the download — what you see is what you get.\n\n## Smarter filtering\nDashboard filters now support multi-select, so you can compare across multiple values at once. All reports update instantly as you filter.\n\n## Bug fixes\n- Fixed an issue where the date range picker would reset unexpectedly after navigating away.\n- Resolved a display inconsistency in the Analytics panel on smaller screens.\n\n## Performance\nDashboard load times are 40% faster when working with large datasets. Charts and tables now render without the lag you may have noticed in v2.0.",
      },
    ],
  },

  // ── c5: Design Sync meeting summary ──────────────────────────────────────
  {
    id: "c5",
    title: "Design sync — meeting notes",
    time: "1 week ago",
    messages: [
      {
        role: "user",
        content:
          "Summarize this meeting. [Design sync, 45 min. Attendees: Sarah, Ahmed, Omar, Priya]\n\nTopics: reviewed mobile onboarding redesign, aligned on soft-ask for notifications, agreed on CSV export button placement (top-right of dashboard header), Omar raised concern about performance for large exports — no resolution.",
        time: "11:00 AM",
      },
      {
        role: "ai",
        content:
          "Summarizing now. I'll separate decisions, open questions, and action items.\n\nOne flag: Omar's performance concern appears to be unresolved. I'll mark it as an open question rather than a decision — is that correct?",
        time: "11:00 AM",
      },
      { role: "user", content: "Yes, that's right. Still open.", time: "11:01 AM" },
      {
        role: "ai",
        content:
          "Summary is ready in the panel →\n\nI've kept it tight — decisions are clearly separated from open questions so it's easy to share with the team. Omar's export performance concern is flagged with a suggested owner and deadline.",
        checklist: ["Meeting Summary — decisions, open questions, and action items separated"],
        time: "11:01 AM",
      },
    ],
    artifacts: [
      {
        id: "c5-a1",
        type: "meeting-summary",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "1 week ago",
        version: "v1",
        textContent:
          "Meeting: Design Sync\nDate: June 20, 2026\nAttendees: Sarah, Ahmed, Omar, Priya\nDuration: 45 minutes\n\nDECISIONS\n- Soft-ask screen will be used before the iOS notifications prompt.\n- CSV export button placed top-right in the dashboard header.\n- Export will preserve all active filters on download.\n\nOPEN QUESTIONS\n- How do we handle exports over 10,000 rows? (Owner: Omar + Engineering)\n- Do we need a progress indicator for large exports?\n\nACTION ITEMS\n- Sarah: Draft acceptance criteria for the notifications redesign by Thursday.\n- Ahmed: Prototype soft-ask screen in Figma by Wednesday.\n- Omar: Check with engineering on large export performance limits by Friday.",
      },
    ],
  },

  // ── c6: Analytics dashboard filters ──────────────────────────────────────
  {
    id: "c6",
    title: "Analytics dashboard filters",
    time: "2 weeks ago",
    messages: [
      {
        role: "user",
        content: "I need acceptance criteria for the new multi-select filter system in the Analytics dashboard.",
        time: "4:20 PM",
      },
      {
        role: "ai",
        content:
          "Before I write these, a few quick questions to make the criteria precise:\n\n1. **Persistence** — do filters persist across sessions, or session-only?\n2. **Reports** — should existing saved reports update dynamically when filters change?\n3. **Limits** — is there a maximum number of filter values or combinations?",
        time: "4:20 PM",
      },
      { role: "user", content: "Session only. Reports update dynamically. No hard limits for now.", time: "4:21 PM" },
      {
        role: "ai",
        content:
          "Got it — session-scoped, live-updating, no combination cap.\n\nI've written 6 acceptance criteria covering the happy path, session behavior, and dynamic report updates. I've also included edge cases — the empty-result state is worth designing explicitly since users often don't expect it.",
        checklist: [
          "Acceptance Criteria — 6 requirements, session-scoped behavior",
          "Edge Cases — 4 scenarios including empty states and session expiry",
        ],
        time: "4:21 PM",
      },
    ],
    artifacts: [
      {
        id: "c6-a1",
        type: "acceptance-criteria",
        status: "Ready",
        author: "Sarah Chen",
        timestamp: "2 weeks ago",
        version: "v1",
        textContent:
          "- Users can select multiple filter values within a single dimension.\n- All active reports update immediately when a filter is applied or removed.\n- Filter selections persist throughout the current browser session.\n- Filters are cleared when the user navigates away from the Analytics section.\n- Filter state is not persisted to the user's account across sessions.\n- Applied filters are displayed as removable chips above all reports.",
      },
      {
        id: "c6-a2",
        type: "edge-cases",
        status: "Draft",
        author: "Sarah Chen",
        timestamp: "2 weeks ago",
        version: "v1",
        textContent:
          "- Empty result set — show empty state with 'Clear all filters' CTA and suggested alternatives.\n- All filters removed — revert to default unfiltered report view without a page reload.\n- Session expiry with active filters — clear state on re-authentication, do not restore previous filters. [Engineering risk]\n- Filter value no longer exists (e.g., deleted segment) — remove gracefully with a toast notification.",
      },
    ],
  },
]

export const QUICK_ACTION_EXCHANGES: Record<string, { user: string; ai: string }> = {
  "User Story": {
    user: "Show me the user story.",
    ai: "Here it is — highlighted in the Artifacts panel. Click **Edit** to adjust the persona or rephrase any section directly.",
  },
  "Acceptance Criteria": {
    user: "Pull up the acceptance criteria.",
    ai: "Acceptance criteria are ready. Each one is written to be directly testable — clear pass/fail conditions that QA can work from immediately.",
  },
  "Edge Cases": {
    user: "What edge cases should we handle?",
    ai: "Edge cases are in the panel. I've flagged one with an **engineering risk** — worth a quick sync with your tech lead before committing to a sprint timeline.",
  },
  "Release Notes": {
    user: "Show me the release notes.",
    ai: "Release notes are ready in the panel. Written in customer-facing language — appropriate for email or in-app announcements.",
  },
  "KPIs": {
    user: "What KPIs should we track for this?",
    ai: "I've pulled up 3 KPIs tied to adoption and retention. These should be straightforward to instrument with your current analytics stack.",
  },
  "Prioritization": {
    user: "Show me the prioritization.",
    ai: "Here's the priority matrix — highlighted in the panel. The **Quick Wins** quadrant is where I'd recommend starting for Q3.",
  },
  "Meeting Summary": {
    user: "Pull up the meeting summary.",
    ai: "Summary is in the panel. Decisions and open questions are clearly separated — ready to copy and share with the team.",
  },
}
