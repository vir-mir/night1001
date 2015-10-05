var ViewMain = React.createClass({

    getInitialState: function () {
        return {
            name: '',
            error: null,
            load: false,
            action: '/user/add/'
        };
    },

    handleSubmit: function () {
        var name = React.findDOMNode(this.refs.name).value;
        if (name.trim()) {
            this.setState(React.addons.update(this.state, {name: {$set: name}, error: {$set: null}, load: {$set: true}}));
            ajax.post(this.state.action, {name: name}).then(function (response) {
                document.location.href = '/ginny/' + response.user + '/'
            })
        } else {
            this.setState(React.addons.update(this.state, {error: {$set: 'Заполните имя!'}, name: {$set: ''}, load: {$set: false}}));
        }
        return false;
    },

    render: function () {
        var error = null,
            footer = null;

        if (this.state.error) {
            error = <ViewErrorMs text={this.state.error} />
        }

        if (!this.state.load) {
            footer = (
                <div className="panel-footer text-right">
                    <button type="submit" className="btn btn-primary">Поттери лампу</button>
                </div>
            )
        }

        return (
            <div className="container">
                <form method="post" action={this.state.action} onSubmit={this.handleSubmit}>
                    <div className="panel panel-default">
                        <div className="panel-heading">Вы, нашли лампу и теперь, Джинн, исполнит ваши желания, но сначала, представьтесь!</div>
                        <div className="panel-body">
                            {error}
                            <input type="name" ref="name" defaultValue={this.state.name} className="form-control" placeholder="Ваше, имя, господин" />
                        </div>
                        {footer}
                    </div>
                </form>
            </div>
        );
    }
});