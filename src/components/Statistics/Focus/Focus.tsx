import React, { useContext } from 'react';
import styles from './focus.module.css';
import {EColors, Text} from '../../../utils/Text';
import { ThemeContext } from '../../../App';
export function Focus():JSX.Element {
  const isDarkMode = useContext(ThemeContext);
  return (
    <div>
      <Text size={20} color={isDarkMode?EColors.grey:EColors.black}>  отношение времени работы с таймером ко времени, потраченному на законченные «помидорки» </Text>
    </div>
  );
}
