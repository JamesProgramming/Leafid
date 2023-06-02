"use client";
import { useState } from "react";
import Button, { buttonStyle } from "../button";
import "./modal.scss";

function Modal(props) {
  const [isOpen, setIsOpen] = useState(props.whatState);

  return (
    <>
      <Button style={buttonStyle.thin} onClick={() => setIsOpen(true)}>
        {props.name}
      </Button>
      {isOpen && (
        <div className="modal">
          <Button
            style={buttonStyle.close}
            onClick={() => setIsOpen(false)}
          ></Button>

          <div>{props.children}</div>
        </div>
      )}
    </>
  );
}

export default Modal;
