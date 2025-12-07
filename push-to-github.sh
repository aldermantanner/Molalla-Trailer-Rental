#!/bin/bash

echo "Enter your GitHub Personal Access Token:"
read -s TOKEN

git config user.name "aldermantanner"
git config user.email "your-email@example.com"

git add .
git commit -m "Update Molalla Trailer Rental"

git remote remove origin 2>/dev/null
git remote add origin https://${TOKEN}@github.com/aldermantanner/Molalla-Trailer-Rental.git

git push -u origin master --force

echo "Done!"
