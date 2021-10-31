#! /usr/bin/bash

lastTag=$(git tag | sort -r | head -1)
uniqueTag="lilylilps/shri-2021-task-testing/release/${lastTag}"
getTaskUrl="https://api.tracker.yandex.net/v2/issues/_search"

authHeader="Authorization: OAuth ${OAuth}"
orgHeader="X-Org-Id: ${OrganizationId}"
contentType="Content-Type: application/json"

testResult=$(npx jest 2>&1)

if [[ $testResult == *"FAIL"* ]]
then
  echo "Autotest faild"
  echo $testResult
  exit 1
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

echo "{\"text\": \"$(echo $testResult | tr -d ':' | tr "\r\n" " ")\"}" | jq > tmp.json

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
    echo "Error with creating comment with test result for issue ${taskKey}"
    exit 1
else
    echo "Successfully created comment with test result for issue ${taskKey}"
fi

rm tmp.json