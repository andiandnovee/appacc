import { useRef, useState, useCallback, useEffect } from 'react';

export const useCollapsible = (peekHeight: number = 120, defaultOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    if (!contentRef.current) return;
    const fullHeight = contentRef.current.scrollHeight;
    const overflow = fullHeight > peekHeight;
    setNeedsCollapse(overflow);
  }, [peekHeight]);

  useEffect(() => {
    measure();

    const el = contentRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(() => measure());
    mutationObserver.observe(el, { childList: true, subtree: true, attributes: true, characterData: true });

    window.addEventListener('resize', measure);

    const images = el.querySelectorAll('img');
    const handleImageLoad = () => measure();
    images.forEach(img => {
      if (img.complete) return;
      img.addEventListener('load', handleImageLoad);
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', measure);
      images.forEach(img => img.removeEventListener('load', handleImageLoad));
    };
  }, [measure]); // Hanya depend pada measure, bukan children

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    toggle,
    needsCollapse,
    contentRef,
    peekHeight,
  };
};