#! /usr/bin/bash

lastTag=$(git tag | sort -r | head -1)

imageName="store_app:${lastTag}"

docker build . -f Dockerfile -t ${imageName}

if [ $? -ne 0 ]
then
    echo 'Error with build docker image'
else
    echo 'Build success'
fi
