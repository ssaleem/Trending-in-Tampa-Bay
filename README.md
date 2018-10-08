# Things to Do in Tampa Bay

A Google Maps application displaying Tampa Bay attraction; this project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). The site is fully responsive and gives a sidebar with a list of the locations that can be clicked on or filtered based on their category. The sidebar is hidden by default on smaller screens and a hamburger icon click shows/hides sidebar. The service worker is implemented in the production build and the deployed app can be found [here](https://ssaleem.github.io/Neighborhood-Map).

## APIs and Packages

* To render map a Google Map React component from [google-maps-react](https://www.npmjs.com/package/google-maps-react) package is used.
* Location photo and tip shown in infowindow pop up is retrieved from [Foursquare](https://developer.foursquare.com/docs/api) API

## How to Run

To test the project without service worker.

* Install all project dependencies with `npm install`
* Start the application server with `npm start`

To see service worker in action

* Run `npm run build`
* Run `serve -s build`
* Navigate to `http://localhost:5000/`
