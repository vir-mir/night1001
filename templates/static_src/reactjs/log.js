var ViewLog = React.createClass({displayName: "ViewLog",
    render: function () {
        if (this.props.step['queue']) {
            return React.createElement(ViewQueue, {query: this.props.query})
        } else if (this.props.step['tag']) {
            return React.createElement(ViewSiteTag, {step: this.props.step})
        } else if (this.props.step['urls']) {
            return React.createElement(ViewSiteHeader, {step: this.props.step, save: this.props.step['save']})
        } else if (this.props.step['text']) {
            return React.createElement(ViewText, {text: this.props.step.text})
        } else if (this.props.step['save_next']) {
            return React.createElement(ViewTextNext, null)
        }
        return null;
    }
});

var ViewQueue = React.createClass({displayName: "ViewQueue",
    render: function () {
        return React.createElement("p", {className: "text-primary"}, 
            React.createElement("strong", null, "Желание, поставленно в очередь"), ": ", this.props.query
        );
    }
});

var ViewSiteTag = React.createClass({displayName: "ViewSiteTag",
    render: function () {
        var tags = [];
        for (var url in this.props.step.urls) {
            tags.push(React.createElement("p", {className: "text-warning"}, "Теги ", this.props.step.tag, ", с сайта ", url, ", ", this.props.step.urls[url].join(', ')));
        }
        return React.createElement("div", null, tags);
    }
});

var ViewSiteHeader = React.createClass({displayName: "ViewSiteHeader",
    render: function () {
        var tags = [];

        for (var url in this.props.step.urls) {
            tags.push(React.createElement("p", {className: "text-warning"}, "Заголовки, с сайта ", url, ", ", this.props.step.urls[url]));
        }
        if (this.props.save) {
            tags.push(React.createElement(ViewText, {text: "заголовков"}))
        }
        return React.createElement("div", null, tags);
    }
});


var ViewText = React.createClass({displayName: "ViewText",
    render: function () {
        return React.createElement("p", {className: "text-warning"}, 
            React.createElement("strong", null, "Я, сохранил текст"), ": ", this.props.text
        );
    }
});

var ViewTextNext = React.createClass({displayName: "ViewTextNext",
    render: function () {
        return React.createElement("p", {className: "text-success"}, "Я, сохраню следующий запрос на заголовки");
    }
});