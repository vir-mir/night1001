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

/**
 * Created by vir-mir on 05.10.15.
 */

/**
 *
 * @type {Array}
 */
RouteCollection = [
    new Route('~^/404/?(\\?.*)?$~', {main: ViewError404}),
    new Route('~^/?(\\?.*)?$~', {main: ViewMain}),
    new Route('~^/ginny/(?P<user_id>\\d+)/?(\\?.*)?$~', {main: ViewDialog}),
];

;(function(context,name,definition){
    if(typeof module!='undefined' && module.exports){
        module.exports=definition;
    }
    else if(typeof define=='function' && define.amd){
        define(definition);
    }
    else{
        context[name]=definition;
    }
}(this,'ajax',function(){

    var win=window,
        doc=document,
        before,
    // Default response type for XDR in auto mode
        defaultXdrResponseType='json',
    // Variables for limit mechanism
        limit=null,
        requests=0,
        request_stack=[],
    // Get XMLHttpRequest object
        getXHR=function(){
            return win.XMLHttpRequest?
                new XMLHttpRequest():
                new ActiveXObject('Microsoft.XMLHTTP');
        },
    // Guess XHR version
        xhr2=(getXHR().responseType===''),

    // Core function
        ajax=function(method,url,data,options,before){

            // Format
            method=method.toUpperCase();
            data=data || null;
            options=options || {};

            // Define variables
            var nativeResponseParsing=false,
                crossOrigin,
                xhr,
                xdr=false,
                timeoutInterval,
                aborted=false,
                retries=0,
                headers={},
                mimeTypes={
                    text: '*/*',
                    xml: 'text/xml',
                    json: 'application/json',
                    post: 'application/x-www-form-urlencoded'
                },
                accept={
                    text: '*/*',
                    xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
                    json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
                },
                contentType='Content-Type',
                vars='',
                i,j,
                serialized,
                then_stack=[],
                catch_stack=[],
                complete_stack=[],
                response,
                success,
                error,
                func,

            // Define promises
                promises={
                    then:function(func){
                        if(options.async){
                            then_stack.push(func);
                        }
                        else if(success){
                            func.call(xhr,response);
                        }
                        return promises;
                    },
                    'catch':function(func){
                        if(options.async){
                            catch_stack.push(func);
                        }
                        else if(error){
                            func.call(xhr,response);
                        }
                        return promises;
                    },
                    complete:function(func){
                        if(options.async){
                            complete_stack.push(func);
                        }
                        else{
                            func.call(xhr);
                        }
                        return promises;
                    }
                },
                promises_limit={
                    then:function(func){
                        request_stack[request_stack.length-1].then.push(func);
                        return promises_limit;
                    },
                    'catch':function(func){
                        request_stack[request_stack.length-1]['catch'].push(func);
                        return promises_limit;
                    },
                    complete:function(func){
                        request_stack[request_stack.length-1].complete.push(func);
                        return promises_limit;
                    }
                },

            // Handle the response
                handleResponse=function(){
                    // Verify request's state
                    // --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
                    if(aborted){
                        return;
                    }
                    // Prepare
                    var i,req,p,responseType;
                    --requests;
                    // Clear the timeout
                    clearInterval(timeoutInterval);
                    // Launch next stacked request
                    if(request_stack.length){
                        req=request_stack.shift();
                        p=ajax(req.method,req.url,req.data,req.options,req.before);
                        for(i=0;func=req.then[i];++i){
                            p.then(func);
                        }
                        for(i=0;func=req['catch'][i];++i){
                            p['catch'](func);
                        }
                        for(i=0;func=req.complete[i];++i){
                            p.complete(func);
                        }
                    }
                    // Handle response
                    try{
                        // Verify status code
                        // --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
                        if('status' in xhr && !/^2|1223/.test(xhr.status)){
                            throw xhr.status+' ('+xhr.statusText+')';
                        }
                        // Init
                        var responseText='responseText',
                            responseXML='responseXML',
                            parseError='parseError';
                        // Process response
                        if(nativeResponseParsing && 'response' in xhr && xhr.response!==null){
                            response=xhr.response;
                        }
                        else if(options.responseType=='document'){
                            var frame=doc.createElement('iframe');
                            frame.style.display='none';
                            doc.body.appendChild(frame);
                            frame.contentDocument.open();
                            frame.contentDocument.write(xhr.response);
                            frame.contentDocument.close();
                            response=frame.contentDocument;
                            doc.body.removeChild(frame);
                        }
                        else{
                            // Guess response type
                            responseType=options.responseType;
                            if(responseType=='auto'){
                                if(xdr){
                                    responseType=defaultXdrResponseType;
                                }
                                else{
                                    switch(xhr.getResponseHeader(contentType)){
                                        case mimeTypes.json:
                                            responseType='json';
                                            break;
                                        case mimeTypes.xml:
                                            responseType='xml';
                                            break;
                                        default:
                                            responseType='text';
                                    }
                                }
                            }
                            // Handle response type
                            switch(responseType){
                                case 'json':
                                    try{
                                        if('JSON' in win){
                                            response=JSON.parse(xhr[responseText]);
                                        }
                                        else{
                                            response=eval('('+xhr[responseText]+')');
                                        }
                                    }
                                    catch(e){
                                        throw "Error while parsing JSON body : "+e;
                                    }
                                    break;
                                case 'xml':
                                    // Based on jQuery's parseXML() function
                                    try{
                                        // Standard
                                        if(win.DOMParser){
                                            response=(new DOMParser()).parseFromString(xhr[responseText],'text/xml');
                                        }
                                        // IE<9
                                        else{
                                            response=new ActiveXObject('Microsoft.XMLDOM');
                                            response.async='false';
                                            response.loadXML(xhr[responseText]);
                                        }
                                    }
                                    catch(e){
                                        response=undefined;
                                    }
                                    if(!response || !response.documentElement || response.getElementsByTagName('parsererror').length){
                                        throw 'Invalid XML';
                                    }
                                    break;
                                default:
                                    response=xhr[responseText];
                            }
                        }
                        // Execute 'then' stack
                        success=true;
                        p=response;
                        if(options.async){
                            for(i=0;func=then_stack[i];++i){
                                p=func.call(xhr,p);
                            }
                        }
                    }
                    catch(e){
                        error=true;
                        // Execute 'catch' stack
                        if(options.async){
                            for(i=0;func=catch_stack[i];++i){
                                func.call(xhr, e, url);
                            }
                        }
                    }
                    // Execute complete stack
                    if(options.async){
                        for(i=0;func=complete_stack[i];++i){
                            func.call(xhr);
                        }
                    }
                },

            // Recursively build the query string
                buildData=function(data,key){
                    var res=[],
                        enc=encodeURIComponent,
                        p;
                    if(typeof data==='object' && data!=null) {
                        for(p in data) {
                            if(data.hasOwnProperty(p)) {
                                var built=buildData(data[p],key?key+'['+p+']':p);
                                if(built!==''){
                                    res=res.concat(built);
                                }
                            }
                        }
                    }
                    else if(data!=null && key!=null){
                        res.push(enc(key)+'='+enc(data));
                    }
                    return res.join('&');
                };

            // New request
            ++requests;

            // Normalize options
            options.async='async' in options?!!options.async:true;
            options.cache='cache' in options?!!options.cache:(method!='GET');
            options.dataType='dataType' in options?options.dataType.toLowerCase():'post';
            options.responseType='responseType' in options?options.responseType.toLowerCase():'auto';
            options.user=options.user || '';
            options.password=options.password || '';
            options.withCredentials=!!options.withCredentials;
            options.timeout=options.timeout?parseInt(options.timeout,10):3000;
            options.retries=options.retries?parseInt(options.retries,10):3;

            // Guess if we're dealing with a cross-origin request
            i=url.match(/\/\/(.+?)\//);
            crossOrigin=i && i[1]?i[1]!=location.host:false;

            // Prepare data
            if('ArrayBuffer' in win && data instanceof ArrayBuffer){
                options.dataType='arraybuffer';
            }
            else if('Blob' in win && data instanceof Blob){
                options.dataType='blob';
            }
            else if('Document' in win && data instanceof Document){
                options.dataType='document';
            }
            else if('FormData' in win && data instanceof FormData){
                options.dataType='formdata';
            }
            var q_data = '';
            if (method == 'GET') {
                for (var key in data) {
                    if (q_data != "") {
                        q_data += "&";
                    }
                    q_data += key + "=" + data[key];
                }
            }
            switch(options.dataType){
                case 'json':
                    data=JSON.stringify(data);
                    break;
                case 'post':
                    data=buildData(data);
            }

            // Prepare headers
            if(options.headers){
                var format=function(match,p1,p2){
                    return p1+p2.toUpperCase();
                };
                for(i in options.headers){
                    headers[i.replace(/(^|-)([^-])/g,format)]=options.headers[i];
                }
            }
            if(!headers[contentType] && method!='GET'){
                if(options.dataType in mimeTypes){
                    if(mimeTypes[options.dataType]){
                        headers[contentType]=mimeTypes[options.dataType];
                    }
                }
            }
            if(!headers.Accept){
                headers.Accept=(options.responseType in accept)?accept[options.responseType]:'*/*';
            }
            if(!crossOrigin && !headers['X-Requested-With']){ // because that header breaks in legacy browsers with CORS
                headers['X-Requested-With']='XMLHttpRequest';
            }

            // Prepare URL
            if(method=='GET'){
                vars+=q_data;
            }
            if(!options.cache){
                if(vars){
                    vars+='&';
                }
                vars+='__t='+(+new Date());
            }
            if(vars){
                url+=(/\?/.test(url)?'&':'?')+vars;
            }

            // The limit has been reached, stock the request
            if(limit && requests==limit){
                request_stack.push({
                    method	: method,
                    url		: url,
                    data	: data,
                    options	: options,
                    before	: before,
                    then	: [],
                    'catch'	: [],
                    complete: []
                });
                return promises_limit;
            }

            // Send the request
            var send=function(){
                // Get XHR object
                xhr=getXHR();
                if(crossOrigin){
                    if(!('withCredentials' in xhr) && win.XDomainRequest){
                        xhr=new XDomainRequest(); // CORS with IE8/9
                        xdr=true;
                        if(method!='GET' && method!='POST'){
                            method='POST';
                        }
                    }
                }
                // Open connection
                if(xdr){
                    xhr.open(method,url);
                }
                else{
                    xhr.open(method,url,options.async,options.user,options.password);
                    if(xhr2 && options.async){
                        xhr.withCredentials=options.withCredentials;
                    }
                }
                // Set headers
                if(!xdr){
                    for(var i in headers){
                        xhr.setRequestHeader(i,headers[i]);
                    }
                }
                // Verify if the response type is supported by the current browser
                if(xhr2 && options.responseType!='document'){ // Don't verify for 'document' since we're using an internal routine
                    try{
                        xhr.responseType=options.responseType;
                        nativeResponseParsing=(xhr.responseType==options.responseType);
                    }
                    catch(e){}
                }
                // Plug response handler
                if(xhr2 || xdr){
                    xhr.onload=handleResponse;
                }
                else{
                    xhr.onreadystatechange=function(){
                        if(xhr.readyState==4){
                            handleResponse();
                        }
                    };
                }
                // Override mime type to ensure the response is well parsed
                if(options.responseType!=='auto' && 'overrideMimeType' in xhr){
                    xhr.overrideMimeType(mimeTypes[options.responseType]);
                }
                // Run 'before' callback
                if(before){
                    before.call(xhr);
                }
                // Send request
                if(xdr){
                    setTimeout(function(){ // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
                        xhr.send(method!='GET'?data:null);
                    },0);
                }
                else{
                    xhr.send(method!='GET'?data:null);
                }
            };

            // Timeout/retries
            var timeout=function(){
                timeoutInterval=setTimeout(function(){
                    aborted=true;
                    xhr.abort();
                    if(!options.retries || ++retries!=options.retries){
                        aborted=false;
                        timeout();
                        send();
                    }
                    else{
                        aborted=false;
                        error=true;
                        response='Timeout ('+url+')';
                        if(options.async){
                            for(i=0;func=catch_stack[i];++i){
                                func.call(xhr,response);
                            }
                        }
                    }
                },options.timeout);
            };

            // Start the request
            timeout();
            send();

            // Return promises
            return promises;

        };

    // Return external ajax object
    var create=function(method){
            return function(url,data,options){
                var b=before;
                before=null;
                return ajax(method,url,data,options,b);
            };
        },
        obj={
            before: function(callback){
                before=callback;
                return obj;
            },
            get: create('GET'),
            post: create('POST'),
            put: create('PUT'),
            'delete': create('DELETE'),
            xhr2: xhr2,
            limit: function(by){
                limit=by;
            },
            setDefaultXdrResponseType: function(type){
                defaultXdrResponseType=type.toLowerCase();
            }
        };
    return obj;

}()));

var Home = React.createClass({
    displayName: "Quest",

    getInitialState: function () {
        return {
            load: true
        };
    },

    render: function () {

        var
            header = this.props.router.getComponent('header'),
            left = this.props.router.getComponent('left'),
            main = this.props.router.getComponent('main'),
            right = this.props.router.getComponent('right'),
            footer = this.props.router.getComponent('footer'),
            data = {
                router: this.props.router,
                state_root: this.state
            };

        return React.createElement("div",
            {id: "content"},
            header ? React.createElement(header, data) : React.createElement(viewHeader, data),
            left ? React.createElement(left, data) : null,
            right ? React.createElement(right, data) : null,
            main ? React.createElement(main, data) : null,
            footer ? React.createElement(footer, data) : null
        );
    }
});


window.addEventListener('load', function () {
    var router = new Routers(RouteCollection, window.document.location);

    React.render(
        React.createElement(
            Home, {router: router.match()}
        ),
        document.getElementById('wrapper')
    );
});