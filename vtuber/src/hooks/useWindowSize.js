import React from 'react';

function getSize() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  };
}

function useWindowSize() {
  let [windowSize, setWindowSize] = React.useState(getSize());

  function handleResize() {
    setWindowSize(getSize());
  }

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

export { useWindowSize };
