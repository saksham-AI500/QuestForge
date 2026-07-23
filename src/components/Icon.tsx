import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, Line } from 'react-native-svg';

export type IconName =
  | 'flag' | 'check-circle' | 'award' | 'medal' | 'zap' | 'flame' | 'trending-up'
  | 'book-open' | 'book' | 'code' | 'dumbbell' | 'heart' | 'target' | 'shield'
  | 'star' | 'crown' | 'sword' | 'compass' | 'seedling' | 'briefcase' | 'user'
  | 'plus' | 'edit' | 'trash' | 'chevron-right' | 'chevron-left' | 'x' | 'check'
  | 'home' | 'list' | 'user-circle' | 'bar-chart' | 'settings' | 'calendar'
  | 'moon' | 'sun' | 'bell' | 'clock';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const paths: Record<IconName, React.ReactElement> = {
  flag: <Path d="M4 21V4h13l-2.5 4L17 12H4" fill="none" strokeLinejoin="round" />,
  'check-circle': (
    <>
      <Circle cx="12" cy="12" r="9" fill="none" />
      <Path d="M8 12l2.5 2.5L16 9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  award: (
    <>
      <Circle cx="12" cy="8" r="5" fill="none" />
      <Path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" fill="none" strokeLinejoin="round" />
    </>
  ),
  medal: (
    <>
      <Circle cx="12" cy="15" r="6" fill="none" />
      <Path d="M9 3h6l-2 6h-2z" fill="none" strokeLinejoin="round" />
      <Path d="M12 12v6" fill="none" strokeLinecap="round" />
    </>
  ),
  zap: <Polygon points="13,2 4,14 11,14 10,22 20,9 13,9" fill="none" strokeLinejoin="round" />,
  flame: (
    <Path
      d="M12 2c1 3-3 4-3 8a4 4 0 008 0c0-2-1-2.5-1-4 2 1 3 3 3 6a7 7 0 11-14 0c0-4 3-5 4-8 1 2 2 2 3-2z"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  'trending-up': (
    <>
      <Polygon points="3,17 9,11 13,15 21,6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <Path d="M15 6h6v6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'book-open': (
    <Path
      d="M12 6c-2-1.5-5-2-8-1v13c3-1 6-.5 8 1 2-1.5 5-2 8-1V5c-3-1-6-.5-8 1z"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  book: <Path d="M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2V4z M5 4a2 2 0 000 4h13" fill="none" strokeLinejoin="round" />,
  code: <Path d="M8 6l-6 6 6 6M16 6l6 6-6 6" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  dumbbell: (
    <Path
      d="M4 9v6M2 10v4M20 9v6M22 10v4M8 12h8M6 8v8M18 8v8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  heart: (
    <Path
      d="M12 21s-7-4.5-9.5-9C1 8.5 2.5 5 6 5c2 0 3.5 1.2 4 2.3C10.5 6.2 12 5 14 5c3.5 0 5 3.5 3.5 7-2.5 4.5-9.5 9-9.5 9z"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  target: (
    <>
      <Circle cx="12" cy="12" r="9" fill="none" />
      <Circle cx="12" cy="12" r="5" fill="none" />
      <Circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  shield: <Path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" fill="none" strokeLinejoin="round" />,
  star: <Polygon points="12,2 15,9 22,9.5 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.5 9,9" fill="none" strokeLinejoin="round" />,
  crown: <Path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" fill="none" strokeLinejoin="round" />,
  sword: <Path d="M14.5 3l6.5 6.5-9 9-3-1-1-3 9-9-2.5-2.5zM4 20l3-3" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  compass: (
    <>
      <Circle cx="12" cy="12" r="9" fill="none" />
      <Polygon points="15,9 13,13 9,15 11,11" fill="none" strokeLinejoin="round" />
    </>
  ),
  seedling: <Path d="M12 22v-9M12 13c-5 0-8-3-8-8 5 0 8 3 8 8zM12 13c0-6 3-9 8-9 0 5-3 9-8 9z" fill="none" strokeLinejoin="round" />,
  briefcase: (
    <>
      <Rect x="3" y="7" width="18" height="13" rx="2" fill="none" />
      <Path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" fill="none" />
    </>
  ),
  user: (
    <>
      <Circle cx="12" cy="8" r="4" fill="none" />
      <Path d="M4 21c0-4 4-7 8-7s8 3 8 7" fill="none" strokeLinecap="round" />
    </>
  ),
  plus: <Path d="M12 5v14M5 12h14" fill="none" strokeLinecap="round" />,
  edit: <Path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  trash: <Path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-right': <Path d="M9 6l6 6-6 6" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  'chevron-left': <Path d="M15 6l-6 6 6 6" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  x: <Path d="M18 6L6 18M6 6l12 12" fill="none" strokeLinecap="round" />,
  check: <Path d="M5 12l5 5L20 7" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  home: <Path d="M3 11l9-8 9 8M5 10v10h14V10" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  list: <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  'user-circle': (
    <>
      <Circle cx="12" cy="12" r="9" fill="none" />
      <Circle cx="12" cy="10" r="3" fill="none" />
      <Path d="M6.5 19c1-3 3-4 5.5-4s4.5 1 5.5 4" fill="none" strokeLinecap="round" />
    </>
  ),
  'bar-chart': <Path d="M4 20V10M12 20V4M20 20v-7" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  settings: (
    <>
      <Circle cx="12" cy="12" r="3" fill="none" />
      <Path
        d="M19.4 13a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V19a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H4a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H10a1.7 1.7 0 001-1.5V4a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V10a1.7 1.7 0 001.5 1H20a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
        fill="none"
        strokeLinejoin="round"
      />
    </>
  ),
  calendar: (
    <>
      <Rect x="3" y="5" width="18" height="16" rx="2" fill="none" />
      <Line x1="3" y1="10" x2="21" y2="10" />
      <Line x1="8" y1="3" x2="8" y2="7" strokeLinecap="round" />
      <Line x1="16" y1="3" x2="16" y2="7" strokeLinecap="round" />
    </>
  ),
  moon: <Path d="M21 12.5A9 9 0 1111.5 3 7 7 0 0021 12.5z" fill="none" strokeLinejoin="round" />,
  sun: (
    <>
      <Circle cx="12" cy="12" r="4" fill="none" />
      <Line x1="12" y1="2" x2="12" y2="4" strokeLinecap="round" />
      <Line x1="12" y1="20" x2="12" y2="22" strokeLinecap="round" />
      <Line x1="4.2" y1="4.2" x2="5.6" y2="5.6" strokeLinecap="round" />
      <Line x1="18.4" y1="18.4" x2="19.8" y2="19.8" strokeLinecap="round" />
      <Line x1="2" y1="12" x2="4" y2="12" strokeLinecap="round" />
      <Line x1="20" y1="12" x2="22" y2="12" strokeLinecap="round" />
      <Line x1="4.2" y1="19.8" x2="5.6" y2="18.4" strokeLinecap="round" />
      <Line x1="18.4" y1="5.6" x2="19.8" y2="4.2" strokeLinecap="round" />
    </>
  ),
  bell: <Path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.7 21a2 2 0 01-3.4 0" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  clock: (
    <>
      <Circle cx="12" cy="12" r="9" fill="none" />
      <Path d="M12 7v5l3 3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = '#F5F3FF', strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={strokeWidth} color={color}>
      {paths[name]}
    </Svg>
  );
};

export default Icon;
