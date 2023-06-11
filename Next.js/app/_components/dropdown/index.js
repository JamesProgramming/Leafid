"use client";
import { ArrowDownIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import "./dropdown.scss";
import { useEffect, useRef, useState } from "react";

/**
 * Creates a custom select list. The children of this
 * component should be option elements.
 * @param {object} props Given by react.
 * @param {?function} props.setItem
 * @param {?string} props.name
 * @param {function} props.selectFunction
 */
export default function Dropdown({ children, setItem, name, selectFunction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const selectButton = useRef();
  const selectElement = useRef();

  useEffect(() => {
    // If there is a select function then select the
    // index returned by the function.
    if (selectFunction) {
      selectElement.current.selectedIndex = selectFunction();
      selectButton.current.innerText =
        selectElement.current[selectFunction()].innerText;
    } else {
      selectElement.current.selectedIndex = 0;
    }
  }, [selectFunction]);

  const selectItem = function (e) {
    selectButton.current.innerText = e.currentTarget.innerText;
    const optionIndex = e.currentTarget.dataset.index;
    selectElement.current.selectedIndex = optionIndex;

    setItem(selectElement.current[optionIndex].value);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <div className={`dropdown__container ${isTop ? "dropdown--top" : ""}`}>
        <button
          onClick={() => {
            // Determine if there is enough room below to display
            // the option.
            if (
              window.innerHeight -
                selectButton.current.getBoundingClientRect().bottom <
              70 * children.length
            ) {
              setIsTop(true);
            } else {
              setIsTop(false);
            }

            setIsOpen(!isOpen);
          }}
          type="button"
          className="dropdown__button"
        >
          <span ref={selectButton}>{children[0].props.children}</span>
          <ChevronDownIcon className={isOpen ? "dropdown--selected" : ""} />
        </button>
        {isOpen && (
          <div className="dropdown__list">
            {children.map((element, index) => {
              if (element.props.hidden) return;
              return (
                <button onClick={selectItem} data-index={index} key={index}>
                  {element.props.children}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <select
        className="dropdown__select"
        ref={selectElement}
        name={name}
        onChange={() => {
          setItem(
            selectElement.current[selectElement.current.selectedIndex].value
          );
        }}
      >
        {children}
      </select>
    </div>
  );
}
