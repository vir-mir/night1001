var ViewErrorMs = React.createClass({
    render: function () {
        return (
            <div className="alert alert-danger" role="alert">
                {this.props.text}
            </div>
        );
    }
});