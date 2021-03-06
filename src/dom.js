import Cache from './cache';
import Ajax from './ajax';
import Log from './log';
import getUrlParam from './url';

export class Js {
  constructor(injectInto, config = {}) {
    let {
      enableLogging = false,
      verification = false,
      cacheInLocalStorage = true
    } = config;

    enableLogging = getUrlParam(
      'dactylographsy-enableLogging',
      enableLogging
    );

    cacheInLocalStorage = getUrlParam(
      'dactylographsy-cacheInLocalStorage',
      cacheInLocalStorage
    );

    this.injectInto = injectInto;

    this.cache = new Cache({
      appPrefix: config.appPrefix,
      enableLogging: enableLogging
    });

    this.cacheDelay = config.cacheDelay || 5000;
    this.verification = verification;
    this.cacheInLocalStorage = cacheInLocalStorage;

    this.log = new Log(enableLogging);
  }

  injectWithText(text, url) {
    return new Promise(resolve => {
      let script = document.createElement('script');

      this.log.info(`Creating <script />-tag with text for ${url}.`);

      script.defer = false;
      script.async = false;

      script.setAttribute('data-dactylographsy-url', url);

      script.text = `
        ${text}
        //# sourceURL=${url}
      `;

      if (this.injectInto) {
        this.log.info(`Injecting <script />-tag with url: ${url}.`);

        resolve(this.injectInto.appendChild(script));
      } else { resolve(script); }
    });
  }

  injectWithUrl(urls, whichUrl = 'printed') {
    return new Promise(resolve => {
      // Create script element and set its type
      let script = document.createElement('script');
      let url = urls[whichUrl];

      this.log.info(`Creating <script />-tag with url: ${url}.`);

      script.async = false;
      script.defer = false;

      script.setAttribute('data-dactylographsy-url', url);
      script.setAttribute('data-dactylographsy-uncached-js', true);

      // Bind to readyState or register ´onload´ callback
      if (script.readyState) {
        // Callback for IE's `onreadystatechange` (I feel seesick)
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;

            this.ensureCache(url, urls.singularBy, this.cacheDelay);
          }
        };
      } else {
        // Bind `onload` callback on script element
        script.onload = () => {
          if (whichUrl === 'printed') { this.ensureCache(url, urls.singularBy, this.cacheDelay); }
        };

        // Inject unprinted without caching in case of error
        script.onerror = () => {
          this.log.info(`Could not fetch JavaScript from ${url} - falling back to unprinted version.`);

          if (whichUrl === 'printed') { this.injectWithUrl(urls, 'raw'); }
        };
      }

      script.src = url;

      if (this.injectInto) {
        this.log.info(`Injecting <script />-tag with url: ${url}.`);

        resolve(this.injectInto.appendChild(script));
      } else {
        // ...needs caching manually cause never injected
        if (whichUrl === 'printed') { this.ensureCache(url, urls.singularBy, this.cacheDelay); }

        resolve(script);
      }
    });
  }

  ensureCache(url, singularBy = false, delay = 0) {
    return new Promise((resolve, reject) => {
        if (this.cache.has(url)) { return resolve(); }
        if (!this.cacheInLocalStorage) { return resolve('Caching in localStorage is disabled'); }

        this.log.info(`Loading JavaScript from ${url} for cache in ${delay}.`);

        window.setTimeout(() => {
          return new Ajax()
            .get(url)
            .then(response => {
              let { text: responseText } = response;

              this.cache.set(responseText, 'js', url, singularBy);

              this.log.info(`Loaded JavaScript from ${url} now cached.`);

              resolve();
            })
            .catch(() => {
              this.log.info(`Failed attempting to cache JavaScript from ${url}.`);
            });
        }, delay);
    });
  }

  hash(hash) {
    return (
      this.verification === true
    ) ? hash : false
  }

  inject(urls) {
    return this.cache.get(
      urls.printed,
      undefined,
      this.hash(urls.id)
    ).then(text => {
        return this.injectWithText(text, urls.printed);
    }, () => {
      return this.injectWithUrl(urls);
    });
  }
}

export class Css {
  constructor(injectInto, config = {}) {
    let {
      enableLogging = false,
      verification = false,
      cacheInLocalStorage = true
    } = config;

    enableLogging = getUrlParam(
      'dactylographsy-enableLogging',
      enableLogging
    );

    cacheInLocalStorage = getUrlParam(
      'dactylographsy-cacheInLocalStorage',
      cacheInLocalStorage
    );

    this.injectInto = injectInto;

    this.cache = new Cache({
      appPrefix: config.appPrefix
    });

    this.cacheDelay = config.cacheDelay || 5000;
    this.verification = verification;

    this.log = new Log(enableLogging);
  }

  ensureCache(url, singularBy = false, delay = 0) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(url)) { return resolve(); }
      if (!this.cacheInLocalStorage) { return resolve('Caching in localStorage is disabled'); }

      this.log.info(`Loading CSS from ${url} for cache in ${delay}.`);

      window.setTimeout(() => {
        return new Ajax()
          .get(url)
          .then(response => {
            let { text: responseText } = response;

            this.cache.set(responseText, 'css', url, singularBy);

            this.log.info(`Loaded CSS from ${url} now cached.`);

            resolve();
          }).catch(() => {
            this.log.info(`Failed attempting to cache CSS from ${url}.`);
          });
      }, delay);
    });
  }

  injectWithUrl(urls, whichUrl = 'printed') {
    return new Promise(resolve => {
      let link = document.createElement('link');
      let url = urls[whichUrl];

      this.log.info(`Creating <link />-tag with url: ${url}.`);

      link = document.createElement('link');

      link.type = 'text/css';
      link.rel = 'stylesheet';

      link.setAttribute('data-dactylographsy-url', url);
      link.setAttribute('data-dactylographsy-uncached-css', true);

      link.href = url;

      // Fallback to unprinted assets after cache attempt
      // no callbacks for stylesheet injections (timeouts are worse...)
      if (whichUrl === 'printed') {
        this.ensureCache(url, urls.singularBy, this.cacheDelay)
          .catch(() => {
            this.log.info(`Could not fetch CSS from ${url} - falling back to unprinted version.`);

            this.injectWithUrl(urls, 'raw');
          });
      }

      if (this.injectInto) {
        this.log.info(`Injecting <link />-tag with url: ${url}.`);

        resolve(this.injectInto.appendChild(link));
      } else { resolve(link); }
    });
  }

  injectWithText(text, url) {
    return new Promise(resolve => {
      let link = document.createElement('link');

      this.log.info(`Creating <link />-tag with text for url: ${url}.`);

      link = document.createElement('style');

      link.setAttribute('data-dactylographsy-url', url);

      link.textContent = text;

      if (this.injectInto) {
        this.log.info(`Injecting <link />-tag with url: ${url}.`);

        resolve(this.injectInto.appendChild(link));
      } else { resolve(link); }
    });
  }

  hash(hash) {
    return (
      this.verification === true
    ) ? hash : false
  }

  inject(urls) {
    return this.cache.get(
      urls.printed,
      undefined,
      this.hash(urls.id)
    ).then(text => {
      return this.injectWithText(text, urls.printed);
    }, () => {
      return this.injectWithUrl(urls);
    });
  }
}
