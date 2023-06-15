"use client";
import axios, { AxiosResponse } from "axios";
import Button from "../button";
import "./form.scss";
import { useRef } from "react";
import { customAlert } from "../alert";
import Dropdown from "../dropdown";
import { updateTheme } from "../utils/theme";

interface Inputs {
  type: string;
  placeholder?: string;
  name: string;
  options?: string[];
  value?: string;
}

interface Action {
  url: string;
  compare?: string[];
  compareMessage?: string;
  cleaner?: CallableFunction;
}

interface Props {
  buttonName?: string;
  inputs: Inputs[];
  action: Action;
}

// Parameters type enforement is done by typescript
/**
 * Creates a preformated form with the given info.
 * @param {*} props Given by react.
 * @param {*} props.buttonName Name of the form submit button.
 * @param {*} props.inputs A array of the input fields the form will contain.
 * @param {*} props.action Addtional options for the form.
 */
export default function Form({ buttonName, inputs, action }: Props) {
  const form = useRef<HTMLFormElement>();
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

    let results: AxiosResponse;
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
          setItem={(value: string) => {
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
