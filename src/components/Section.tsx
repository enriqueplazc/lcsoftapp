import React from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SectionProps {
  id: string;
  children: React.ReactElement;
  y?: number;
  once?: boolean;
  className?: string; // <--- NUEVO

}

export const Section = ({ children, id, y = 200, once = false }: SectionProps) => {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.1 });

  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
