/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

import {
  Container,
  LoadingCircle,
  LoadingContainerVariants,
  LoadingCircleVariants,
  LoadingCircleTransition,
} from './styles';

interface SpinnerProps {
  loading: any;
  children: any;
}
const delay = 3000; // 1s
let setTimeoutInstance: any;

const SpinnerThreeDots: React.FC<SpinnerProps> = ({
  loading,
  children,
}: SpinnerProps) => {
  const [isExpired, setIsExpired] = useState(true);

  useEffect(() => {
    if (loading) {
      setIsExpired(false);

      if (setTimeoutInstance) {
        clearTimeout(setTimeoutInstance);
      }
      setTimeoutInstance = setTimeout(() => {
        setIsExpired(true);
      }, delay);
    }
  }, [loading]);

  if (!isExpired) {
    return (
      <>
        <Container
          variants={LoadingContainerVariants}
          initial="start"
          animate="end"
        >
          <p>Loading</p>

          <LoadingCircle
            variants={LoadingCircleVariants}
            transition={LoadingCircleTransition}
          />

          <LoadingCircle
            variants={LoadingCircleVariants}
            transition={LoadingCircleTransition}
          />
          <LoadingCircle
            variants={LoadingCircleVariants}
            transition={LoadingCircleTransition}
          />
        </Container>
      </>
    );
  }

  return children;
};

export default SpinnerThreeDots;
