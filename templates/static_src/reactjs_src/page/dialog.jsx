var ViewDialog = React.createClass({

    getInitialState: function () {
        return {
            user_id: this.props.router.getRequestParamName('user_id'),
            steps: window['LOGS'] ? LOGS : [],
            query: '',
            error: null,
            load: false
        };
    },

    componentDidMount: function () {
        this.socket_open();
    },

    socket_open: function () {
        var self = this;

        try {
            var url = "ws://localhost:8898/ginny_io";
            this.socket = window['MozWebSocket'] ? new MozWebSocket(url) : new WebSocket(url);

            this.socket.onopen = function () {
            };

            this.socket.onerror = function (e) {
                console.log(e)
            };

            this.socket.onmessage = function (e) {
                var data = JSON.parse(e.data);
                if (data['error']) {
                    self.setState(React.addons.update(self.state, {error: {$set: data.error}, query: {$set: ''}, load: {$set: false}}));
                } else if (data['errors']){
                    self.setState(React.addons.update(self.state, {error: {$set: data.errors}, query: {$set: ''}, load: {$set: false}}));
                } else {
                    self.setState(React.addons.update(self.state, {steps: {$push: [data]}, load: {$set: false}}));
                }
            };
        } catch (e) {
            console.error(e.message)
        }
    },


    handleSubmit: function () {
        var query = React.findDOMNode(this.refs.query).value;
        if (query.trim()) {
            this.setState(React.addons.update(this.state, {query: {$set: query}, error: {$set: null}, load: {$set: true}}));
            var data = {
                event: 'query',
                query: query,
                session: this.state.user_id
            };
            this.socket.send(JSON.stringify(data));
        } else {
            this.setState(React.addons.update(this.state, {error: {$set: 'Ваше желание пустое?'}, query: {$set: ''}, load: {$set: false}}));
        }
        return false;
    },

    render: function () {
        var error = null,
            footer = null,
            self = this;

        if (this.state.error) {
            error = <ViewErrorMs text={this.state.error} />
        }

        if (!this.state.load) {
            footer = (
                <div className="panel-footer text-right">
                    <button type="submit" className="btn btn-primary">Желаю</button>
                </div>
            )
        }

        var steps = this.state.steps.slice();
        steps.reverse();

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4">
                        <div className="panel panel-default">
                            <form onSubmit={this.handleSubmit}>
                                <div className="panel-heading">Ваше желание!</div>
                                <div className="panel-body">
                                    {error}
                                    <input type="text" ref="query" className="form-control" defaultValue={this.state.query} placeholder="Джинн, ..." />
                                </div>
                                {footer}
                            </form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="well">{steps.map(function (step) {
                            return <ViewLog step={step} query={self.state.query} />
                        })}</div>
                    </div>
                </div>
            </div>
        );
    }
});