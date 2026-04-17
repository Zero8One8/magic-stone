import { useEffect, useRef, ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimateOnScroll = ({ children, className = "", delay = 0 }: AnimateOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`animate-on-scroll ${className}`}>
      {children}
    </div>
  );
};

export default AnimateOnScroll;
