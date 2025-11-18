#!/bin/bash

set -e

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "💾 Creating backup..."

# Backup database
docker exec buildgenie-db pg_dump -U buildgenie_user buildgenie > "$BACKUP_DIR/database.sql"

# Backup environment files
cp .env "$BACKUP_DIR/"

# Backup nginx configuration
cp -r nginx "$BACKUP_DIR/"

echo "✅ Backup created: $BACKUP_DIR"