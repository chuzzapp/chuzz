#!/usr/bin/env bash

if [[ "$BUDDYBUILD_BRANCH" == "production" ]]; then 
  rm config.xml
  mv config.xml.production config.xml
fi

if [[ "$HOCKEYAPP_BUILD_PLATFORM" == "ios" ]]; then  
    cd translations/app
    for f in `find . -name '*-r*.json'`; do mv "$f" $(echo "$f" | sed 's/-r/-/g'); done
    cd ../..
fi
