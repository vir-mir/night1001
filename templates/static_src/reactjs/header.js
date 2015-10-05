var viewHeader = React.createClass({displayName: "viewHeader",
    render: function () {
        return (
            React.createElement("div", {className: "navbar navbar-inverse navbar-fixed-top"}, 
                React.createElement("div", {className: "container"}, 
                    React.createElement("div", {className: "navbar-header"}, 
                        React.createElement("a", {className: "navbar-brand", href: "#"}, "Джинни!"), 
                        React.createElement("p", {className: "navbar-text"}, "Джинни, выполняет ваши желания господин!")
                    )
                )
            )
        );
    }
});