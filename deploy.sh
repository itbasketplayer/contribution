#!/bin/sh
deploy_folder=/Users/linxs/Documents/nodejs_space

if [ ! -d $deploy_folder ]
then
    echo "Directory $DEPLOY_FOLDER not exist."
    exit 1
fi

cd $deploy_folder;
m=`ps aux | grep "/Users/linxs/Documents/nodejs_space/contribution-run.js" |grep -v grep| grep -v tail | awk '{print $2}'`

export NODE_ENV=dev
if [ -z "$m" ]
then
    echo "start ......."
    forever start contribution-run.js
else
    echo "restart ......."
    forever restart contribution-run.js
fi

echo "start success"
