var ViewMain = React.createClass({displayName: "ViewMain",

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
            error = React.createElement(ViewErrorMs, {text: this.state.error})
        }

        if (!this.state.load) {
            footer = (
                React.createElement("div", {className: "panel-footer text-right"}, 
                    React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Поттери лампу")
                )
            )
        }

        return (
            React.createElement("div", {className: "container"}, 
                React.createElement("form", {method: "post", action: this.state.action, onSubmit: this.handleSubmit}, 
                    React.createElement("div", {className: "panel panel-default"}, 
                        React.createElement("div", {className: "panel-heading"}, "Вы, нашли лампу и теперь, Джинн, исполнит ваши желания, но сначала, представьтесь!"), 
                        React.createElement("div", {className: "panel-body"}, 
                            error, 
                            React.createElement("input", {type: "name", ref: "name", defaultValue: this.state.name, className: "form-control", placeholder: "Ваше, имя, господин"})
                        ), 
                        footer
                    )
                )
            )
        );
    }
});