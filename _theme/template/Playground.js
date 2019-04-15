import React from 'react';
import AMap from 'react-ld-amap';
require('../static/playground.less');

const InfoWindow = AMap.InfoWindow;

export default class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: true
    };

    this.amapEvents = {
      click: (e) => { this.loadRestaurant(e); }
    };
  }

  loadRestaurant(e) {
    const lnglat = e.lnglat;
    const longitude = lnglat.getLng();
    const latitude = lnglat.getLat();

  }

  renderMyLogo() {
    return <div className="react-ld-amap-icon">
      <a href="#">
        <i></i>
        <p>react-ld-amap</p>
      </a>
    </div>;
  }

  renderInfoWindow() {
    return <InfoWindow
      open={this.state.windowOpen}
      position={{longitude: 120, latitude: 30}}
    >
      <div>Hello Kitty</div>
    </InfoWindow>;
  }

  render() {
    return <div id="playground">
      <AMap events={this.amapEvents}>
        { this.renderMyLogo() }
        { this.renderInfoWindow() }
      </AMap>
    </div>;
  }
}
