# Database (MySQL)

- **`schema.sql`** — base schema for new installs
- **`migrations/`** — incremental SQL (`002` … `016`), apply in filename order on existing databases

Import via phpMyAdmin or:

```bash
mysql -u root -p cws_cms < database/schema.sql
```

The Node CMS reads/writes this database from `frontend/src/server/`.
