# Account UI Demos Implementation Plan

## Goal
Implement static UI demos for the account pages based on the design documents in `vns-masakinihirota-design/0016 UI Design/account-pages`. These pages will use dummy data but be structured to allow future Supabase integration.

## Proposed Changes

### Directory Structure
Create `src/app/playground/account-demos/` with the following structure:

```
src/app/playground/account-demos/
├── layout.tsx                  # Shared layout for account demos (optional)
├── data.ts                     # Dummy data for root account and profiles
├── page.tsx                    # Index page listing the demos
├── root-account/
│   ├── page.tsx                # Root Account Dashboard
│   └── settings/
│       └── page.tsx            # Root Account Settings
└── profile/
    ├── create/
    │   └── page.tsx            # Profile Create
    ├── [username]/
    │   ├── page.tsx            # Profile Detail
    │   └── edit/
    │       └── page.tsx        # Profile Edit
```

### Components & Features

#### 1. Dummy Data (`data.ts`)
- `mockRootAccount`: Includes UUID, provider, plan, points, level, badges.
- `mockProfiles`: Array of profile objects (display_name, username, bio, role, etc.).

#### 2. Root Account Dashboard (`root-account/page.tsx`)
- Display Header with Level, Points, Badges.
- List of owned profiles.
- Link to Settings.

#### 3. Root Account Settings (`root-account/settings/page.tsx`)
- Security, Payment (mock), Data Management sections.
- **Restart (Strong New Game)** button with mock action.

#### 4. Profile Detail (`profile/[username]/page.tsx`)
- Header with Avatar, Name, Level Badge.
- Tabs: Overview, Works, Values, Skills, Mandala.
- Mock "Follow" and "Scout" actions.

#### 5. Profile Create (`profile/create/page.tsx`)
- Form for Basic Info (Name, ID, Bio) and Attributes (Role, Purpose, Type).
- "Create" button that mocks a server action and redirects.

#### 6. Profile Edit (`profile/[username]/edit/page.tsx`)
- Form pre-filled with mock data.
- "Save" button that mocks an update.

## Verification Plan

### Manual Verification
1.  Navigate to `/playground/account-demos`.
2.  Click through each demo link.
3.  **Root Account:** Verify Level/Points display and Profile list.
4.  **Settings:** Click "Restart" and verify mock alert/toast.
5.  **Profile Detail:** Check tabs and badge display.
6.  **Profile Create:** Fill form and click Create (verify mock success).
7.  **Profile Edit:** Verify pre-filled data and Save action.

### Automated Tests
- None for these playground demos (they are for UI verification).
