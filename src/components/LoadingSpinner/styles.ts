import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled(motion.div)`
  width: 15rem;
  height: 15rem;
  margin-top: 10rem;
  display: flex;
  align-self: center;
  justify-content: 'space-around';
  p {
    margin-right: 12px;
    color: rgba(128, 128, 128, 0.7);
    font-weight: bold;
    font-size: 2rem;
    opacity: 0.4;
    transition: opacity 1s ease-in-out;
    animation: flash-font 1s ease-in-out infinite;
  }
  @keyframes flash-font {
    70%,
    80%,
    70% {
      color: rgba(128, 128, 128, 0.5);
    }
    80%,
    90%,
    95% {
      color: rgba(128, 128, 128, 0.6);
    }
  }
`;

export const LoadingCircle = styled(motion.span)`
  display: 'block';
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 4px;
  margin-top: 6px;
  background-color: rgba(128, 128, 128, 0.7);
  opacity: 0.4;
  transition: animation 1s ease-in-out;
  animation: flash 1s ease-in-out infinite;
  border-radius: 50%;
  @keyframes flash {
    70%,
    80%,
    70% {
      background-color: rgba(128, 128, 128, 0.5);
    }
    80%,
    90%,
    95% {
      background-color: rgba(128, 128, 128, 0.6);
    }
  }
`;

export const LoadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const LoadingCircleVariants = {
  start: {
    y: '30%',
  },
  end: {
    y: '100%',
  },
};

export const LoadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: 'easeInOut',

  // delay: 1,
  // duration: 2,
  // ease: 'easeInOut',
  // repeat: Infinity,
  //  repeatType: 'reverse',
};
