import React, {Component} from 'react';
import PropTypes from 'prop-types';

class List extends Component {
  static propTypes = {
    selectedPlace: PropTypes.object,
    attractions: PropTypes.array.isRequired,
    listClick: PropTypes.func.isRequired,
  };
  render () {
    const {selectedPlace, attractions, listClick} = this.props;
    return (
      <ol className="attractions-list">
        {attractions.map ((attraction, index) => (
          <li key={index} tabIndex="0" onClick={() => listClick (index)}>
            <div>
              <img
                src={attraction.icon}
                alt={`${attraction.category} icon`}
                className="cat-logo"
              />
              <span>{attraction.title}</span>
            </div>
            <div
              className={`${selectedPlace.title === attraction.title ? 'address-show' : 'address-hide'}`}
            >
              {attraction.address}
            </div>
          </li>
        ))}
      </ol>
    );
  }
}

export default List;
