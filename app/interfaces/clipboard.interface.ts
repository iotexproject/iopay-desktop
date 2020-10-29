export type ClipboardProps = {
  text: string;
  size?: "small" | "default" | "large";
  icon: "copy" | "link";
};

export type ClipboardState = {
  trigger: "hover" | "focus" | "click" | "contextMenu" | undefined;
  title: string;
  copied: string;
  visible: boolean;
};
