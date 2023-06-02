import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "./button.scss";

const buttonStyle = {
  thin: "thin",
  close: "close",
  next: "next",
  back: "back",
};

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
