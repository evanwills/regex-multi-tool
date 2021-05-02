#!/bin/sh

lockFile='/c/Users/evwills/regexMulti.lock';

if [ ! -f $lockFile ]
then	touch $lockFile
	cd /c/users/evwills/Documents/Evan/code/regex-multi-tool/
	npm run dev
	echo;
	echo "I've set $lockFile to prevent duplicate servers being started.".
	echo;
	rm $lockFile
	echo; echo;
	echo "I've removed the lock file ($lockFile) so you can start up next time.";
	echo; echo;
	echo "to restart, just run";
	echo "	/bin/sh /c/Users/evwills/launchRegexMulti.sh;";
	echo; echo;
else	echo;
	echo "Regex Multi-tool Dev server is already running.";
	echo;
	echo "It may be that you need to remove the lock file and rerun this script.";
	echo;
	echo;
	echo "$ rm $lockFile; /bin/sh /c/Users/evwills/launchRegexMulti.sh;";
	echo;
	echo;
fi
