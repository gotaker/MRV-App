# MRV App – Product Requirements Document (PRD)

**Version:** 0.3  
**Date:** Aug 15, 2025  
**Owner:** gagan (PO) / Assistant (Dev)

---

## Executive Summary

This document captures the functional, non-functional, and environmental requirements for rebuilding the MRV GHG Inventory application.

We are adopting a **two-stage approach**:
1. **Local Development Environment** – runs in Docker Compose with production-like architecture.
2. **AWS Production Environment** – ECS Fargate, S3, RDS/DocumentDB, CloudFront.

---

## Development Environment (Stage 1)

### Goals
- Run full stack locally with minimal setup (`docker compose up`).
- Mirror production components with local equivalents:
  - MongoDB ↔ DocumentDB/RDS
  - MinIO ↔ S3
  - Mailhog ↔ AWS SES
- Enable hot reload for backend/frontend.

### Services
| Service         | Tech           | Purpose                        |
|-----------------|----------------|--------------------------------|
| API             | NestJS         | Backend business logic, REST API |
| Web             | Angular        | Frontend SPA                   |
| Database        | MongoDB        | Application data storage       |
| Object Storage  | MinIO          | File storage (S3 compatible)   |
| DB Admin        | Mongo Express  | Web UI for DB management       |
| SMTP Mock       | Mailhog        | Email testing                  |

---

## Production Environment (Stage 2)

### Goals
- Deploy containers from dev env directly to AWS ECS.
- Replace local mocks with AWS services:
  - MongoDB → DocumentDB or RDS
  - MinIO → S3
  - Mailhog → SES (or external SMTP)
- Add WAF, CloudFront, ACM certs for security and performance.

### Services
| Service         | AWS Equivalent |
|-----------------|----------------|
| API             | ECS Fargate    |
| Web             | S3 + CloudFront|
| Database        | RDS/DocumentDB |
| Object Storage  | S3             |
| SMTP            | SES            |
| Secrets         | Secrets Manager|

---

## Functional Requirements (FR)

1. **Auth & Users**
   - JWT auth with refresh tokens (httpOnly cookies).
   - User CRUD, roles, permissions.
2. **Factor Management**
   - CRUD + versioning for emission factors.
   - Import from BSON/CSV.
3. **Inventory Year & Sector Data**
   - Create years, enter data for Energy/IPPU/AFOLU/Waste.
   - Draft/Submitted/Approved states.
4. **Approvals**
   - Reviewer workflow with comments.
5. **Reporting**
   - By gas, by sector; CSV/PDF export.
6. **Audit Logging**
   - Immutable logs for all changes.

---

## Non-Functional Requirements (NFR)

- **Dev Parity:** Dev env mimics prod architecture.
- **Security:** Secrets not stored in code; local `.env` for dev, Secrets Manager for prod.
- **Observability:** Health endpoints, logs, metrics in both envs.
- **Performance:** Dev env sized for speed; prod env autoscaled.

---

## Milestones

| Milestone | Duration | Deliverable |
|-----------|----------|-------------|
| M0        | 1 wk     | Dev env in Docker Compose |
| M1        | 3 wks    | Auth, Users, Menus modules |
| M2        | 3 wks    | Factors & Inventory schema |
| M3        | 4 wks    | Sector data entry & workflow |
| M4        | 3 wks    | Approvals & reporting |
| M5        | 2 wks    | AWS productionization |
| M6        | 1 wk     | Hardening & release |

---

## Acceptance Criteria

- `docker compose up` runs full stack locally.
- Auth/login works end-to-end in dev env.
- Factors and inventory data CRUD functional in dev env.
- Reports generate correctly in dev env.
- AWS deployment runs same containers with minimal change.

