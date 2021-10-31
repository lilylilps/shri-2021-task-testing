#! /usr/bin/bash

lastTag=$(git tag | sort -r | head -1)
prevTag=$(git tag | sort -r | head -2 | tail -1)
author=$(git show ${lastTag} | grep Author: | head -1)
date=$(git show ${lastTag} | grep Date: | head -1)

gitlog=$(git log --pretty=format:"%h - %an, %cd : %s, %ce" --date=short ${prevTag}..${lastTag})

uniqueTag="lilylilps/shri-2021-task-testing/release/${lastTag}"
summary="Release task for lilylilps/shri-2021-task-testing for ${lastTag}"
description="${author}\n${date}\nVersion: ${lastTag}"

createTaskUrl="https://api.tracker.yandex.net/v2/issues/"
getTaskUrl="https://api.tracker.yandex.net/v2/issues/_search"
updateTaskUrl="https://api.tracker.yandex.net/v2/issues/"

authHeader="Authorization: OAuth ${OAuth}"
orgHeader="X-Org-Id: ${OrganizationId}"
contentType="Content-Type: application/json"

createStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request POST ${createTaskUrl} \
    --header "${authHeader}" \
    --header "${orgHeader}" \
    --header "${contentType}" \
    --data-raw '{
        "queue": "TMP",
        "summary": "'"${summary}"'",
        "type": "task",
        "description": "'"${description}"'",
        "unique": "'"${uniqueTag}"'"
    }'
)

sleep 1

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

if [ "$createStatusCode" -eq 409 ]
then
    echo "Cannot create ticket with the same release version"

    updateStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request PATCH \
        "${updateTaskUrl}${taskKey}" \
        --header "${authHeader}" \
        --header "${orgHeader}" \
        --header "${contentType}" \
        --data-raw '{
            "summary": "'"${summary}"'",
            "description": "'"${description}"' (updated)"
        }'
    )

    if [ "$updateStatusCode" -ne 200 ]
    then
        echo "Error with updating ticket ${taskKey}"
        exit 1
    else
        echo "Successfully updated ticket ${taskKey}"
    fi

elif [ "$createStatusCode" -ne 201 ]
then
    echo "Error with creating release ticket"
    exit 1
else
    echo "Successfully created ticket"
fi

echo "{\"text\": \"$(echo $gitlog | tr -d ':' | tr '\r\n' ' ')\"}" | jq > tmp.json

createCommentUrl="https://api.tracker.yandex.net/v2/issues/${taskKey}/comments"

createCommentStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request POST \
        "${createCommentUrl}" \
        --header "${authHeader}" \
        --header "${orgHeader}" \
        --header "${contentType}" \
        --data-binary @tmp.json
)

if [ "$createCommentStatusCode" -ne 201 ]
then
    echo "Error with creating comment with gitlog for issue ${taskKey}"
    exit 1
else
    echo "Successfully created comment with gitlog for issue ${taskKey}"
fi

rm tmp.json