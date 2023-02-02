#!/bin/sh

deployTo='/c/Users/evan/Documents/code/shell-scripts/deploy-to.sh';

npm run build;

echo;
echo;
echo 'clean up index.html'
# Make paths relative to application root
# rather than site root
sed -i 's/="\/assets\//="assets\//ig' dist/index.html;
sed -i 's/[ \t]*\(<link\|<script\)/\t\t\1/i' dist/index.html
sed -i 's/[ \t]*<\/head>/\t<\/head>/i' dist/index.html;
sed -i '/^[[:space:]]*$/d' dist/index.html
echo;
echo;
echo 'deploy to Local'
/bin/sh $deployTo 'local';

echo;
echo;
echo 'deploy to TEST'
/bin/sh $deployTo 'test';
