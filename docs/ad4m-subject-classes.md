# Paperclip AD4M Subject Classes

## Overview
This document defines the AD4M Subject Classes for porting Paperclip to AD4M.
Each PostgreSQL table becomes an AD4M Subject Class with SHACL properties.

---

## Company (Neighbourhood-level)

In AD4M, each Paperclip "Company" becomes a **Neighbourhood** (shared P2P space).
Company metadata is stored as properties on the neighbourhood's perspective.

```json
{
  "target_class": "paperclip://Company",
  "properties": [
    {
      "path": "paperclip://name",
      "name": "name",
      "datatype": "xsd:string",
      "min_count": 1,
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://description",
      "name": "description",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://status",
      "name": "status",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://issuePrefix",
      "name": "issuePrefix",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://budgetMonthlyCents",
      "name": "budgetMonthlyCents",
      "datatype": "xsd:integer",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://spentMonthlyCents",
      "name": "spentMonthlyCents",
      "datatype": "xsd:integer",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://requireBoardApproval",
      "name": "requireBoardApproval",
      "datatype": "xsd:boolean",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://brandColor",
      "name": "brandColor",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    }
  ],
  "constructor": [
    { "action": "addLink", "source": "this", "predicate": "rdf://type", "target": "paperclip://Company" },
    { "action": "setSingleTarget", "source": "this", "predicate": "paperclip://name", "target": "name" },
    { "action": "setSingleTarget", "source": "this", "predicate": "paperclip://status", "target": "status" }
  ]
}
```

---

## Agent

```json
{
  "target_class": "paperclip://Agent",
  "properties": [
    {
      "path": "paperclip://name",
      "name": "name",
      "datatype": "xsd:string",
      "min_count": 1,
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://role",
      "name": "role",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://title",
      "name": "title",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://icon",
      "name": "icon",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://status",
      "name": "status",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://capabilities",
      "name": "capabilities",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://adapterType",
      "name": "adapterType",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://adapterConfig",
      "name": "adapterConfig",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://runtimeConfig",
      "name": "runtimeConfig",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://budgetMonthlyCents",
      "name": "budgetMonthlyCents",
      "datatype": "xsd:integer",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://spentMonthlyCents",
      "name": "spentMonthlyCents",
      "datatype": "xsd:integer",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://permissions",
      "name": "permissions",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://lastHeartbeatAt",
      "name": "lastHeartbeatAt",
      "datatype": "xsd:dateTime",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://metadata",
      "name": "metadata",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    }
  ],
  "constructor": [
    { "action": "addLink", "source": "this", "predicate": "rdf://type", "target": "paperclip://Agent" },
    { "action": "setSingleTarget", "source": "this", "predicate": "paperclip://name", "target": "name" },
    { "action": "setSingleTarget", "source": "this", "predicate": "paperclip://role", "target": "role" }
  ]
}
```

**Relationships:**
- `paperclip://reportsTo` → Link to parent Agent (org chart)
- `paperclip://memberOf` → Link to Company

---

## Goal

```json
{
  "target_class": "paperclip://Goal",
  "properties": [
    {
      "path": "paperclip://title",
      "name": "title",
      "datatype": "xsd:string",
      "min_count": 1,
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://description",
      "name": "description",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://level",
      "name": "level",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://status",
      "name": "status",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    }
  ],
  "constructor": [
    { "action": "addLink", "source": "this", "predicate": "rdf://type", "target": "paperclip://Goal" },
    { "action": "setSingleTarget", "source": "this", "predicate": "paperclip://title", "target": "title" },
    { "action": "setSingleTarget", "source": "this", "predicate": "paperclip://level", "target": "level" }
  ]
}
```

**Relationships:**
- `paperclip://parentGoal` → Link to parent Goal (hierarchy)
- `paperclip://ownedBy` → Link to Agent (owner)
- `paperclip://belongsTo` → Link to Company

---

## Project

```json
{
  "target_class": "paperclip://Project",
  "properties": [
    {
      "path": "paperclip://name",
      "name": "name",
      "datatype": "xsd:string",
      "min_count": 1,
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://description",
      "name": "description",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://status",
      "name": "status",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://targetDate",
      "name": "targetDate",
      "datatype": "xsd:date",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    }
  ],
  "constructor": [
    { "action": "addLink", "source": "this", "predicate": "rdf://type", "target": "paperclip://Project" },
    { "action": "setSingleTarget", "source": "this", "predicate": "paperclip://name", "target": "name" }
  ]
}
```

**Relationships:**
- `paperclip://forGoal` → Link to Goal
- `paperclip://ledBy` → Link to Agent (lead)
- `paperclip://belongsTo` → Link to Company

---

## Issue (Task)

```json
{
  "target_class": "paperclip://Issue",
  "properties": [
    {
      "path": "paperclip://title",
      "name": "title",
      "datatype": "xsd:string",
      "min_count": 1,
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://description",
      "name": "description",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://status",
      "name": "status",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://priority",
      "name": "priority",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://issueNumber",
      "name": "issueNumber",
      "datatype": "xsd:integer",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://identifier",
      "name": "identifier",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://billingCode",
      "name": "billingCode",
      "datatype": "xsd:string",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://startedAt",
      "name": "startedAt",
      "datatype": "xsd:dateTime",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    },
    {
      "path": "paperclip://completedAt",
      "name": "completedAt",
      "datatype": "xsd:dateTime",
      "max_count": 1,
      "writable": true,
      "resolve_language": "literal"
    }
  ],
  "constructor": [
    { "action": "addLink", "source": "this", "predicate": "rdf://type", "target": "paperclip://Issue" },
    { "action": "setSingleTarget", "source": "this", "predicate": "paperclip://title", "target": "title" }
  ]
}
```

**Relationships:**
- `paperclip://parentIssue` → Link to parent Issue (subtasks)
- `paperclip://assignedTo` → Link to Agent
- `paperclip://forProject` → Link to Project
- `paperclip://forGoal` → Link to Goal
- `paperclip://belongsTo` → Link to Company

---

## Implementation Notes

### 1. Company = Neighbourhood
Each Paperclip Company becomes an AD4M Neighbourhood. The Company subject exists as the "root" of the neighbourhood's perspective.

### 2. Org Chart = Links
The `reportsTo` relationship becomes a simple link:
```
AgentA --paperclip://reportsTo--> AgentB
```

### 3. Activity Log = Native AD4M
Paperclip's `activity_log` table becomes unnecessary — AD4M links are immutable and timestamped by design.

### 4. Queries
Use Prolog for complex queries like:
- "All agents reporting to CEO"
- "All issues for a project"
- "Goal hierarchy"

### 5. ADAM Model API
Use the new ADAM Model API (Ad4mModel class) for:
- CRUD operations
- Relations/eager loading
- Subscriptions

---

## Next Steps

1. Create AD4M service layer in Paperclip
2. Replace Drizzle queries with AD4M Model queries
3. Add ADAM Connect for neighbourhood sync
4. Test with local AD4M executor
