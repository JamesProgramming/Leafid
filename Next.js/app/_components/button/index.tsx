import { MouseEventHandler } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "./button.scss";

enum ButtonStyle {
  "thin",
  "close",
  "next",
  "back",
}

interface Props {
  children?: JSX.Element | string | string[];
  disabled?: boolean | null;
  style?: ButtonStyle;
  onClick?: MouseEventHandler<HTMLButtonElement> | null;
  onSubmit?: MouseEventHandler<HTMLButtonElement> | null;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

// Parameters type enforement is done by typescript
/**
 * Creates a custom button. For accessability, the `ariaLabel` prop should be set if the button contains no text.
 * @param {*} props Given by react.
 * @param {*} props.disabled Whether button is in a disabled state.
 * @param {*} props.style One of the preset button designs.
 * @param {*} props.onClick Passed to the `button` element's `onClick` prop.
 * @param {*} props.onSubmit Passed to the `button` element's `onSubmit` prop.
 * @param {*} props.type Passed to the `button` element's `type` prop.
 * @param {*} props.ariaLabel Passed to the `button` element's `ariaLabel` prop.
 */
export default function Button({
  children,
  disabled,
  style,
  onClick,
  onSubmit,
  type,
  ariaLabel,
}: Props) {
  const buttonType = type ? type : "button";

  if (style == ButtonStyle.close) {
    return (
      <button
        type={buttonType}
        className="button button--close"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <span>
          <XMarkIcon />
        </span>
      </button>
    );
  }

  if (style == ButtonStyle.back) {
    return (
      <button
        type={buttonType}
        className="button button--back"
        onClick={onClick}
        onSubmit={onSubmit}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <span>
          <ChevronLeftIcon />
          {children}
        </span>
      </button>
    );
  }

  if (style == ButtonStyle.next) {
    return (
      <button
        type={buttonType}
        className="button button--next"
        onClick={onClick}
        onSubmit={onSubmit}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <span>
          {children}
          <ChevronRightIcon />
        </span>
      </button>
    );
  }

  return (
    <button
      type={buttonType}
      className="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
    </button>
  );
}
export { ButtonStyle };
