#! /usr/bin/bash

lastTag=$(git tag | sort -r | head -1)

imageName="store_app:${lastTag}"

docker build -t ${imageName} .

'Build success' > build_result.txt