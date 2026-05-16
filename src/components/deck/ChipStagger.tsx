import { motion } from "framer-motion";
import type { ReactNode } from "react";

const chipMotion = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Chip({
  children,
  index = 0,
  href,
}: {
  children: ReactNode;
  index?: number;
  href?: string;
}) {
  const transition = { duration: 0.45, delay: index * 0.07, ease: [0.65, 0, 0.35, 1] as const };

  if (href) {
    return (
      <motion.a
        className="chip"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...chipMotion}
        transition={transition}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.span className="chip" {...chipMotion} transition={transition}>
      {children}
    </motion.span>
  );
}

export type ChipItem = string | { label: string; href?: string };

export function ChipsWrap({
  items,
  className = "chips-wrap",
}: {
  items: ChipItem[];
  className?: string;
}) {
  return (
    <motion.div className={className} initial="hidden" animate="visible">
      {items.map((item, i) =>
        typeof item === "string" ? (
          <Chip key={item} index={i}>
            {item}
          </Chip>
        ) : (
          <Chip key={item.label} index={i} href={item.href}>
            {item.label}
          </Chip>
        ),
      )}
    </motion.div>
  );
}
