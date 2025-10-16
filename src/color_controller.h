#include "headers/common.h"
#include "headers/colors.h"

void set_console_colors(int foreground, int background) {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    WORD attributes = (background << 4) | foreground;
    SetConsoleTextAttribute(hConsole, attributes);
}

int color_name_to_code(const char* color_name) {
    if (strcmp(color_name, "black") == 0) return COLOR_BLACK;
    if (strcmp(color_name, "blue") == 0) return COLOR_BLUE;
    if (strcmp(color_name, "green") == 0) return COLOR_GREEN;
    if (strcmp(color_name, "cyan") == 0) return COLOR_CYAN;
    if (strcmp(color_name, "red") == 0) return COLOR_RED;
    if (strcmp(color_name, "magenta") == 0) return COLOR_MAGENTA;
    if (strcmp(color_name, "yellow") == 0) return COLOR_YELLOW;
    if (strcmp(color_name, "white") == 0) return COLOR_WHITE;
    return COLOR_WHITE; // default
}