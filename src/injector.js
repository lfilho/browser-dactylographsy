import {Css, Js} from './dom';
import Ajax from './ajax';
import Log from './log';
import getUrlParam from './url';

export class Manifest {
  constructor(url, config) {
    const { enableLogging = false } = config;

    this.log = new Log(
      getUrlParam('dactylographsy-enableLogging', enableLogging)
    );

    this.url = url;
  }

  get() {
    return new Ajax()
      .get(this.url)
      .then(response => {
        let {
          text: responseText,
          url: responseUrl
        } = response;

        this.log.info(`Fetched manifest from url: ${responseUrl}.`);

        return JSON.parse(responseText);
      }, xhr => {
        this.log.error(`Could not fetch manifest with url: ${xhr.responseURL}!`);
      });
  }
}

export default class Injector {
  constructor(injectInto, manifests, options = {}) {
    const {
      enableLogging = false
    } = options;

    this.log = new Log(
      getUrlParam('dactylographsy-enableLogging', enableLogging)
    );

    this.manifests = {};
    this.injectInto = injectInto;

    manifests.forEach(manifest => { this.manifests[manifest.package] = manifest; });

    this.options = options;
    this.prefix = options.prefix;
    this.order = options.order;
  }

  inject() {
    const flatten = list => list.reduce(
        (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
      ),
      injectIntoDOM = (dependencies, idx = 0) => {
        const elem = dependencies[idx];

        if (elem === undefined) { return; }
        else if (elem.getAttribute('data-dactylographsy-uncached-js')) {
          if (this.injectInto) {
            this.log.info('Injecting tag:', elem);

            this.injectInto.appendChild(elem);
          }

          elem.addEventListener('load', () => {
            injectIntoDOM(dependencies, ++idx);
          });

          elem.addEventListener('error', () => {
            injectIntoDOM(dependencies, ++idx);
          });
        } else {
          if (this.injectInto) { this.injectInto.appendChild(elem); }

          injectIntoDOM(dependencies, ++idx);
        }
      };

    return Promise.all(
      this.order.map(_package => {
        if (!this.manifests[_package]) {
          this.log.error(`Couldn\'t find package ${_package} from injection order.`);

          return Promise.reject();
        } else {
          return this.injectManifest(this.manifests[_package]);
        }
      })
    ).then(manifests => {
      const dependencies = flatten(manifests);

      injectIntoDOM(dependencies);

      return Promise.resolve(dependencies);
    });
  }

  injectManifest(manifest) {
    let hashes = Object.keys(manifest.hashes);

    return Promise.all(hashes.map(hash => {
      let dependency = manifest.hashes[hash];
      let rootUrl;

      rootUrl = [manifest.rootUrl, manifest.packageUrl].filter(_url => {
        return (
          _url !== undefined &&
          _url !== null
        );
      }).join('/');

      return this.injectDependency(
        dependency,
        rootUrl
      );
    }));
  }

  injectDependency(dependency, rootUrl) {
    switch (dependency.extension) {
      case '.css':
        return new Css(
          undefined,
          this.options
        ).inject(
          this.urls(dependency, rootUrl)
        );
      case '.js':
        return new Js(
          undefined,
          this.options
        ).inject(
          this.urls(dependency, rootUrl)
        );
      default:
        Promise.resolve(false);
    }
  }

  basename(path) {
    return path.replace(/.*\/|\.[^.]*$/g, '');
  }

  urls(dependency, rootUrl = '') {
    let basename = this.basename(dependency.file);
    let url;

    // Filter out potential null values
    // passed in as various parts of an url.
    url = [this.prefix, rootUrl, dependency.path].filter(_url => {
      return (
        _url !== undefined &&
        _url !== null
      );
    }).join('/');

    return {
      id: dependency.id,
      printed: `/${url}/${basename}-${dependency.hash}${dependency.extension}`,
      raw: `/${url}/${basename}${dependency.extension}`,
      singularBy: `/${url}/${basename}${dependency.extension}`
    };
  }
}
