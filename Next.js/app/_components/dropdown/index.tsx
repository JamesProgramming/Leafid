"use client";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import "./dropdown.scss";
import { useEffect, useRef, useState } from "react";
import React from "react";

interface Props {
  children?: React.ReactElement[];
  setItem: CallableFunction;
  name: string;
  selectFunction?: CallableFunction;
}

// Parameters type enforement is done by typescript
/**
 * Creates a custom selection element.
 * @param {*} props Given by react.
 * @param {*} props.setItem A function called with the value of the selected item.
 * @param {*} props.selectFunction Returns the index of the option to be selected.
 * @param {*} props.name Select element name attribute.
 */
export default function Dropdown({
  children,
  setItem,
  selectFunction,
  name,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const selectButton = useRef<HTMLButtonElement>();
  const selectElement = useRef<HTMLSelectElement>();

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

  const selectItem = function (e: React.MouseEvent<HTMLElement>) {
    const clickedButton = e.currentTarget as HTMLButtonElement;
    selectButton.current.innerText = clickedButton.innerText;
    const optionIndex = parseInt(clickedButton.dataset.index);
    selectElement.current.selectedIndex = optionIndex;
    setItem(selectElement.current[optionIndex].getAttribute("value"));
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
            (
              selectElement.current[
                selectElement.current.selectedIndex
              ] as HTMLOptionElement
            ).value
          );
        }}
      >
        {children}
      </select>
    </div>
  );
}
