# Architecture Diagrams

This document shows the **Dev (Docker Compose)** and **Prod** topologies for the MRV app, using Mermaid.

## Dev (Docker Compose)

```mermaid
flowchart LR
  subgraph Dev_Machine[Developer Machine]
    Browser[Browser\nhttp(s)://localhost]
    subgraph Docker_Network[Docker network]
      subgraph WebSvc[mrv-web (Angular dev)]
        Web[ng serve\nNode 22\nPort 4200]
        Vol1[(Bind mount: repo src)]
        Vol2[(certs/: dev-cert.pem, dev-key.pem)]
      end
      subgraph MockAPI[mrv-mock-api]
        JS[json-server\nPort 80 → Host 3000\nmock/db.json]
      end
      subgraph E2E[mrv-e2e (Cypress)]
        Cy[Cypress 13\nNode 22\nwait-on tcp:web:4200]
      end
    end
  end

  Browser <-->|HTTP 4200 / HTTPS 443→4200| Web
  Web -->|GET /kpis\nAPI_BASE_URL= http://mock-api| JS
  Cy -->|baseUrl=http(s)://web:4200| Web
  Cy -->|stubs/fixtures as needed| JS

  Vol1 --- Web
  Vol2 --- Web

  classDef svc fill:#eef7ff,stroke:#268bd2,stroke-width:1px
  classDef infra fill:#f6f6f6,stroke:#999,stroke-width:1px,stroke-dasharray: 3 2
  class Web,JS,Cy svc
  class Dev_Machine,Docker_Network,WebSvc,MockAPI,E2E infra
```

## Prod (S3 + CloudFront + ACM)

```mermaid
flowchart LR
  User[End User Browser] -->|HTTPS\nTLS via ACM| CF[CloudFront\nHSTS + Redirect HTTP→HTTPS]
  CF -->|Private access via OAC| S3[S3 Static Website Bucket\n(index.html, assets/*)]
  User -.->|XHR/Fetch at runtime\nAPI_BASE_URL| API[MRV API (external)]

  subgraph CI_CD[CI/CD: GitHub Actions]
    Build[ng build --configuration=production]
    Sync[aws s3 sync dist/ → s3://bucket]
    Inval[cloudfront CreateInvalidation]
    Img[Build & push images to GHCR\nmrv-web, mrv-e2e (versioned)]
  end

  Build --> Sync --> Inval
  Build --> Img

  classDef svc fill:#eef7ff,stroke:#268bd2
  classDef infra fill:#f6f6f6,stroke:#999,stroke-dasharray:3 2
  class CF,S3 svc
  class CI_CD infra
```

## Prod (Alternative: Containerized Nginx TLS)

```mermaid
flowchart LR
  User[End User Browser] -->|HTTPS| Nginx[Nginx container\nTLS termination\nnginx-ssl.conf]
  Nginx --> Files[/usr/share/nginx/html\n(index.html, assets/*)]
  User -.->|XHR/Fetch at runtime\nAPI_BASE_URL| API[MRV API (external)]

  subgraph CI[CI/CD]
    ImgWeb[Build mrv-web image\n(static files baked or mounted)]
    ImgE2E[Build mrv-e2e image]
    Deploy[Deploy via ECS/K8s/VM]
  end

  ImgWeb --> Deploy
  ImgE2E --> Deploy
```
