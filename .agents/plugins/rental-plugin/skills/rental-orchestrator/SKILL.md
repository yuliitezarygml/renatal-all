---
name: rental-orchestrator
description: "Оркестрирует работу агентов backend-dev, frontend-dev и qa-tester для создания и развития сервиса аренды. Запустите этот навык, если нужно разработать новый функционал (например: 'создай проект', 'сделай каталог', 'настрой базу данных', 'обнови логику скидок')."
---

# Rental Orchestrator Skill

This skill coordinates the multi-agent workflow for the Rental Service project (Next.js, Express.js, PostgreSQL, Telegram Bot).

## Execution Mode
**Subagent Pattern**: The main agent (orchestrator) sequentially delegates work to `backend-dev`, `frontend-dev`, and `qa-tester` using `invoke_subagent`. Data and artifacts are passed through the file system in the `_workspace/` directory.

## Workflow

### Phase 0: Context Check
1. Check if the `_workspace/` directory exists.
2. If previous artifacts exist, analyze them to determine if this is a **partial rerun** (e.g., user asked to fix the frontend) or a **new build**.
3. Create or clear `_workspace/` if starting fresh.

### Phase 1: Backend Development
1. Invoke the `backend-dev` subagent.
2. **Prompt**: "Initialize or update the project backend. Create/Update the database schema in Prisma, build the Express.js API routes, and implement the Telegram bot logic according to the project plan. Write your outputs and API spec to `_workspace/01_backend_spec.md`."
3. Wait for the subagent to report completion.

### Phase 2: Frontend Development
1. Invoke the `frontend-dev` subagent.
2. **Prompt**: "Read the API specification from `_workspace/01_backend_spec.md`. Build or update the Next.js Admin panel pages and connect them to the backend API. Write your component list and UI notes to `_workspace/02_frontend_spec.md`."
3. Wait for the subagent to report completion.

### Phase 3: QA & Validation
1. Invoke the `qa-tester` subagent.
2. **Prompt**: "Review the code created by backend-dev and frontend-dev. Verify that the API contracts match between frontend and backend. Check the logic for date overlapping in rentals and ensure the Telegram Bot flows are logical. Write your findings to `_workspace/03_qa_report.md`."
3. If the QA report identifies critical errors, invoke the responsible agent (backend or frontend) to fix the issues (Maximum 1 retry).

## Error Handling
- If a subagent reports a clear error (e.g., compile error, port in use), re-invoke it with the error log and ask for a fix.
- If a subagent fails twice consecutively, halt orchestration and ask the user for manual intervention.
