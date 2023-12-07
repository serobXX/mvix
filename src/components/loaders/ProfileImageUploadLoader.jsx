import React from 'react'
import ContentLoader from 'react-content-loader'

const ProfileImageUploadLoader = ({ height = 276 }) => {
  return (
    <ContentLoader style={{ width: '100%', height }}>
      <rect x="0" y="0" width="100%" height="100%" />
    </ContentLoader>
  )
}

export default ProfileImageUploadLoader
