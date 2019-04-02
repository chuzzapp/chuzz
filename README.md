# Chuzz

A mobile app for creating and answering polls.

## Built With

* [NodeJS](https://nodejs.org) - 6.11.1
* [Ionic](https://ionicframework.com) - 3.4.0
* [Cordova](https://cordova.apache.org) - 6.5.0

## Getting Started

To test this app with web, install the latest version of the Ionic CLI and run:

```bash
npm install -g cordova ionic
npm install
npm run ionic:serve
```

## API Configuration

Chuzz uses [Skygear](https://skygear.io) as backend. By default, server endpoint and API key is configured at `src/config/environment.dev.ts`. If the environment variable `DEPLOY_PRODUCTION` is `YES`, the app will use `environment.prod.ts` as the configuration.

## i18n

Ionic Super Starter comes with internationalization (i18n) out of the box with [ngx-translate](https://github.com/ngx-translate/core). This makes it easy to change the text used in the app by modifying only one file. 

By default, the only language strings provided are American English.

### Adding Languages

To add new languages, add new files to the `src/assets/i18n` directory, following the pattern of LANGCODE.json where LANGCODE is the language/locale code (ex: en/gb/de/es/etc.).

### Changing the Language

To change the language of the app, edit `src/app/app.component.ts` and modify `translate.use('en')` to use the LANGCODE from `src/assets/i18n/`
