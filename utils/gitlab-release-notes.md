# Gitlab Release Notes Generator

This script generates release notes for a GitLab project based on the merge requests associated with a milestone.

Release notes look like this:
```md
# Release Notes - Version v1.0.0

Generated on: 2024-11-26

## Breaking Changes
- Updated authentication mechanism (#123)

## New Features
- Added dark mode support (#124)
- Implemented search functionality (#125)

## Bug Fixes
- Fixed login issue (#126)
- Resolved data loading error (#127)

## Documentation Updates
- Updated API documentation (#128)

## Other Changes
- General code cleanup (#129)
```

Key improvements in this version:

1. Security:
    - Moved token to environment variable (GITLAB_TOKEN)
    - No hardcoded credentials in the code

2. Structure:
    - Created a proper class structure for better organization
    - Separated concerns into different methods
    - Added type hints for better code clarity

3. Features:
    - Added command-line arguments
    - Optional file output
    - Configurable GitLab URL
    - Optional author inclusion
    - Sorted categories for consistent output

4. Error handling:
    - Better exception handling
    - Proper HTTP response checking
    - Meaningful error messages

## Requirements

- Python 3.6+
- GitLab API token

### GitLab API Token
For generating release notes from issues, the GitLab token needs the following minimum permissions:

1. `read_api` - This is the basic permission needed to access the GitLab API
2. `read_repository` - To access project information
3. `read_issues` - To read issues and their details

To create a token with these permissions:

1. Go to GitLab and click on your profile icon
2. Select "Preferences"
3. Navigate to "Access Tokens" in the left sidebar
4. Create a new token:
    - Name: something descriptive like "Release Notes Generator"
    - Expiration: Set according to your needs
    - Select the scopes:
        - read_api
        - read_repository
        - read_issues

If you're using a self-hosted GitLab instance, you might need to check with your GitLab admin if you have any permission issues, as some instances may have different security policies.

## Installation

To install the prequisites, run:
```bash
pip install -r requirements.txt
```

## Usage

To use the script:

1. Set your GitLab token as an environment variable:
   Bash
   ```bash
   export GITLAB_TOKEN='your_private_token'
   ```
   Powershell:
   ```powershell
   # For current session only
   $env:GITLAB_TOKEN = "your-token-here"
   # For permanent storage at user level (recommended)
   [Environment]::SetEnvironmentVariable("GITLAB_TOKEN", "your-token-here", "User")
   ```
2. Run the script:
```bash
# Basic usage
python gitlab_release_notes.py 12345 "v1.0.0"

# With additional options
python gitlab_release_notes.py 12345 "v1.0.0" --authors --output release_notes.md
```

You could also create a simple shell script wrapper to make it easier to use:

```bash
#!/bin/bash
# generate_release_notes.sh
export GITLAB_TOKEN='your_private_token'
python gitlab_release_notes.py "$@"
```
