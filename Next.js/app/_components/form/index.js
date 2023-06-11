"use client";
import axios from "axios";
import Button from "../button";
import "./form.scss";
import { useEffect, useState, useRef } from "react";
import { customAlert } from "../alert";
import Dropdown from "../dropdown";
import { updateTheme } from "../utils/theme";

/**
 * @typedef {object} inputs
 * @property {string} inputs.type
 * @property {string} inputs.placeholder
 * @property {string} inputs.name
 * @property {?string} inputs.value
 */

/**
 * @typedef {object} action
 * @property {string} action.url
 * @property {?string[]} action.compare
 * @property {?string} action.compareMessage
 * @property {?function} action.cleaner
 */

/**
 * @param {object} props Given by react.
 * @param {string} props.buttonName
 * @param {inputs} props.inputs
 * @param {action} props.action
 */
export default function Form({ buttonName, inputs, action }) {
  const form = useRef();
  const formSubmit = async (e) => {
    e.preventDefault();

    // Create payload to send to sever.
    const payload = inputs.reduce((load, input) => {
      return {
        ...load,
        [input.name]: form.current.elements[input.name]?.value,
      };
    }, {});

    // Check if the two fields are the same.
    if (action?.compare) {
      if (
        !(
          form.current.elements[action.compare[0]].value ===
          form.current.elements[action.compare[1]].value
        )
      ) {
        customAlert(action.compareMessage);
        return form.current.elements[action.compare[0]].focus();
      }
    }

    let results;
    try {
      results = await axios.post(
        action.url,
        {
          data: { ...payload },
        },
        { withCredentials: true }
      );
    } catch (e) {
      return customAlert(e.response?.data.data.message);
    }

    if (action?.cleaner) action?.cleaner();
    customAlert(results.data.data.message);
  };

  // Select function for theme selector.
  const selectFunction = () => {
    const theme = document.cookie
      .split("; ")
      .filter((cookie) => cookie.includes("theme"))[0]
      ?.split("=")[1];

    const index = inputs[0].options
      .map((option) => {
        return option.split(" ").join("-").toLowerCase();
      })
      .indexOf(theme);
    if (index === -1) return 0;

    return index;
  };

  if (inputs[0].type === "theme") {
    return (
      <form className="form" ref={form} onSubmit={formSubmit}>
        <Dropdown
          setItem={(value) => {
            updateTheme(value);
            form.current.requestSubmit();
          }}
          name={inputs[0].name}
          selectFunction={selectFunction}
        >
          {inputs[0].options.map((option, i) => {
            return (
              <option key={i} value={option.split(" ").join("-").toLowerCase()}>
                {option}
              </option>
            );
          })}
        </Dropdown>
      </form>
    );
  }

  return (
    <form className="form" ref={form} onSubmit={formSubmit}>
      {inputs.map((inputInfo, i) => {
        if (inputInfo.type !== "select") {
          return (
            <input
              type={inputInfo.type}
              placeholder={inputInfo.placeholder}
              name={inputInfo.name}
              value={inputInfo?.value}
              key={i}
            ></input>
          );
        }
        return (
          <Dropdown setItem={() => {}} name={inputInfo.name} key={i}>
            {inputInfo.options.map((option, i) => {
              return (
                <option
                  key={i}
                  value={option.split(" ").join("-").toLowerCase()}
                >
                  {option}
                </option>
              );
            })}
          </Dropdown>
        );
      })}
      <Button type={"submit"}>{buttonName}</Button>
    </form>
  );
}
