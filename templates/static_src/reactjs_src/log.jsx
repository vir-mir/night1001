var ViewLog = React.createClass({
    render: function () {
        if (this.props.step['queue']) {
            return <ViewQueue query={this.props.query} />
        } else if (this.props.step['tag']) {
            return <ViewSiteTag step={this.props.step} />
        } else if (this.props.step['urls']) {
            return <ViewSiteHeader step={this.props.step} save={this.props.step['save']} />
        } else if (this.props.step['text']) {
            return <ViewText text={this.props.step.text} />
        } else if (this.props.step['save_next']) {
            return <ViewTextNext />
        }
        return null;
    }
});

var ViewQueue = React.createClass({
    render: function () {
        return <p className="text-primary">
            <strong>Желание, поставленно в очередь</strong>: {this.props.query}
        </p>;
    }
});

var ViewSiteTag = React.createClass({
    render: function () {
        var tags = [];
        for (var url in this.props.step.urls) {
            tags.push(<p className="text-warning">Теги {this.props.step.tag}, с сайта {url}, {this.props.step.urls[url].join(', ')}</p>);
        }
        return <div>{tags}</div>;
    }
});

var ViewSiteHeader = React.createClass({
    render: function () {
        var tags = [];

        for (var url in this.props.step.urls) {
            tags.push(<p className="text-warning">Заголовки, с сайта {url}, {this.props.step.urls[url]}</p>);
        }
        if (this.props.save) {
            tags.push(<ViewText text="заголовков" />)
        }
        return <div>{tags}</div>;
    }
});


var ViewText = React.createClass({
    render: function () {
        return <p className="text-warning">
            <strong>Я, сохранил текст</strong>: {this.props.text}
        </p>;
    }
});

var ViewTextNext = React.createClass({
    render: function () {
        return <p className="text-success">Я, сохраню следующий запрос на заголовки</p>;
    }
});