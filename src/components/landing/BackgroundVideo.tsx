import React from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4'

export const BackgroundVideo: React.FC = () => {
  return (
    <div className="bg-video-container" aria-hidden="true">
      <video
        className="bg-video-element"
        autoPlay
        muted
        loop
        playsInline
        src={VIDEO_URL}
      />
    </div>
  )
}
