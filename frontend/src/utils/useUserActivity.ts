import { useState, useEffect } from 'react';

export const useUserActivity = () => {
  const [isActive, setIsActive] = useState(true); // Initially assume user is active

  useEffect(() => {
    console.log('is', isActive);
  }, [isActive]);

  useEffect(() => {
    const setActive = () => {
      // if (!isActive) {
      setIsActive(true);
      // }
    };

    const setInactive = () => {
      setIsActive(false);
    };

    const handleActivity = () => {
      console.log('handleActivity');
      setActive();
    };

    const handleInactivity = () => {
      console.log('handle IN Activity');
      setInactive();
    };

    // // Event listeners for user activity
    // document.addEventListener('mousemove', handleActivity);
    // document.addEventListener('keydown', handleActivity);
    // document.addEventListener('scroll', handleActivity);

    window.addEventListener('pagehide', handleInactivity);

    // Event listener for when the browser window loses focus
    window.addEventListener('blur', handleInactivity);

    // Event listener for when the browser window gains focus
    window.addEventListener('focus', handleActivity);

    return () => {
      // Clean up event listeners
      setInactive();
      // document.removeEventListener('mousemove', handleActivity);
      // document.removeEventListener('keydown', handleActivity);
      // document.removeEventListener('scroll', handleActivity);
      window.removeEventListener('blur', handleInactivity);
      window.removeEventListener('focus', handleActivity);
      window.removeEventListener('pagehide', handleActivity);
    };
  }, []);

  return { isActive };
};
