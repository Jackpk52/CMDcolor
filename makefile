# CMDChameleon Build System
CC = gcc
CFLAGS = -O2 -Wall
TARGET_DIR = bin
SRC_DIR = src

# C Source files
C_SOURCES = $(SRC_DIR)/registry_manager.c $(SRC_DIR)/color_controller.c $(SRC_DIR)/prompt_engine.c

# Default target
all: $(TARGET_DIR)/registry_manager.exe $(TARGET_DIR)/color_controller.exe $(TARGET_DIR)/prompt_engine.exe

# Build registry manager
$(TARGET_DIR)/registry_manager.exe: $(SRC_DIR)/registry_manager.c $(SRC_DIR)/headers/registry.h
	$(CC) $(CFLAGS) -o $@ $(SRC_DIR)/registry_manager.c

# Build color controller
$(TARGET_DIR)/color_controller.exe: $(SRC_DIR)/color_controller.c $(SRC_DIR)/headers/colors.h
	$(CC) $(CFLAGS) -o $@ $(SRC_DIR)/color_controller.c

# Build prompt engine
$(TARGET_DIR)/prompt_engine.exe: $(SRC_DIR)/prompt_engine.c $(SRC_DIR)/headers/common.h
	$(CC) $(CFLAGS) -o $@ $(SRC_DIR)/prompt_engine.c

# Clean build artifacts
clean:
	del /Q $(TARGET_DIR)\*.exe

# Install to system (optional)
install: all
	copy $(TARGET_DIR)\*.exe C:\Tools\CMDChameleon\

.PHONY: all clean install