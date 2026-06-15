# EquipRent System Architecture

This document describes the high-level architecture and workflows of the EquipRent platform.

## 1. High-Level Architecture

The platform is built using a modern, scalable microservice-like architecture orchestrated by Docker Compose. It consists of the following core components:

- **Nginx (Reverse Proxy)**: Routes incoming traffic to the appropriate container based on the URL path.
- **Storefront (Next.js)**: The public-facing e-commerce application for customers.
- **Admin Panel (Next.js)**: The private dashboard for managing equipment, orders, and settings.
- **Backend API (Express.js)**: The central business logic layer serving both frontends.
- **Database (PostgreSQL)**: The persistent storage layer accessed via Prisma ORM.

```mermaid
graph TD
    Client((User Browser))

    subnginx[Nginx Reverse Proxy]
    
    substorefront[Storefront Container\nNext.js: 3000]
    subadmin[Admin Container\nNext.js: 3000]
    subbackend[Backend Container\nExpress: 3001]
    
    subdb[(PostgreSQL\nDatabase: 5432)]

    Client -->|http://domain/| subnginx
    Client -->|http://domain/wp/admin| subnginx
    Client -->|http://domain/api| subnginx

    subnginx -->|Location: /| substorefront
    subnginx -->|Location: /wp/admin| subadmin
    subnginx -->|Location: /api| subbackend
    subnginx -->|Location: /uploads| subbackend

    substorefront -->|Internal fetch| subbackend
    subadmin -->|Internal fetch| subbackend

    subbackend -->|Prisma ORM| subdb
```

## 2. Dynamic Settings Workflow (Example: Footer)

To demonstrate how data flows through the system, here is the sequence of events when the Admin changes the dynamic footer text:

```mermaid
sequenceDiagram
    actor Admin
    participant AdminUI as Admin Panel
    participant Nginx
    participant API as Backend (Express)
    participant DB as PostgreSQL
    participant Storefront as Public Site
    actor Customer

    Admin->>AdminUI: Updates Footer Text & Clicks Save
    AdminUI->>Nginx: PUT /api/settings (with JWT)
    Nginx->>API: Forwards request to Backend
    API->>API: Validates Admin Role
    API->>DB: prisma.setting.upsert()
    DB-->>API: Success
    API-->>AdminUI: 200 OK

    Note over Storefront,API: Next.js ISR triggers every 60 seconds
    Customer->>Storefront: Visits Homepage
    Storefront->>API: GET /api/settings
    API->>DB: Fetch settings
    DB-->>API: Returns new footerText
    API-->>Storefront: Returns JSON
    Storefront-->>Customer: Renders page with new footer
```

## 3. Data Schema Overview

The core data models managed by Prisma:

- **User**: Customers and Admins. Stores credentials, contact info, and role.
- **Item & Category**: The catalog of rental equipment.
- **Rental**: Transactions linking a User to an Item for a specific date range.
- **Review**: Customer feedback on items.
- **Setting**: Key-value pairs for global application configuration (e.g., currency, footer text).

```mermaid
erDiagram
    USER ||--o{ RENTAL : makes
    USER ||--o{ REVIEW : writes
    CATEGORY ||--o{ ITEM : contains
    ITEM ||--o{ RENTAL : booked_in
    ITEM ||--o{ REVIEW : receives
    DISCOUNT |o--o{ RENTAL : applied_to

    USER {
        int id
        string role
        string email
    }
    ITEM {
        int id
        float pricePerDay
        string name
    }
    RENTAL {
        int id
        date startDate
        date endDate
        string status
    }
```
