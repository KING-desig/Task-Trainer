https://github.com/KING-desig/Task-Trainer

# Task-Trainer

A simple command-line interface (CLI) application to track your tasks. Tasks are stored in a JSON file for persistence.

## Requirements
- Node.js (v14 or higher)

## Installation
1. Clone the repository:
   git clone https://github.com/KING-desig/Task-Trainer.git
   cd Task-Trainer

## Usage
Run the application using Node.js:
node index.js <command> [arguments]

### Commands
- `add "<description>"`: Add a new task
- `update <id> "<description>"`: Update a task's description
- `delete <id>`: Delete a task
- `mark-in-progress <id>`: Mark task as in-progress
- `mark-done <id>`: Mark task as done
- `list`: List all tasks
- `list todo`: List tasks to do
- `list in-progress`: List tasks in progress
- `list done`: List completed tasks
