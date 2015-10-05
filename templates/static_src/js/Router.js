/**
 *
 * @param {String} regexp
 * @param {*} components
 * @constructor
 */
var Route = function (regexp, components) {
    this.regexp = regexp;
    this.components = components;
    this.params = [];
};

/**
 *
 * @returns {*}
 */
Route.prototype.getRegexp = function () {
    var regexps = null;
    if ((regexps = /~(.*)?~(.*)?/i.exec(this.regexp)) != null) {
        var regexp = null;
        if (regexps[1]) {
            var flags = regexps[2] ? regexps[2] : '';
            regexp = regexps[1];

            var params = [];

            if ((params = regexp.match(/\(\?P<(.*?)>/ig)) != null) {
                this.params = params.map(function (param) {
                    return param.substring(4, param.length - 1)
                });
                regexp = regexp.replace(/\(\?P<(.*?)>/ig, '(');
            }
            return {regexp: new RegExp(regexp, flags)};
        }
        return null;
    }
    return null;
};

/**
 * @param {String} name
 * @returns {*}
 */
Route.prototype.getComponent = function (name) {
    return this.components[name] || '';
};

/**
 *
 * @param {Array} collection
 * @param {document.location} locations
 * @constructor
 */
var Routers = function (collection, locations) {
    this.collection = collection;
    this.locations = locations;
    this.requestParam = {};
    this.request = false;
    /**
     * @type {Route}
     */
    this.route = null;
};

/**
 *
 * @param {String} url
 * @param {String} search
 * @param {String} hash
 * @returns {Routers}
 */
Routers.prototype.setUrl = function (url, search, hash) {
    url = url + (search || '') + (hash || '');
    window.history.pushState({url: url}, document.title, url);
    this.match();
    return this;
};

/**
 *
 * @returns {Boolean}
 */
Routers.prototype.isRequest = function () {
    return this.request;
};

/**
 *
 * @returns {String}
 */
Routers.prototype.getUrl = function () {
    return this.locations.pathname + this.locations.search + this.locations.hash;
};

/**
 *
 *
 * @returns {String}
 */
Routers.prototype.getHash = function () {
    return this.locations.hash;
};


/**
 *
 * @returns {*}
 */
Routers.prototype.getRequestParamName = function (name, defaultParam) {
    defaultParam = defaultParam || null;
    return this.requestParam[name] ? this.requestParam[name] : defaultParam;
};

/**
 *
 * @returns {Routers.requestParam|*}
 */
Routers.prototype.getRequestParams = function () {
    return this.requestParam;
};

/**
 *
 * @returns {Routers}
 */
Routers.prototype.match = function () {
    var url = this.getUrl(),
        collectionLenght = this.collection.length;
    this.request = false;
    this.route = this.collection[0];
    this.requestParam = {};
    for (var i = 0; i < collectionLenght; i++) {
        var route = this.collection[i],
            routeReg = route.getRegexp();
        if (!routeReg || (routeReg && !routeReg.regexp.test(url))) {
            continue;
        }
        var params = url.match(routeReg.regexp).slice(1),
            iterator = 0,
            dict = {};
        params.map(function (item) {
            if (route.params[iterator]) {
                dict[route.params[iterator]] = item;
                iterator++;
            }
        });

        var argument = decodeURIComponent(location.search.substr(1)).split('&');
        argument.map(function (item) {
            item = item.split('=');
            dict[item.shift()] = item.join('=')
        });

        this.request = true;
        this.route = route;
        this.requestParam = dict;
        return this;
    }
    return this;
};

/**
 * @param {String} name
 * @returns {*}
 */
Routers.prototype.getComponent = function (name) {
    return this.route.getComponent(name);
};

/**
 *
 * @returns {Route}
 */
Routers.prototype.getRote = function () {
    return this.route;
};


var RouteCollection = [];
