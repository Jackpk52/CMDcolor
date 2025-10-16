#!/usr/bin/env python3
import json
import os
import sys
import argparse
from pathlib import Path

class CMDChameleon:
    def __init__(self):
        self.config_dir = Path.home() / '.cmdchameleon'
        self.config_dir.mkdir(exist_ok=True)
        self.themes_dir = Path(__file__).parent.parent / 'themes'
        
    def list_themes(self):
        """List all available themes"""
        themes = []
        for theme_file in self.themes_dir.glob('*.json'):
            with open(theme_file, 'r') as f:
                theme_data = json.load(f)
                themes.append({
                    'name': theme_data.get('name', theme_file.stem),
                    'description': theme_data.get('description', 'No description')
                })
        return themes
    
    def apply_theme(self, theme_name):
        """Apply a theme by name"""
        theme_path = self.themes_dir / f'{theme_name}.json'
        if not theme_path.exists():
            # Also check in user config dir
            theme_path = self.config_dir / 'themes' / f'{theme_name}.json'
            
        if theme_path.exists():
            with open(theme_path, 'r') as f:
                theme = json.load(f)
            self._apply_theme_data(theme)
            print(f"✅ Theme '{theme_name}' applied successfully!")
            return True
        else:
            print(f"❌ Theme '{theme_name}' not found!")
            print("Available themes:")
            for theme in self.list_themes():
                print(f"  - {theme['name']}: {theme['description']}")
            return False
            
    def _apply_theme_data(self, theme):
        """Apply theme data to system"""
        # Apply colors using C executable
        colors = theme.get('colors', {})
        if colors:
            fg = colors.get('foreground', 'white')
            bg = colors.get('background', 'black')
            print(f"Setting colors: {fg} on {bg}")
            # This will call your C color controller
            os.system(f'..\\bin\\color_controller.exe {fg} {bg}')
            
        # Set prompt
        prompt = theme.get('prompt', '$P$G')
        print(f"Setting prompt: {prompt}")
        # This will call your C registry manager
        os.system(f'..\\bin\\registry_manager.exe set_prompt "{prompt}"')
        
        # Set window title
        title = theme.get('title', 'CMDChameleon')
        os.system(f'title {title}')
        
        # Apply aliases (you'll need to implement this)
        aliases = theme.get('aliases', {})
        if aliases:
            print(f"Setting {len(aliases)} aliases")
            self._apply_aliases(aliases)
    
    def _apply_aliases(self, aliases):
        """Apply command aliases - this is a placeholder for now"""
        # You'll need to implement alias application logic
        # This could involve modifying autoexec.bat or registry
        pass

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='CMDChameleon Theme Manager')
    parser.add_argument('--theme', help='Theme name to apply')
    parser.add_argument('--list', action='store_true', help='List all available themes')
    
    args = parser.parse_args()
    chameleon = CMDChameleon()
    
    if args.list:
        print("Available themes:")
        for theme in chameleon.list_themes():
            print(f"  {theme['name']:15} - {theme['description']}")
    elif args.theme:
        chameleon.apply_theme(args.theme)
    else:
        print("Usage:")
        print("  python main.py --theme <name>    # Apply a theme")
        print("  python main.py --list            # List all themes")
        print("\nExample: python main.py --theme hacker")