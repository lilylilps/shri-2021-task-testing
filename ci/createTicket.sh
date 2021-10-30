#! /usr/bin/bash

firstTag=$(git tag | sort -r | head -1)
secondTag=$(git tag | sort -r | head -2 | tail -1)
author=$(git show ${firstTag} | grep Author: | tr -d 'Author:')
date=$(git show ${firstTag} | grep Date: | tr -d 'Date:')

git log ${secondTag}..${firstTag} 
