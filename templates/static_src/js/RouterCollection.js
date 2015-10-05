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