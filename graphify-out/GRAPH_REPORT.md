# Graph Report - MedAi  (2026-06-08)

## Corpus Check
- 33 files · ~21,154 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 265 nodes · 407 edges · 16 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02c31f0f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `dependencies` - 24 edges
2. `useAuth()` - 19 edges
3. `devDependencies` - 16 edges
4. `dependencies` - 12 edges
5. `scripts` - 7 edges
6. `Dashboard()` - 7 edges
7. `getReport()` - 7 edges
8. `SAHI AI Health Translator` - 7 edges
9. `getFamilyMembers()` - 6 edges
10. `OpenAI to Gemini Migration Report` - 6 edges

## Surprising Connections (you probably didn't know these)
- `SAHI AI Health Translator` --implements--> `Root Element`  [INFERRED]
  README.md → client/index.html
- `React + Vite Template` --conceptually_related_to--> `Vite`  [INFERRED]
  client/README.md → README.md
- `ParameterTooltip()` --calls--> `getStatusColor()`  [INFERRED]
  client/src/components/ParameterTooltip.jsx → client/src/pages/ReportView.jsx
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  C:/Users/mayan/Documents/Hackton Japan/client/src/App.jsx → C:/Users/mayan/Documents/Hackton Japan/client/src/context/AuthContext.jsx
- `Layout()` --calls--> `useAuth()`  [EXTRACTED]
  C:/Users/mayan/Documents/Hackton Japan/client/src/components/Layout.jsx → C:/Users/mayan/Documents/Hackton Japan/client/src/context/AuthContext.jsx

## Communities (16 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (31): LandingPage(), Layout(), AuthContext, AuthProvider(), useAuth(), Auth(), Dashboard(), Family() (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (24): dependencies, axios, @floating-ui/dom, @floating-ui/react, framer-motion, lucide-react, react, react-dom (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (29): jwt, protect(), User, bcrypt, mongoose, userSchema, express, generateToken() (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (21): name, private, scripts, build, dev, lint, preview, type (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (24): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+16 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (31): 1. Clone the Repository, 2. Install Backend Dependencies, 3. Install Frontend Dependencies, API Endpoints Overview, Architecture Overview, Authentication (`/api/auth`), Author, Backend (+23 more)

### Community 6 - "Community 6"
Cohesion: 0.23
Nodes (8): ParameterTooltip(), TRANSLATIONS, LabValueRow(), ReportCard(), statusConfig, getOverallBadge(), getStatusColor(), ReportView()

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (19): 1. Migration Summary, 2. Modified Files, 3. Environment Variable Changes, 4. Installation Commands, 5. Complete Code for Modified Files, 6. Testing Checklist, 7. Verification Steps, Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-1.5-flash, etc. (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.16
Nodes (11): connectDB(), mongoose, labValueSchema, mongoose, reportSchema, allowedOrigins, app, connectDB (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.36
Nodes (6): fileFilter(), multer, path, storage, upload, upload

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (4): 1. Resolution Summary, 2. Modified Files, 3. Verification Checklist, Medical Parameter Tooltip Fix

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **110 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 1` to `Community 2`, `Community 11`, `Community 10`, `Community 3`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **Why does `express` connect `Community 2` to `Community 1`, `Community 10`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 4` to `Community 3`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _110 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._