var ViewErrorMs = React.createClass({displayName: "ViewErrorMs",
    render: function () {
        return (
            React.createElement("div", {className: "alert alert-danger", role: "alert"}, 
                this.props.text
            )
        );
    }
});