#!/bin/bash

BACKUP_DIR="$HOME/homeos-backups"
TIMESTAMP=$(date +%Y-%m-%d)
BACKUP_FILE="$BACKUP_DIR/homeos-$TIMESTAMP.db"
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

VOLUME_PATH=$(docker volume inspect homeos_sqlite-data -f '{{ .Mountpoint }}' 2>/dev/null)

if [ -z "$VOLUME_PATH" ]; then
    echo "Error: Could not find HomeOS Docker volume"
    exit 1
fi

docker compose exec -T backend cp /app/data/homeos.db /tmp/homeos-backup.db 2>/dev/null
docker compose cp backend:/tmp/homeos-backup.db "$BACKUP_FILE" 2>/dev/null

if [ $? -eq 0 ] && [ -f "$BACKUP_FILE" ]; then
    echo "Backup saved: $BACKUP_FILE"
else
    echo "Error: Backup failed"
    exit 1
fi

find "$BACKUP_DIR" -name "homeos-*.db" -mtime +$KEEP_DAYS -delete 2>/dev/null

BACKUP_COUNT=$(find "$BACKUP_DIR" -name "homeos-*.db" | wc -l)
echo "Backups retained: $BACKUP_COUNT"