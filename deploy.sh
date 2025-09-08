#!/bin/bash

# OtoTakibim Production Deployment Script
# This script deploys the application to production environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ototakibim"
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"
DOCKER_COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"

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

# Check if required tools are installed
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    log_success "All requirements are met."
}

# Check if environment file exists
check_environment() {
    log_info "Checking environment configuration..."
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file $ENV_FILE not found."
        log_info "Please create $ENV_FILE with your production configuration."
        log_info "You can use env.production.example as a template."
        exit 1
    fi
    
    log_success "Environment file found."
}

# Build and test backend
build_backend() {
    log_info "Building backend..."
    
    cd "$BACKEND_DIR"
    
    # Install dependencies
    log_info "Installing backend dependencies..."
    npm ci --only=production
    
    # Run tests
    log_info "Running backend tests..."
    if npm test; then
        log_success "Backend tests passed."
    else
        log_warning "Backend tests failed, but continuing with deployment."
    fi
    
    # Build the application
    log_info "Building backend application..."
    npm run build
    
    cd ..
    log_success "Backend build completed."
}

# Build and test frontend
build_frontend() {
    log_info "Building frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    npm ci --only=production
    
    # Run tests
    log_info "Running frontend tests..."
    if npm test; then
        log_success "Frontend tests passed."
    else
        log_warning "Frontend tests failed, but continuing with deployment."
    fi
    
    # Build the application
    log_info "Building frontend application..."
    npm run build
    
    cd ..
    log_success "Frontend build completed."
}

# Build Docker images
build_docker_images() {
    log_info "Building Docker images..."
    
    # Build backend image
    log_info "Building backend Docker image..."
    docker build -f "$BACKEND_DIR/Dockerfile.production" -t "$PROJECT_NAME-backend:latest" "$BACKEND_DIR"
    
    # Build frontend image
    log_info "Building frontend Docker image..."
    docker build -f "$FRONTEND_DIR/Dockerfile.production" -t "$PROJECT_NAME-frontend:latest" "$FRONTEND_DIR"
    
    log_success "Docker images built successfully."
}

# Deploy with Docker Compose
deploy_with_docker() {
    log_info "Deploying with Docker Compose..."
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Pull latest images
    log_info "Pulling latest images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    
    # Start services
    log_info "Starting services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    check_service_health
    
    log_success "Deployment completed successfully."
}

# Check service health
check_service_health() {
    log_info "Checking service health..."
    
    # Check backend health
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        log_success "Backend is healthy."
    else
        log_error "Backend health check failed."
        exit 1
    fi
    
    # Check frontend health
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend is healthy."
    else
        log_error "Frontend health check failed."
        exit 1
    fi
    
    # Check nginx health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "Nginx is healthy."
    else
        log_error "Nginx health check failed."
        exit 1
    fi
}

# Run post-deployment tests
run_post_deployment_tests() {
    log_info "Running post-deployment tests..."
    
    # Test API endpoints
    log_info "Testing API endpoints..."
    if node test-system.js; then
        log_success "Post-deployment tests passed."
    else
        log_warning "Post-deployment tests failed, but deployment is complete."
    fi
}

# Cleanup old images
cleanup() {
    log_info "Cleaning up old Docker images..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove old project images
    docker images | grep "$PROJECT_NAME" | grep -v "latest" | awk '{print $3}' | xargs -r docker rmi
    
    log_success "Cleanup completed."
}

# Main deployment function
main() {
    log_info "Starting OtoTakibim production deployment..."
    echo "=================================================="
    
    # Pre-deployment checks
    check_requirements
    check_environment
    
    # Build applications
    build_backend
    build_frontend
    
    # Build Docker images
    build_docker_images
    
    # Deploy
    deploy_with_docker
    
    # Post-deployment
    run_post_deployment_tests
    cleanup
    
    echo "=================================================="
    log_success "OtoTakibim deployment completed successfully!"
    log_info "Application is now running at:"
    log_info "  Frontend: https://ototakibim.com"
    log_info "  API: https://api.ototakibim.com"
    log_info "  Monitoring: http://localhost:3001 (Grafana)"
    log_info "  Logs: http://localhost:5601 (Kibana)"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "OtoTakibim Production Deployment Script"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --build-only   Only build the applications, don't deploy"
        echo "  --deploy-only  Only deploy, skip building"
        echo "  --test-only    Only run tests"
        echo ""
        exit 0
        ;;
    --build-only)
        check_requirements
        check_environment
        build_backend
        build_frontend
        build_docker_images
        log_success "Build completed successfully!"
        exit 0
        ;;
    --deploy-only)
        check_requirements
        check_environment
        deploy_with_docker
        run_post_deployment_tests
        log_success "Deployment completed successfully!"
        exit 0
        ;;
    --test-only)
        check_requirements
        run_post_deployment_tests
        exit 0
        ;;
    *)
        main
        ;;
esac
