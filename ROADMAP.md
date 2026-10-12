# MULTI-TENANT SAAS ROADMAP (PHASES 0–8)

**Product:** Configurable Multi-Tenant CRM & Operating System  
**Pilot Flagship:** Elite Tech Auto Detailing (Miami, FL · https://elitedetail.miami)  
**Methodology:** Phased, gated development with external code review milestones.

---

## Roadmap Overview

```
Phase 0 (Authorized Now) ──► Phase 1 (Foundation) ──► Phase 2 (Configurable CRM) ──► Phase 3 (Operations)
  [Visual Prototype]         [RLS & Tenant DB]         [Custom Fields & Form]       [Bay Scheduling]
                                                                                           │
Phase 8 (Production)    ◄── Phase 7 (Commercial)  ◄── Phase 6 (Arturo AI)    ◄── Phase 5 / 4 (Payments)
```

---

### Phase 0: AI Studio Visual Build and Interactive Prototype
- **Status:** **COMPLETED / AWAITING USER REVIEW**
- **Goals:**
  - Build responsive, professional, anti-slop CRM application shell in Google AI Studio.
  - Implement full navigation connecting Dashboard, Customers, Appointments, Service Catalog, Work Orders, Financials, Modules, and Settings.
  - Populate with authoritative Elite Tech catalog (Section 12) and Miami pilot data.
  - Clearly distinguish working prototype interactions from unverified backend claims.
  - Maintain `STATE.md` and `ROADMAP.md`.
- **Deliverables:** Complete React 19 SPA, zero dead clicks, verified build.
- **Acceptance Criteria Met:** Navigable interface previewable in AI Studio; demo data honestly labeled; zero destructive DB changes.

---

### Phase 1: Secure Multi-Tenant Foundation
- **Status:** Planned (Requires User Approval after Visual Review)
- **Goals:**
  - Establish organization-scoped relational schema in Supabase / PostgreSQL.
  - Configure Supabase Auth with organization memberships and role claims.
  - Author and enforce PostgreSQL Row Level Security (RLS) policies.
  - Write tenant-isolation test suite: verify that User in Org A cannot query or mutate records of Org B, including via manipulated IDs or query params.
- **Key Entities:** `organizations`, `users`, `organization_memberships`, `audit_logs`.
- **Risks:** Leaky RLS policies or reliance on client-side filtering.
- **Gate:** Automated multi-tenant penetration tests pass before proceeding.

---

### Phase 2: Configurable CRM & Dynamic Catalog
- **Status:** Planned
- **Goals:**
  - Relational tables for `customers`, `services`, `service_tiers`, `add_ons`.
  - Typed custom field storage (combining structured relational tables and validated JSONB).
  - Organization-specific business hours, branding, and contact details.
  - Full-text search and server-side filtering.
  - Soft-delete and historical record archival protection.
- **Key Deliverables:** Dynamic form renderer, catalog price editor, vehicle specification schema.

---

### Phase 3: Scheduling, Dispatch & Operations
- **Status:** Planned
- **Goals:**
  - Appointment booking engine with duration calculation and bay/technician availability.
  - Mobile detailing routing and dispatch management.
  - Job and Work Order pipeline with inspection checklists and sign-offs.
  - Mobile technician responsive interface for shop bay tablets.
  - Safeguard: Core scheduling operates normally even when external calendars or notification services are offline.

---

### Phase 4: Financial Workflows & Payments
- **Status:** Planned
- **Goals:**
  - Relational `invoices`, `estimates`, and `payment_transactions`.
  - Secure integration boundaries for Square (terminal & POS) and Stripe Connect (future multi-tenant SaaS billing).
  - Strict security: Zero raw credit card storage; webhooks verified with cryptographic signatures and idempotency keys.
  - Local tax engine (e.g., Miami-Dade County 7.0% sales tax calculation).

---

### Phase 5: Integrations, Webhooks & Automation
- **Status:** Planned
- **Goals:**
  - Outbox pattern for reliable event publishing.
  - Webhook delivery pipeline with exponential backoff, bounded retries, and delivery logging.
  - Twilio SMS notifications for appointment confirmations and service completion alerts.
  - Automation triggers (e.g., Customer created -> check required custom field -> create follow-up task).
  - Circuit breakers ensuring core CRM continues functioning if external webhooks fail.

---

### Phase 6: Arturo AI Copilot
- **Status:** Planned
- **Goals:**
  - Grounded AI assistant using modern `@google/genai` TypeScript SDK (Gemini 2.5 Flash).
  - Server-side tool calling with authenticated user organization context injected into prompts.
  - Strict tenant boundary: Arturo is architecturally blocked from querying cross-tenant records.
  - Capabilities: Customer service briefings, quote assistance, operational troubleshooting.
  - Confirmation requirement: Explicit user consent before executing sensitive actions (sending customer SMS, refunding invoices, altering catalog prices).
  - Draft-and-Approval AI Menu Import: Extract draft catalog from images/PDFs with mandatory manual owner sign-off.

---

### Phase 7: SaaS Commercialization & Multi-Organization Onboarding
- **Status:** Planned
- **Goals:**
  - Organization self-onboarding wizard.
  - Subscription tiers, feature entitlements, and quota enforcement.
  - Global administrative console for platform health monitoring.
  - Multi-industry presets (Auto Detailing, Nail Salons, Cleaning Services).

---

### Phase 8: Production Hardening & Deployment
- **Status:** Planned
- **Goals:**
  - Comprehensive security penetration testing and RLS policy verification.
  - End-to-end regression testing.
  - Performance, accessibility (WCAG AA), and lighthouse optimization.
  - Backup, point-in-time recovery, and disaster recovery procedures.
  - Production deployment to https://elitedetail.miami and custom domain routing.
