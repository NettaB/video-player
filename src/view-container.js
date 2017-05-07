import React from 'react';
import ReactDOM from 'react-dom';

const ListElement = (props) => {
    return (
        <li className="list-item" onClick={props.onClick}>
            {props.item.image && <img src={props.item.image} className="item-image" alt="series"/>}
            <span className="item-title">{props.item.title}</span>
        </li>
    )
};

const xhr = new XMLHttpRequest();

class ViewContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            url: `http://tvdb.reali.com/series`,
            childrenList: []
        };
        this.renderChildElements = this.renderChildElements.bind(this);
    }

    componentWillMount() {
        if(this.props.type === 'series') {
            fetch(this.state.url)
                .then(response =>{return response.json()})
                    .then(j => {this.setState({childrenList:j})})
                .catch(error => {console.log(error)})
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.type === 'episodes' && nextProps.seriesID !== this.props.seriesID) {
            xhr.abort();
            xhr.open('GET', this.state.url +  `/${nextProps.seriesID}`);
            xhr.onreadystatechange = () => {
                if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
                    this.setState({childrenList: JSON.parse(xhr.response)});
                }
            };
            xhr.onerror = function (error) {console.log('I has error!', error)};
            xhr.send();
        }
    }

    componentDidUpdate() {
        if(this.props.type === 'player' && this.props.videoUrl) {
            ReactDOM.findDOMNode(this.refs.player).load();
        }
    }

    renderContent() {
        if(this.props.type === 'player' && this.props.videoUrl) {
            return(
                <div className="video-container">
                    <video autoPlay ref="player"
                           poster={this.props.poster}>
                        <source src={this.props.videoUrl} type="video/mp4"/>
                    </video>
                </div>
            )
        }
        if(this.state.childrenList) {
            return (
                <ul>
                    {this.state.childrenList.map(this.renderChildElements)}
                </ul>
            )
        }
    }

    renderChildElements(item) {
        return <ListElement item={item} key={item.id}
                            onClick={() => {this.props.onItemClick(this.props.type, item)}}/>
    }

    render(){
        return (
            <div className={`container ${this.props.type}`}>
                <h3>{this.props.type}</h3>
                {this.renderContent()}
            </div>
        )

    }
}

export default ViewContainer