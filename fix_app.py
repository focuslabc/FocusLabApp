#!/usr/bin/env python3
"""Script to remove duplicate TasksView code from App.tsx"""

with open('src/app/App.tsx', 'r') as f:
    lines = f.readlines()

# Keep lines 1-652 (0-indexed: 0-651) and lines 973-end (0-indexed: 972-end)
fixed_lines = lines[0:652] + lines[972:]

with open('src/app/App.tsx', 'w') as f:
    f.writelines(fixed_lines)

print(f"Fixed! Removed {len(lines) - len(fixed_lines)} duplicate lines.")
print(f"Original: {len(lines)} lines -> New: {len(fixed_lines)} lines")
