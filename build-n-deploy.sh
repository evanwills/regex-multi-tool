#!/bin/sh

local='evan@bilby';
remote='evwills@test-webapps.acu.edu.au';

inputSW='regexMulti.sw.js';
outputSW='dist/'$inputSW

# npm run build


echo; echo; echo '==================================================';
echo; echo; echo 'Preparing production version of Service Worker';
echo; echo;

# ==================================================
# START: Increment ServiceWorker version

versionNum=0;
if [ -f $outputSW ]
then	# Get the version number for the last output ServiceWorker
	versionNum=$(grep 'version = ' $outputSW | sed 's/^[^0-9]\+\([0-9]\+\).*$/\1/i')
fi

if [ ! -z "$versionNum" ]
then	# Increment the version number by 1
	versionNum=$(($versionNum + 1))
else	versionNum=1
fi

cp $inputSW dist/

if [ ! -z "$versionNum" ]
then	# Update the version number for the new ServiceWorker
	sed -i 's/const version = [0-9]\+/const version = '$versionNum'/i' $outputSW
	# grep 'version = ' $outputSW
fi


#  END:  Increment ServiceWorker version
# ==================================================
# START: Rewriting cacheable file list

# Get a list of all the assets built by Vite JS, wrap them in quotes
# and separate with a comma
assets=$(ls dist/assets/ | sed "s/\([^ \t]\+\)[\t ]*/'assets\/\1', /ig")
assetList=$assets

# Make string safe to use in Sed regular expression
assets=$(echo $assets | sed 's/\([./]\)/\\\1/g')

# Remove the trailing comma from the last file
assets=$(echo $assets | sed 's/,$//')

# Strip out the list of files in the local version of the ServiceWorker
# Replace reference to local favicon.ico with list of all compiled assets
sed -i "s/'\/favicon\.ico'/$assets/" $outputSW;

# # Add the insert of built assets in the urlsToCache array
# sed -i "s/--CACHE--/$assets/" $outputSW
# sed -i "s/[\t\ ]*--CACHE--[\r\n\t\ ]*//g" $outputSW

echo 'ServiceWorker version: '$versionNum
echo 'Compiled assets: '$assetList;

# tail -n 50 $outputSW


echo; echo; echo 'Completed prep for prod Service Worker';
echo; echo; echo '==================================================';
# exit;

#  END:  Rewriting cacheable file list
# ==================================================
# START: Uploading to Bilby

# 192.168.113.129


echo; echo; echo '==================================================';
echo; echo; echo 'Uploading to Bilby';
echo; echo;

scp dist/index.html $local:/var/www/html/regex-multi-tool/;
scp $outputSW $local:/var/www/html/regex-multi-tool/;

echo; echo 'Removing old compiled files.'; echo; echo;

ssh $local rm -v /var/www/html/regex-multi-tool/assets/*;

echo; echo 'Uploading new versions of compiled files.'; echo; echo;

scp dist/assets/* $local:/var/www/html/regex-multi-tool/assets/;

echo; echo 'Rewriting paths to linked assets.'; echo ; echo;

ssh $local /bin/sh /home/evan/fixRegexMultiPaths.sh;


echo; echo;
echo; echo; echo 'Finished uploading to Bilby';
echo; echo; echo '==================================================';

#  END:  Uploading to Bilby
# ==================================================

if [ -f build-n-deploy--to-test.sh ]
then	./build-n-deploy--to-test.sh "$local" "$remote" "$outputSW";
fi