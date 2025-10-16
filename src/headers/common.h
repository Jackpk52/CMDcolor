#ifndef COMMON_H
#define COMMON_H

#include <windows.h>
#include <stdio.h>
#include <string.h>

#define MAX_BUFFER_SIZE 1024
#define CONFIG_FILE "cmdchameleon.ini"

// Function prototypes
void log_message(const char* message);
int file_exists(const char* filename);

#endif