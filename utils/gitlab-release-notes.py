import requests
import datetime
import argparse
import os
import sys
from collections import defaultdict
from typing import Dict, List

class GitLabReleaseNotesGenerator:
    def __init__(self, base_url: str = "https://gitlab.com/api/v4"):
        self.base_url = base_url
        self.token = os.getenv('GITLAB_TOKEN')
        if not self.token:
            raise ValueError("GITLAB_TOKEN environment variable is required")

    def get_issues(self, project_id: int, milestone: str) -> List[Dict]:
        print(f"Fetching issues for milestone {milestone}...")
        headers = {"PRIVATE-TOKEN": self.token}
        params = {
            "milestone": milestone,
            "state": "closed",
            "per_page": 100
        }

        response = requests.get(
            f"{self.base_url}/projects/{project_id}/issues",
            headers=headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def categorize_issue(self, labels: List[str]) -> str:
        category_mapping = {
            "breaking": "Breaking Changes",
            "enhancement": "New Features",
            "feature": "New Features",
            "bug": "Bug Fixes",
            "documentation": "Documentation Updates"
        }

        for label in labels:
            if label.lower() in category_mapping:
                return category_mapping[label.lower()]
        return "Other Changes"

    def generate_notes(self, project_id: int, milestone: str, include_author: bool = False) -> str:
        try:
            issues = self.get_issues(project_id, milestone)
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Failed to fetch issues: {str(e)}")

        categorized_issues = defaultdict(list)
        for issue in issues:
            category = self.categorize_issue(issue["labels"])
            categorized_issues[category].append(issue)

        return self._format_notes(milestone, categorized_issues, include_author)

    def _format_notes(self, milestone: str, categorized_issues: Dict, include_author: bool) -> str:
        notes = [
            f"# Release Notes - Version {milestone}",
            f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d')}",
            ""
        ]

        for category in sorted(categorized_issues.keys()):
            if categorized_issues[category]:
                notes.append(f"## {category}")
                notes.append("")
                for issue in categorized_issues[category]:
                    note = f"- {issue['title']} (!{issue['iid']})"
                    if include_author:
                        note += f" [@{issue['author']['username']}]"
                    notes.append(note)
                notes.append("")

        return "\n".join(notes)

def main():
    parser = argparse.ArgumentParser(description='Generate GitLab Release Notes')
    parser.add_argument('project_id', type=int, help='GitLab project ID')
    parser.add_argument('milestone', help='Milestone/version to generate notes for')
    parser.add_argument('--authors', action='store_true', help='Include issue authors in notes')
    parser.add_argument('--output', '-o', help='Output file (optional)')
    parser.add_argument('--gitlab-url', default="https://gitlab.com/api/v4", help='GitLab API URL (default: https://gitlab.com/api/v4)')

    args = parser.parse_args()

    try:
        generator = GitLabReleaseNotesGenerator(args.gitlab_url)
        notes = generator.generate_notes(args.project_id, args.milestone, args.authors)

        if args.output:
            with open(args.output, 'w') as f:
                f.write(notes)
            print(f"Release notes written to {args.output}")
        else:
            print(notes)

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()