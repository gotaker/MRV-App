# MRV App – Development Environment

This is the **local development environment** for the MRV GHG Inventory application.  
It is designed to run entirely in Docker for rapid local iteration, with an architecture that mirrors AWS production.

---

## Services

| Service         | Purpose                                     | Local URL |
|-----------------|---------------------------------------------|-----------|
| **api**         | NestJS backend API                          | http://localhost:3000 |
| **web**         | Angular frontend (placeholder in dev)       | http://localhost:4200 |
| **mongo**       | MongoDB database                            | n/a |
| **mongo-express** | MongoDB admin UI                         | http://localhost:8081 |
| **minio**       | S3-compatible object storage (file uploads) | http://localhost:9001 (console) / http://localhost:9000 (API) |
| **mailhog**     | Email testing SMTP/Web UI                    | http://localhost:8025 |

---

## Quick Start

```bash
# 1. Clone this repo
git clone <your-repo-url>
cd dev-env

# 2. Start the stack
docker compose up --build

# 3. Verify health endpoints
curl http://localhost:3000/healthz
curl http://localhost:3000/readyz
```

The `api` and `web` containers mount local code for hot-reload development.

---

## Seeding Data

- Place `.js` init scripts or a `dump/` directory in `./seeds/mongo/`.
- BSON dumps from the legacy app can be converted to `mongodump` layout.

Example seed script location:
```
seeds/mongo/001-init.js
```

To manually restore a dump:
```bash
docker exec -it mrv-mongo bash
mongorestore -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin /docker-entrypoint-initdb.d/dump
```

---

## Development Workflow

### API (NestJS)
- Located in `apps/api`.
- Start in dev mode:
```bash
docker compose exec api npm run start:dev
```

### Web (Angular placeholder)
- Located in `apps/web` (replace with Angular app).
- Start in dev mode:
```bash
docker compose exec web npm run start
```

---

## Porting to AWS

When ready for production:
1. Replace MinIO with AWS S3.
2. Move secrets from `.env` to AWS Secrets Manager / SSM Parameter Store.
3. Deploy containers to ECS Fargate (or EKS) with Terraform (`infra/` directory).
4. Use RDS/Aurora or DocumentDB for the database.
5. Serve frontend via CloudFront + S3 static site hosting.

The **Docker images from this dev environment** are production-ready with minimal change.

---

## Health Checks

- API: `/healthz` and `/readyz`
- Mongo: ping via `mongosh` in container
- MinIO: console reachable, bucket auto-created
- Mailhog: UI reachable

---

## Next Steps

- [ ] Implement Auth & Users module in API.
- [ ] Replace frontend placeholder with Angular 18 app.
- [ ] Import and map BSON datasets for emission factors and reference data.
- [ ] Add Terraform IaC for AWS production deployment.

