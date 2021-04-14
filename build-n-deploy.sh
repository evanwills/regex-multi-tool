#!/bin/sh

local='evan@bilby';
remote='evwills@test-webapps.acu.edu.au';

swVersionStore='swVersion'
inputSW='regexMulti.sw.js';
outputSW='dist/'$inputSW

# ==================================================
# START: Enable ServiceWorker in PROD


echo; echo; echo '==================================================';
echo; echo; echo 'Enable ServiceWorker in PROD';
echo; echo;

sed -i 's/\/\/ \(navigator\.serviceWorker\.register\)/\1/' js/index.js

#  END:  Enable ServiceWorker in PROD
# ==================================================

npm run build


echo; echo; echo '==================================================';
echo; echo; echo 'Preparing production version of Service Worker';
echo; echo;

# ==================================================
# START: Increment ServiceWorker version

versionNum=0;
if [ -f $swVersionStore ]
then	# Get the version number for the last output ServiceWorker
	versionNum=$(less $swVersionStore)
fi

if [ ! -z "$versionNum" ]
then	# Increment the version number by 1
	versionNum=$(($versionNum + 1))

	if (( $versionNum > 1000 ))
	then	# If the version number is greater than 1000 reset to 1
		versionNum=1
	fi
	# Recored the new ServiceWorker version number
	echo $versionNum > $swVersionStore
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
assets=$(ls dist/assets/ | sed "s/\([^ \t]\+\)[\t ]*/'\/assets\/\1', /ig")
assetList=$assets

# Make string safe to use in Sed regular expression
assets=$(echo $assets | sed 's/\([./]\)/\\\1/g')

# Remove the trailing comma from the last file
assets=$(echo $assets | sed 's/,$//')


# Strip out all the CSS files in the local version of the ServiceWorker
sed -i "s/[\t ]*'\/\?css\/\([^.]\+\.\)\+css',\?[\t \r\n\m]*//" $outputSW;

# Replace reference to local favicon.ico with list of all compiled assets
sed -i "s/'\.\?\/\?favicon\.ico'/$assets/" $outputSW;


echo 'ServiceWorker version: '$versionNum
echo 'Compiled assets: '$assetList;

# tail -n 100 $outputSW
# exit;


echo; echo;
echo; echo; echo 'Completed prep for prod Service Worker';
echo; echo; echo '==================================================';

#  END:  Rewriting cacheable file list
# ==================================================
# START: Uploading to Bilby

# 192.168.113.129


echo; echo; echo '==================================================';
echo; echo; echo 'Uploading to Bilby';
echo; echo;

bilbySW="dist/bilby-$inputSW"

cp $outputSW $bilbySW;
sed -i "s/\([\t ]*'\/\)/\1regex-multi-tool\//ig" $bilbySW

# exit;

scp dist/index.html $local:/var/www/html/regex-multi-tool/;
scp $bilbySW $local:/var/www/html/regex-multi-tool/$inputSW;

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
then	./build-n-deploy--to-test.sh "$local" "$remote" "$inputSW" "$outputSW";
fi

rm dist/bilby*
rm dist/test*

# ==================================================
# START: Disable Service worker in DEV

echo; echo; echo '==================================================';
echo; echo; echo 'Disable Service worker in DEV';
echo; echo;


sed -i 's/\(navigator\.serviceWorker\.register\)/\/\/ \1/' js/index.js

#  END:  Disable Service worker in DEV
# ==================================================