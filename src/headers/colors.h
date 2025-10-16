#ifndef COLORS_H
#define COLORS_H

typedef enum {
    COLOR_BLACK = 0,
    COLOR_BLUE = 1,
    COLOR_GREEN = 2,
    COLOR_CYAN = 3,
    COLOR_RED = 4,
    COLOR_MAGENTA = 5,
    COLOR_YELLOW = 6,
    COLOR_WHITE = 7
} ConsoleColor;

void set_console_colors(int foreground, int background);
int color_name_to_code(const char* color_name);

#endif