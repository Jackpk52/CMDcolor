#include "headers/common.h"

void log_message(const char* message) {
    FILE* log_file = fopen("cmdchameleon.log", "a");
    if (log_file) {
        fprintf(log_file, "[%s] %s\n", "CMDChameleon", message);
        fclose(log_file);
    }
}

int main(int argc, char* argv[]) {
    if (argc > 1) {
        log_message(argv[1]);
    }
    return 0;
}