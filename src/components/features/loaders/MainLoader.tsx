import React from 'react';
import styles from './styles/Loading.module.css';

const Loading: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className={styles.loaderContainer}>
        <div className={styles.wavyPulse}></div>
        <div
          className={styles.wavyPulse}
          style={{ animationDelay: '-0.5s' }}
        ></div>
        <div
          className={styles.wavyPulse}
          style={{ animationDelay: '-1s' }}
        ></div>
        <div className={styles.letter}>D</div>
      </div>
    </div>
  );
};

export default Loading;
