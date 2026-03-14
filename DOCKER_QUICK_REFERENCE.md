# Docker Quick Reference Card

## One-Line Commands

### Build & Deploy

```bash
# Build all images
docker compose build --no-cache

# Start all services
docker compose up -d

# Rebuild and restart
docker compose down && docker compose build --no-cache && docker compose up -d
```

### Monitoring

```bash
# View all containers
docker compose ps

# View service logs (follow)
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f postgres
docker compose logs -f frontend
```

### Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Seed database
docker compose exec backend npm run seed

# Connect to PostgreSQL
docker compose exec postgres psql -U rutick_user -d rutick
```

### Maintenance

```bash
# Stop all services
docker compose stop

# Restart all services
docker compose restart

# Remove containers (keep data)
docker compose down

# Full cleanup (remove everything)
docker compose down -v

# View resource usage
docker stats
```

---

## Common Issues Quick Fixes

| Issue                       | Command                                                                    |
| --------------------------- | -------------------------------------------------------------------------- |
| Port already in use         | `lsof -i :5000` (macOS/Linux) or `netstat -ano \| findstr :5000` (Windows) |
| PostgreSQL won't start      | `docker compose logs postgres`                                             |
| Backend can't connect to DB | `docker compose ps` + check network                                        |
| Rebuild from scratch        | `docker compose down -v && docker compose build --no-cache`                |
| View all environment vars   | `docker compose config`                                                    |

---

## Validation

```bash
# Validate configuration
node docker-config-validator.js

# Should output: ✅ CONFIGURATION VALIDATED - Ready for Docker deployment
```

---

## Environment Override

Pass environment variables without modifying .env:

```bash
export DB_PASSWORD=new_password
docker compose up -d backend
```

---

## Useful Docker Commands

```bash
# List all images
docker images

# View image layers
docker history rutick-backend

# Remove unused images/containers
docker system prune

# Check logs with timestamps
docker compose logs --timestamps

# Get container IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' rutick-backend
```

---

## PostgreSQL Commands

Inside `docker compose exec postgres psql -U rutick_user -d rutick`:

```sql
-- List tables
\dt

-- Describe table
\d "users"

-- Count rows
SELECT COUNT(*) FROM "users";

-- View recent data
SELECT email, role, "createdAt" FROM "users" ORDER BY "createdAt" DESC LIMIT 10;

-- Backup database
\! pg_dump -U rutick_user rutick > backup.sql

-- Exit
\q
```

---

## Performance Tips

1. **Reduce image size:**

   ```bash
   docker images | grep rutick
   # Look for oversized images, optimize Dockerfile
   ```

2. **Enable BuildKit (faster builds):**

   ```bash
   export DOCKER_BUILDKIT=1
   docker compose build --no-cache
   ```

3. **Reduce startup time:**
   - Adjust healthcheck intervals in docker-compose.yml
   - Pre-build images instead of building on-the-fly

4. **Memory optimization:**
   - Monitor with: `docker stats`
   - Adjust compose resource limits if needed

---

## Debugging

```bash
# Attach to running container
docker compose exec backend bash
# Then run: npm run dev (for dev mode)

# View container details
docker inspect rutick-backend

# Check network connectivity
docker compose exec backend ping postgres

# View environment inside container
docker compose exec backend env | grep DB_
```

---

**For detailed guide, see:** [DOCKER_TESTING_GUIDE.md](DOCKER_TESTING_GUIDE.md)
