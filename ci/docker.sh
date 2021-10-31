#! /usr/bin/bash

lastTag=$(git tag | sort -r | head -1)
uniqueTag="lilylilps/shri-2021-task-testing/release/${lastTag}"
getTaskUrl="https://api.tracker.yandex.net/v2/issues/_search"

authHeader="Authorization: OAuth ${OAuth}"
orgHeader="X-Org-Id: ${OrganizationId}"
contentType="Content-Type: application/json"

imageName="store_app:${lastTag}"

errorOccured=false

docker build . -f Dockerfile -t ${imageName}

if [ $? -ne 0 ]
then
    echo "ERROR with build docker image"
    errorOccured=true
fi

taskKey=$(curl --silent --location --request POST ${getTaskUrl} \
    --header "${authHeader}" \
    --header "${orgHeader}" \
    --header "${contentType}" \
    --data-raw '{
        "filter": {
            "unique": "'"${uniqueTag}"'"
        }
    }' | jq -r '.[0].key'
)

createCommentUrl="https://api.tracker.yandex.net/v2/issues/${taskKey}/comments"

if $errorOccured; then
    message="ERROR with build docker image: ${imageName}"
else
    message="Successful build docker image: ${imageName}"
fi

createCommentStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request POST \
    "${createCommentUrl}" \
    --header "${authHeader}" \
    --header "${orgHeader}" \
    --header "${contentType}" \
    --data-raw '{
        "text": "'"${message}"'"
    }'
)

if [ "$createCommentStatusCode" -ne 201 ]
then
    echo "Error with creating build comment for task: ${taskKey}"
    exit 1
else
    echo ${message}
    if $errorOccured; then
        exit 1
    fi
fi
