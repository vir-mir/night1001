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