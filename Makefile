NPROCS = $(shell grep -c 'processor' /proc/cpuinfo)
MAKEFLAGS += -j$(NPROCS)

dev: dev-engine dev-console dev-worker

.PHONY: dev-engine
dev-engine:
	@echo "Starting engine service..."
	cd engine && cargo run

.PHONY: dev-console
dev-console:
	@echo "Starting web console..."
	cd console && npm run dev

.PHONY: dev-worker
dev-worker:
	@echo "Starting worker..."
	cd build-worker && cargo run