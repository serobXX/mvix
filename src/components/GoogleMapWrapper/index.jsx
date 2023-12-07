import React from 'react'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { withTheme } from '@material-ui/core'

import singleLocationIcon from '/src/assets/icons/single-location.svg'
import PropTypes from 'constants/propTypes'
import { config } from 'constants/app'
import {
  darkMapStyles,
  grayMapStyles,
  lightMapStyles
} from 'constants/mapConstants'

const libraries = ['geometry', 'drawing', 'places']

const GoogleMapWrapper = ({
  center,
  zoom = 8,
  coords,
  mapContainerClassName,
  theme,
  onLoad,
  onClick,
  children,
  isGrayScaleTheme = false
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.GOOGLE_API_KEY,
    libraries
  })

  const options = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: isGrayScaleTheme
      ? grayMapStyles
      : theme?.type === 'dark'
      ? darkMapStyles
      : lightMapStyles
  }

  const handleOnLoad = map => {
    if (onLoad) {
      onLoad(map)
    }
  }

  if (!isLoaded) {
    return null
  }

  return (
    <GoogleMap
      onLoad={handleOnLoad}
      zoom={zoom}
      options={options}
      center={center}
      coords={coords}
      defaultOptions={{ mapTypeControl: false }}
      mapContainerClassName={mapContainerClassName}
      onClick={onClick}
    >
      {!children && center ? (
        <Marker
          position={center}
          icon={{
            url: singleLocationIcon,
            scaledSize: window.google?.maps
              ? new window.google.maps.Size(32, 32)
              : {
                  width: 32,
                  height: 32
                }
          }}
        />
      ) : (
        children
      )}
    </GoogleMap>
  )
}

const coordinatePropTypeShape = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
})

GoogleMapWrapper.propTypes = {
  mapContainerClassName: PropTypes.string,
  coords: PropTypes.oneOfType([
    PropTypes.arrayOf(coordinatePropTypeShape),
    coordinatePropTypeShape
  ])
}

export default withTheme(GoogleMapWrapper)
