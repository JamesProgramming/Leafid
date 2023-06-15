"use client";
import React, { useState } from "react";
import Button, { ButtonStyle } from "../button";
import "./modal.scss";

interface Props {
  isOpen?: boolean;
  name: string;
  children: React.ReactElement;
}

// Parameters type enforement is done by typescript.
/**
 * Creates a modal and returns a button that opens the modal. The `children` will be placed
 * inside the modal and visible when open.
 * @param {*} props Given by react.
 * @param {*} props.isOpen Whether the model is open by default.
 * @param {*} props.name Name of button that opens modal.
 */
function Modal(props: Props) {
  const [isOpen, setIsOpen] = useState(props.isOpen);

  return (
    <>
      <Button style={ButtonStyle.thin} onClick={() => setIsOpen(true)}>
        {props.name}
      </Button>
      {isOpen && (
        <div className="modal">
          <Button
            style={ButtonStyle.close}
            onClick={() => setIsOpen(false)}
          ></Button>

          <div>{props.children}</div>
        </div>
      )}
    </>
  );
}

export default Modal;
