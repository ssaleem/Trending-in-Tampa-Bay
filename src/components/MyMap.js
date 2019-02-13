import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'


const FS_API_ERR_FALLBACK = 'Sorry something went wrong with Foursquare API...';

class MyMap extends Component {

  constructor(props){
    super(props);
    this.state = {
      foursquareData: {}
    }
    // media query in JS for map styling
    this.x = window.matchMedia("(min-width: 768px)");
  }

  handleState = (title, photo, tip) => this.setState(prevState => {
      prevState.foursquareData[title] = { bestPhoto: photo, tip: tip };
      return { state: prevState }
    })

  componentDidMount(){
    // Google Maps API error handling registration
    window.gm_authFailure = this.props.mapError;
  }


  componentDidUpdate(prevProps){
    // Fetch venue deatils like top photo and top tip from Foursquare
    if(this.props.allLocations.length !== prevProps.allLocations.length){
      //Foursquare API credentials
      const CLIENT_ID = `${process.env.REACT_APP_FS_CLIENT_ID}`;
      const CLIENT_SECRET = `${process.env.REACT_APP_FS_CLIENT_SECRET}`;
      this.props.allLocations.forEach((location) => {
          fetch(`https://api.foursquare.com/v2/venues/${location.vid}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323`)
          .then(response => response.json())
          .then(response => {
              if(response.meta.code === 429) {
                return Promise.reject(new Error('Foursquare Free Account Quota exceeded'));
              }
              else {
                this.handleState(location.title, `${response.response.venue.bestPhoto.prefix}300${response.response.venue.bestPhoto.suffix}`, response.response.venue.tips.groups[0].items[0].text);
              }
          })
          .catch(e => console.log(e));
      });
    }
  }

  // Close infowindow (if one is open) on map click
  onMapClick = () => this.props.showingInfoWindow && this.props.closeInfoWindow()

  // Calculate map bounds based on venues
  mapBounds(){
    let bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < this.props.allLocations.length; i++) {
      bounds.extend(this.props.allLocations[i].location);
    }
    return bounds;
  }

  render() {
    const {visibleLocations, markerClick, refs, activeMarker, showingInfoWindow, closeInfoWindow, selectedPlace, mapLoaded} = this.props;
    const bounds = this.mapBounds();
    const center = bounds.getCenter();
    const styleMap = {
      position: 'absolute',
      width: '100%',
      height: 'inherit'
    }
    return (
      <div className="mapDiv">{
        !mapLoaded ? <p className="gmap-fail">Ideally, you should see a map here! <br/>No map??? :( Sorry something went wrong with Google Maps API.</p> :
        <Map
          google={this.props.google}
          zoom={11}
          initialCenter={center}
          bounds={bounds}
          onClick={this.onMapClick}
          style={styleMap}
          mapTypeControl={false}
          streetViewControl={false}
          zoomControl={this.x.matches ? true: false}>
          {visibleLocations.map((location, index) => (
            <Marker
                title={location.title}
                position={location.location}
                key={index}
                icon={(showingInfoWindow && selectedPlace.title === location.title)? './img/starb.png' : './img/starg.png'}
                onClick={markerClick}
                ref={refs[index]}
                className={"marker"}
                />
            )
          )}
          <InfoWindow
            marker={activeMarker}
            visible={showingInfoWindow}
            onClose={closeInfoWindow}>
              <div className="infowindow">
                <h3>{selectedPlace.title}</h3>
                <div className="attraction-info">
                  {/* if Foursquare fetch is not complete or fetch failed, load fallback image and fallback text*/}
                  <img src={(this.state.foursquareData[selectedPlace.title] && this.state.foursquareData[selectedPlace.title]['bestPhoto']) || './img/ohno.jpg'} alt={`${selectedPlace.title}`} className="attraction-img"/>
                  <p className="attraction-tip"><FontAwesomeIcon icon={faLightbulb} className="bulb-logo"/>  {(this.state.foursquareData[selectedPlace.title] && this.state.foursquareData[selectedPlace.title]['tip']) || FS_API_ERR_FALLBACK}</p>
                </div>
              </div>
          </InfoWindow>

        </Map>}
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_GM_API_KEY}`
})(MyMap)
