import React from 'react';

function getScroll() {
  return {
    scrollY: window.scrollY
  };
}

function useWindowScroll() {
  let [windowScroll, setWindowScroll] = React.useState(getScroll());

  function handleReScroll() {
    setWindowScroll(getScroll());
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleReScroll);
    return () => {
      window.removeEventListener('scroll', handleReScroll);
    };
  }, []);

  return windowScroll;
}

export { useWindowScroll };
