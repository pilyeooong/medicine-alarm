import React from 'react';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

export default function AppLogo({ size = 200 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* 배경 원 */}
      <Circle cx="100" cy="100" r="95" fill="#5B9BD5" />

      {/* 알약 */}
      <G>
        {/* 알약 왼쪽 (밝은 색) */}
        <Path
          d="M 70 80 Q 60 100 70 120 L 100 120 L 100 80 Z"
          fill="#FFFFFF"
        />
        {/* 알약 오른쪽 (약간 어두운 색) */}
        <Path
          d="M 100 80 L 100 120 Q 110 100 100 80"
          fill="#E8F4FB"
        />
        {/* 알약 테두리 */}
        <Path
          d="M 70 80 Q 60 100 70 120 Q 110 100 70 80"
          fill="none"
          stroke="#4A8BC2"
          strokeWidth="3"
        />
        {/* 알약 중앙 선 */}
        <Path
          d="M 100 80 L 100 120"
          stroke="#4A8BC2"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
      </G>

      {/* 시계/알람 아이콘 */}
      <G transform="translate(120, 60)">
        {/* 시계 외곽 */}
        <Circle cx="20" cy="20" r="18" fill="#FFFFFF" stroke="#4A8BC2" strokeWidth="2.5" />

        {/* 시계 바늘들 */}
        {/* 시침 */}
        <Path
          d="M 20 20 L 20 12"
          stroke="#4A8BC2"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* 분침 */}
        <Path
          d="M 20 20 L 28 20"
          stroke="#4A8BC2"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 시계 중심점 */}
        <Circle cx="20" cy="20" r="2" fill="#4A8BC2" />

        {/* 알람 벨 */}
        <Path
          d="M 10 8 L 8 4"
          stroke="#FF6B6B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Path
          d="M 30 8 L 32 4"
          stroke="#FF6B6B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </G>

      {/* 하단 텍스트 */}
      <G transform="translate(100, 160)">
        <Rect x="-45" y="-12" width="90" height="24" rx="12" fill="#FFFFFF" opacity="0.9" />
      </G>
    </Svg>
  );
}
