#ifndef REGISTRY_H
#define REGISTRY_H

BOOL set_autorun_command(char* command);
BOOL set_prompt_value(char* prompt);
char* get_current_prompt();
BOOL remove_autorun_command();

#endif