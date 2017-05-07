import React, { Component } from 'react';
import ViewContainer from './view-container';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            chosenSeriesID: null,
            chosenEpisodeURL: '',
            seriesImg: ''
        };
        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick(type, item) {
        switch(type) {
            case 'series':
                this.setState({chosenSeriesID: item.id, chosenEpisodeURL: '', seriesImg: item.image});
                break;
            case 'episodes':
                this.setState({chosenEpisodeURL: item.url});
                break;
            default:
                return;
        }
    }
  render() {
    return (
      <div className="App">
          <ViewContainer type="series" onItemClick={this.onItemClick}/>
          <ViewContainer type="episodes" onItemClick={this.onItemClick}
                         seriesID={this.state.chosenSeriesID}/>
          <ViewContainer type="player" videoUrl={this.state.chosenEpisodeURL} poster={this.state.seriesImg}/>
      </div>
    );
  }
}

export default App;
