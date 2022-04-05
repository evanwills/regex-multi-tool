#!/bin/sh

deployTo='/c/Users/evwills/Documents/Evan/code/shell-scripts/deploy-to.sh';

npm run build;

echo;
echo;
echo 'clean up index.html'
# Make paths relative to application root
# rather than site root
sed -i 's/="\/assets\//="assets\//ig' dist/index.html;

echo;
echo;
echo 'deploy to Local'
/bin/sh $deployTo 'local';

echo;
echo;
echo 'deploy to TEST'
/bin/sh $deployTo 'test';
