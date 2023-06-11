import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "./button.scss";

/**
 * @typedef {object} buttonStyle
 * @property {string} buttonStyle.thin
 * @property {string} buttonStyle.close
 * @property {string} buttonStyle.next
 * @property {string} buttonStyle.back
 */
const buttonStyle = {
  thin: "thin",
  close: "close",
  next: "next",
  back: "back",
};

/**
 * @param {object} props Given by react.
 * @param {?boolean} props.disabled
 * @param {?keyof buttonStyle} props.style
 * @param {?function} props.onClick
 * @param {?function} props.onSubmit
 * @param {?string} props.type
 */
export default function Button({
  children,
  disabled,
  style,
  onClick,
  onSubmit,
  type,
}) {
  const buttonType = type ? type : "button";

  if (style == buttonStyle.close) {
    return (
      <button
        type={buttonType}
        className="button button--close"
        onClick={onClick}
        disabled={disabled}
      >
        <span>
          <XMarkIcon />
        </span>
      </button>
    );
  }

  if (style == buttonStyle.back) {
    return (
      <button
        type={buttonType}
        className="button button--back"
        onClick={onClick}
        onSubmit={onSubmit}
        disabled={disabled}
      >
        <span>
          <ChevronLeftIcon />
          {children}
        </span>
      </button>
    );
  }

  if (style == buttonStyle.next) {
    return (
      <button
        type={buttonType}
        className="button button--next"
        onClick={onClick}
        onSubmit={onSubmit}
        disabled={disabled}
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
    >
      <span>{children}</span>
    </button>
  );
}

export { buttonStyle };
