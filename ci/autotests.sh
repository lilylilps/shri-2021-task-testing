#! /usr/bin/bash

lastTag=$(git tag | sort -r | head -1)
uniqueTag="lilylilps/shri-2021-task-testing/release/${lastTag}"
getTaskUrl="https://api.tracker.yandex.net/v2/issues/_search"

authHeader="Authorization: OAuth ${OAuth}"
orgHeader="X-Org-Id: ${OrganizationId}"
contentType="Content-Type: application/json"

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

testResult=$(npx jest 2>&1)

# echo ${testResult}

# curl --location --request POST \
#         "${createCommentUrl}" \
#         --header "${authHeader}" \
#         --header "${orgHeader}" \
#         --header "${contentType}" \
#         --data-raw '{
#             "text": "'"${testResult}"'"
#         }'
