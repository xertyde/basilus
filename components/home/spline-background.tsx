"use client"

import Spline from '@splinetool/react-spline'

export default function SplineBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Spline 
        scene="https://my.spline.design/ai-x8V3rX1MlA7AgSeXI3pCIt7a/scene.splinecode"
        className="w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  )
}