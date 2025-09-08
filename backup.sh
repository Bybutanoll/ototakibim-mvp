#!/bin/bash

# OtoTakibim Backup Script
# This script creates backups of the database and application data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="/backups/ototakibim"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="ototakibim_backup_$DATE"
RETENTION_DAYS=30

# Database configuration
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_DB="ototakibim_prod"
MONGO_USER="${MONGO_ROOT_USERNAME}"
MONGO_PASS="${MONGO_ROOT_PASSWORD}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
create_backup_dir() {
    log_info "Creating backup directory..."
    mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
    log_success "Backup directory created: $BACKUP_DIR/$BACKUP_NAME"
}

# Backup MongoDB
backup_mongodb() {
    log_info "Starting MongoDB backup..."
    
    if command -v mongodump &> /dev/null; then
        mongodump \
            --host "$MONGO_HOST:$MONGO_PORT" \
            --db "$MONGO_DB" \
            --username "$MONGO_USER" \
            --password "$MONGO_PASS" \
            --authenticationDatabase admin \
            --out "$BACKUP_DIR/$BACKUP_NAME/mongodb"
        
        log_success "MongoDB backup completed."
    else
        log_error "mongodump not found. Please install MongoDB tools."
        exit 1
    fi
}

# Backup Redis
backup_redis() {
    log_info "Starting Redis backup..."
    
    if command -v redis-cli &> /dev/null; then
        redis-cli --rdb "$BACKUP_DIR/$BACKUP_NAME/redis.rdb"
        log_success "Redis backup completed."
    else
        log_warning "redis-cli not found. Skipping Redis backup."
    fi
}

# Backup application files
backup_app_files() {
    log_info "Starting application files backup..."
    
    # Backup uploads directory
    if [ -d "./backend/uploads" ]; then
        cp -r "./backend/uploads" "$BACKUP_DIR/$BACKUP_NAME/uploads"
        log_success "Uploads directory backed up."
    fi
    
    # Backup configuration files
    if [ -f "./docker-compose.production.yml" ]; then
        cp "./docker-compose.production.yml" "$BACKUP_DIR/$BACKUP_NAME/"
    fi
    
    if [ -f "./nginx.production.conf" ]; then
        cp "./nginx.production.conf" "$BACKUP_DIR/$BACKUP_NAME/"
    fi
    
    # Backup environment files (without sensitive data)
    if [ -f "./backend/env.production.example" ]; then
        cp "./backend/env.production.example" "$BACKUP_DIR/$BACKUP_NAME/backend_env.example"
    fi
    
    if [ -f "./frontend/env.production.example" ]; then
        cp "./frontend/env.production.example" "$BACKUP_DIR/$BACKUP_NAME/frontend_env.example"
    fi
    
    log_success "Application files backup completed."
}

# Backup logs
backup_logs() {
    log_info "Starting logs backup..."
    
    # Create logs directory
    mkdir -p "$BACKUP_DIR/$BACKUP_NAME/logs"
    
    # Backup Docker logs
    if command -v docker &> /dev/null; then
        docker logs ototakibim-backend > "$BACKUP_DIR/$BACKUP_NAME/logs/backend.log" 2>&1 || true
        docker logs ototakibim-frontend > "$BACKUP_DIR/$BACKUP_NAME/logs/frontend.log" 2>&1 || true
        docker logs ototakibim-nginx > "$BACKUP_DIR/$BACKUP_NAME/logs/nginx.log" 2>&1 || true
        docker logs ototakibim-mongodb > "$BACKUP_DIR/$BACKUP_NAME/logs/mongodb.log" 2>&1 || true
        docker logs ototakibim-redis > "$BACKUP_DIR/$BACKUP_NAME/logs/redis.log" 2>&1 || true
    fi
    
    # Backup system logs
    if [ -d "/var/log/nginx" ]; then
        cp -r /var/log/nginx "$BACKUP_DIR/$BACKUP_NAME/logs/nginx_system" 2>/dev/null || true
    fi
    
    log_success "Logs backup completed."
}

# Create backup archive
create_archive() {
    log_info "Creating backup archive..."
    
    cd "$BACKUP_DIR"
    tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"
    
    # Remove uncompressed directory
    rm -rf "$BACKUP_NAME"
    
    log_success "Backup archive created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
}

# Upload to cloud storage (optional)
upload_to_cloud() {
    if [ -n "$AWS_S3_BUCKET" ] && command -v aws &> /dev/null; then
        log_info "Uploading backup to S3..."
        aws s3 cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" "s3://$AWS_S3_BUCKET/backups/"
        log_success "Backup uploaded to S3."
    elif [ -n "$GOOGLE_CLOUD_BUCKET" ] && command -v gsutil &> /dev/null; then
        log_info "Uploading backup to Google Cloud..."
        gsutil cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" "gs://$GOOGLE_CLOUD_BUCKET/backups/"
        log_success "Backup uploaded to Google Cloud."
    else
        log_info "Cloud storage not configured or tools not available."
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups..."
    
    # Remove backups older than retention period
    find "$BACKUP_DIR" -name "ototakibim_backup_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    # Count remaining backups
    BACKUP_COUNT=$(find "$BACKUP_DIR" -name "ototakibim_backup_*.tar.gz" -type f | wc -l)
    
    log_success "Cleanup completed. $BACKUP_COUNT backups remaining."
}

# Verify backup
verify_backup() {
    log_info "Verifying backup..."
    
    if [ -f "$BACKUP_DIR/$BACKUP_NAME.tar.gz" ]; then
        BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME.tar.gz" | cut -f1)
        log_success "Backup verified. Size: $BACKUP_SIZE"
        
        # Test archive integrity
        if tar -tzf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" > /dev/null 2>&1; then
            log_success "Backup archive integrity verified."
        else
            log_error "Backup archive is corrupted!"
            exit 1
        fi
    else
        log_error "Backup file not found!"
        exit 1
    fi
}

# Send notification (optional)
send_notification() {
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        log_info "Sending Slack notification..."
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"✅ OtoTakibim backup completed successfully at $(date)\"}" \
            "$SLACK_WEBHOOK_URL" || true
    elif [ -n "$DISCORD_WEBHOOK_URL" ]; then
        log_info "Sending Discord notification..."
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"content\":\"✅ OtoTakibim backup completed successfully at $(date)\"}" \
            "$DISCORD_WEBHOOK_URL" || true
    fi
}

# Main backup function
main() {
    log_info "Starting OtoTakibim backup process..."
    echo "=================================================="
    
    # Create backup directory
    create_backup_dir
    
    # Perform backups
    backup_mongodb
    backup_redis
    backup_app_files
    backup_logs
    
    # Create archive
    create_archive
    
    # Upload to cloud (optional)
    upload_to_cloud
    
    # Verify backup
    verify_backup
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Send notification
    send_notification
    
    echo "=================================================="
    log_success "OtoTakibim backup completed successfully!"
    log_info "Backup location: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "OtoTakibim Backup Script"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --mongodb-only Only backup MongoDB"
        echo "  --files-only   Only backup application files"
        echo "  --cleanup-only Only cleanup old backups"
        echo ""
        exit 0
        ;;
    --mongodb-only)
        create_backup_dir
        backup_mongodb
        create_archive
        verify_backup
        log_success "MongoDB backup completed!"
        exit 0
        ;;
    --files-only)
        create_backup_dir
        backup_app_files
        create_archive
        verify_backup
        log_success "Application files backup completed!"
        exit 0
        ;;
    --cleanup-only)
        cleanup_old_backups
        exit 0
        ;;
    *)
        main
        ;;
esac
