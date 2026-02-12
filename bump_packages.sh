set -e

ANGULAR_VERSION=21

# step 1: checkout new branch and save it's name
# BRANCH_NAME="bump_packages_$(date +%Y%m%d%H%M%S)"

# git checkout -b $BRANCH_NAME

# step 2: update angular packages
# Update Angular packages
npx ng update @angular/core@$ANGULAR_VERSION @angular/cli@$ANGULAR_VERSION @angular-eslint/schematics@$ANGULAR_VERSION

# step 3: commit changes
git add .
git commit -m "bump packages"

# step 4: update angular material packages

npx ng update @angular/material@$ANGULAR_VERSION

# step 5: ammend commit
git add .
git commit --amend --no-edit

# step 6: update remaining packages
npm update

# step 7: ammend commit
git add .
git commit --amend --no-edit

# step 8: push branch
# git push origin HEAD