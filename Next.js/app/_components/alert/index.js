"use client";
import { useState } from "react";
import Button, { buttonStyle } from "../button";
import "./alert.scss";

// Global alert system. The Alerts component must be
// inserted in the page in order for the alert system to function.
function Alerts() {
  return (
    <section className="alert-container">
      <div className="none">
        <p></p>
        <Button style={buttonStyle.close} />
      </div>
    </section>
  );
}

// Display a alert message.
function alert(message) {
  const alertContainer = document.getElementsByClassName("alert-container")[0];
  const alertEl = alertContainer.lastElementChild;

  // Clone the alert template and add content.
  const newAlert = alertEl.cloneNode(true);
  newAlert.firstElementChild.innerText = message;
  let removed = false;
  newAlert.lastElementChild.addEventListener("click", () => {
    if (!removed) {
      alertContainer.removeChild(newAlert);
      removed = true;
    }
  });
  alertContainer.insertAdjacentElement("afterbegin", newAlert);
  newAlert.classList.add("alert");

  // Delay adding the class in order for animation to have
  // effect.
  setTimeout(() => {
    if (removed) return;
    newAlert.classList.add("alert-show");
  }, 5);

  setTimeout(() => {
    if (removed) return;
    newAlert.classList.remove("alert-show");
    setTimeout(() => {
      if (removed) return;
      alertContainer.removeChild(newAlert);
      removed = true;
    }, 300);
  }, 3000);
}

export { alert, Alerts };
