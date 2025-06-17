'use client';

import { useEffect, useState } from 'react';
import { KeyboardDoubleArrowUp } from '@mui/icons-material';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;
  const isRTL = document?.documentElement?.dir === 'rtl';
  return (

    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 p-[4px] border-2 border-[#be1d1d]  rounded-[2px] animate-bounce cursor-pointer`}
    >
      <div className="bg-[#be1d1d] text-white p-1 rounded-[2px] hover:bg-[#be1d1d] transition-all">
        <KeyboardDoubleArrowUp />
      </div>
    </button>
  );
}
