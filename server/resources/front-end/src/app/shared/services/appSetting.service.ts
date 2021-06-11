import { Injectable } from '@angular/core';

@Injectable()
export class AppSetting {
  private static debug = true;
  trailer = 'com';
  appConfig = {
    useProxy: true, // for local development
    // proxyUrl: 'http://localhost:8000/',
    proxyUrl: 'api',
    prodUrl: 'tobedecided'
  };

  constructor() {
  }

  public static setDebugMode(isEnabled: boolean): void {
    AppSetting.debug = isEnabled;
  }

  public static debuggable(): boolean {
    return AppSetting.debug;
  }

  getAPIUrl() {
    if (this.appConfig.useProxy) {
      return this.appConfig.proxyUrl;
    } else {
      return this.appConfig.prodUrl;
    }
  }
}
