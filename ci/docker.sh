#! /usr/bin/bash

lastTag=$(git tag | sort -r | head -1)

imageName="store_app:${lastTag}"

docker build . -f Dockerfiles -t ${imageName}

if [ $? -ne 0 ]
then
    echo 'ERROR with build docker image'
    exit 1
else
    echo 'Build success'
fi
