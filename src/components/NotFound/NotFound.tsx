import React from 'react';
import styles from './notfound.module.css';
import {Text} from '../../utils/Text';

export function NotFound():JSX.Element {
  return (
    <div className={styles.notFound}>
      <Text size={28}>Станица не найдена</Text>
    </div>
  );
}
