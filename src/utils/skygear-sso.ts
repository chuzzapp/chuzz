
export class IonicSSOHelper {
  timer = null;
  inAppBrowser = null;
  browserClosedByUser = true;

  getSSOData(inAppBrowser) {
    this.clearTimer();
    this.browserClosedByUser = true;
    this.inAppBrowser = inAppBrowser;

    return new Promise((resolve, reject) => {
      this.inAppBrowser.on('exit').subscribe(() => {
        reject(errorResponseFromMessage('process terminated by user'));
      });

      this.timer = setInterval(() => {
        this.doPolling(resolve, reject);
      }, 500);
    });
  }

  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private doPolling(resolve, reject) {
    if (!this.inAppBrowser) {
      this.clearTimer();
      reject(errorResponseFromMessage('InAppBrowser is null'));
      this.closeBrowser();
      return;
    }

    this.inAppBrowser.executeScript({ code: 'document.cookie' })
      .then((returnValues) => {
        if (returnValues.length === 0) {
          return;
        }

        const ssoData = this.extractSSODataFromCookie(returnValues[0]);
        if (ssoData !== null) {
          this.clearTimer();
          this.clearSSODataCookie()
            .then(() => {
              resolve(this.decodeSSOData(ssoData));
              this.closeBrowser();
            })
            .catch((e) => {
              console.log(e);
              reject(errorResponseFromMessage(e));
              this.closeBrowser();
            });
        }
      });
  }

  private closeBrowser() {
    if (this.inAppBrowser) {
      this.browserClosedByUser = false;
      this.inAppBrowser.close();
      this.inAppBrowser = null;
    }
  }

  private extractSSODataFromCookie(cookieData) {
    const cookies = this.parseCookies(cookieData);
    
    if ('sso_data' in cookies) {
      return cookies.sso_data;
    } else {
      return null
    }
  }

  private decodeSSOData(ssoData) {
    if (ssoData[0] === '"' || ssoData[0] === "'") {
      ssoData = ssoData.slice(1, -1);
    }

    return JSON.parse(atob(ssoData));
  }

  private parseCookies(cookieData) {
    return cookieData.split('; ')
      .map(x => {
        const equalIndex = x.indexOf('=');
        return {
          [x.substr(0, equalIndex)]: x.substr(equalIndex + 1)
        };
      })
      .reduce((acc, x) => ({...acc, ...x}));
  }

  private clearSSODataCookie() {
    if (!this.inAppBrowser) {
      return;
    }

    return this.inAppBrowser.executeScript({
      code: 'document.cookie="sso_data=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"'
    });
  }
}

function errorResponseFromMessage(msg) {
  return { error: msg }; 
}

export function loginOAuthProviderForIonicIAB(skygear, inAppBrowser, provider, options) {
  const ssoHelper = new IonicSSOHelper();

  return _getAuthUrl(skygear, provider, options.callbackUrl)
    .then((data) => {
        const browser = inAppBrowser.create(data.auth_url, '_blank', 'location=no');
        return ssoHelper.getSSOData(browser)
    })
    .then((ssoData: any) => {
      if (ssoData.result.error) {
        throw ssoData.result.error;
      } 
      return skygear.auth._authResolve(ssoData.result);
    });
}

function _getAuthUrl(skygear, provider, callbackUrl) {
  return skygear.lambda(`sso/${provider}/login_auth_url`, {
      ux_mode: 'web_redirect',
      callback_url: callbackUrl,
    });
}
