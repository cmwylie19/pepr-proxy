# Makefile for building the Pepr Zarf Agent and the Transformer Service

SHELL=bash
DOCKER_USERNAME=cmwylie19
TAG=0.0.1

build/gateway:
	@echo "Building Edge Gateway"
	@GOARCH=amd64 GOOS=linux go build -v -o edge-gateway main.go
	@mv edge-gateway build/
	@docker build -t $(DOCKER_USERNAME)/edge-gateway:$(TAG) build 
	@docker push $(DOCKER_USERNAME)/edge-gateway:$(TAG)
