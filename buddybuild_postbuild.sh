#!/usr/bin/env bash

if [[ "$BUDDYBUILD_BRANCH" == "master" ]]; then  
  if [[ "$HOCKEYAPP_BUILD_PLATFORM" == "ios" ]]; then  
      echo "Uploading staging app HockeyApp..."

      curl \
        -F "status=2" \
        -F "notify=0" \
        -F "ipa=@$BUDDYBUILD_IPA_PATH" \
        -H "X-HockeyAppToken: $HOCKEYAPP_API_TOKEN" \
        https://rink.hockeyapp.net/api/2/apps/$HOCKEYAPP_ID/app_versions

      echo "Finished uploading to HockeyApp."
  else  
      echo "Uploading APK to HockeyApp..."
      APK_PATH=($(find . -name *-release.apk))
      curl \
        -F "status=2" \
        -F "notify=0" \
        -F "ipa=@$APK_PATH" \
        -H "X-HockeyAppToken: $HOCKEYAPP_API_TOKEN" \
        https://rink.hockeyapp.net/api/2/apps/$HOCKEYAPP_ID/app_versions
      echo "Finished uploading to HockeyApp."
  fi
else  
    echo "This wasn't the master branch!"
fi
