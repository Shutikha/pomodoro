import React from 'react';
import styles from './info.module.css';

export function Info():JSX.Element {
  return (
    <div className={styles.info}>
      Краткая инструкция о работе с приложением:
    </div>
  );
}
