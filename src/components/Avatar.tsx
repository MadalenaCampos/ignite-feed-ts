import styles from "./Avatar.module.css";
import { ImgHTMLAttributes } from "react";

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  temBorda?: boolean;
}

export function Avatar({ temBorda = true, ...props }: AvatarProps) {
  return (
    <img
      className={
        temBorda ? styles["avatar-com-borda"] : styles["avatar-sem-borda"]
      }
      {...props}
    />
  );
}
