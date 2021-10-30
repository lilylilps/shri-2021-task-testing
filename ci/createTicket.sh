#! /usr/bin/bash

lastTag=$(git tag | sort -r | head -1)
prevTag=$(git tag | sort -r | head -2 | tail -1)
author=$(git show ${lastTag} | grep Author: )
date=$(git show ${lastTag} | grep Date:)

gitlog=$(git log ${prevTag}..${lastTag})

uniqueTag="lilylilps/shri-2021-task-testing/release/${lastTag}"
creatingSummary="Create release task for lilylilps/shri-2021-task-testing for ${lastTag}"
updatingSummary="Update release task for lilylilps/shri-2021-task-testing for ${lastTag}"
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
    "summary": "'"${creatingSummary}"'",
    "type": "task",
    "description": "'"${description}"'",
    "unique": "'"${uniqueTag}"'"
}')

if [ "$createStatusCode" -eq 409 ]
then
    echo "Cannot create ticket with the same release version"

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

    updateStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request PATCH \
        "${updateTaskUrl}${taskKey}" \
        --header "${authHeader}" \
        --header "${orgHeader}" \
        --header "${contentType}" \
        --data-raw '{
            "summary": "'"${updatingSummary}"'",
            "description": "'"${description}"'"
        }'
    )

    if [ "$updateStatusCode" -ne 200 ]
    then
        echo "Error with updating ticket ${taskKey}"
        exit 1
    else
        echo "Successfully update ticket ${taskKey}"
    fi

elif [ "$createStatusCode" -ne 201 ]
then
    echo "Error with creating release ticket"
    exit 1
else
    echo "Successfully create ticket"
fi


echo "{\"text\": \"$(echo $gitlog | tr -d ':' | tr '\r\n' ' ')\"}" | jq > tmp.json

createCommentUrl="https://api.tracker.yandex.net/v2/issues/${taskKey}/comments"

curl --silent --location --request POST \
        "${createCommentUrl}" \
        --header "${authHeader}" \
        --header "${orgHeader}" \
        --header "${contentType}" \
        --data-binary @tmp.json

rm tmp.json
