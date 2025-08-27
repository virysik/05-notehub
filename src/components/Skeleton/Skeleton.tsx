import React from "react";
import styles from "./Skeleton.module.css";

/**
 * Simple Skeleton Loader (CSS Module–based)
 * -----------------------------------------
 * Props:
 * - variant: "text" | "rect" | "circle"
 * - width, height: number | string
 * - animation: "pulse" | "wave" | false
 */

export type SkeletonProps = {
  variant?: "text" | "rect" | "circle";
  width?: number | string;
  height?: number | string;
  animation?: "pulse" | "wave" | false;
  style?: React.CSSProperties;
  className?: string;
};

function toCssSize(v?: number | string) {
  if (v == null) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rect",
  width,
  height,
  animation = "pulse",
  style,
  className = "",
}) => {
  const classes = [
    styles.skeleton,
    styles[variant] || "",
    animation ? styles[animation] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      style={{
        width: toCssSize(width),
        height: toCssSize(height),
        ...style,
      }}
    />
  );
};

const Loader = () => (
  <div className={styles.list}>
    {Array.from({ length: 12 }, (_, e) => (
      <div key={e} className={styles.item}>
        <Skeleton variant="rect" width="100%" height={180} />
      </div>
    ))}
  </div>
);

export default Loader;

/* ----------------- Example Usage -----------------
import Skeleton from "./Skeleton";

export default function Demo() {
  return (
    <div>
      <Skeleton variant="text" width="80%" height={16} />
      <Skeleton variant="circle" width={40} height={40} animation="wave" />
      <Skeleton variant="rect" width="100%" height={100} />
    </div>
  );
}
--------------------------------------------------*/
