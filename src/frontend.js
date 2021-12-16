import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./frontend.scss";

const divsToUpdate = document.querySelectorAll(".paying-attention-update-me");

divsToUpdate.forEach((div) => {
  const data = JSON.parse(div.querySelector("pre").innerHTML);
  ReactDOM.render(<Quiz {...data} />, div);
  div.classList.remove("paying-attention-update-me");
});

function Quiz(props) {
  const [isCorrect, setIsCorrect] = useState(undefined);
  const [isCorrectDelay, setIsCorrectDelay] = useState(undefined);
  useEffect(() => {
    if (isCorrect === false) {
      setTimeout(() => {
        setIsCorrect(undefined);
      }, 2600);
    }
    if (isCorrect === true) {
      setTimeout(() => {
        setIsCorrectDelay(true);
      }, 1000);
    }
  }, [isCorrect]);
  function handleAnswer(index) {
    if (index == props.correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }
  return (
    <div
      className='paying-attention-frontend'
      style={{ backgroundColor: props.bgColor, textAlign: props.theAlignment }}
    >
      <p>{props.question}</p>
      <ul>
        {props.answers.map((answer, index) => {
          return (
            <li
              className={
                (isCorrectDelay === true && index == props.correctAnswer
                  ? "no-click"
                  : "") +
                (isCorrectDelay === true && index != props.correctAnswer
                  ? "fade-incorrect"
                  : "")
              }
              onClick={
                isCorrect === true ? undefined : () => handleAnswer(index)
              }
            >
              {isCorrectDelay === true && index == props.correctAnswer && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  className='bi bi-check'
                  viewBox='0 0 16 16'
                >
                  <path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z' />
                </svg>
              )}
              {isCorrectDelay === true && index != props.correctAnswer && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  className='bi bi-x'
                  viewBox='0 0 16 16'
                >
                  <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
                </svg>
              )}
              {answer}
            </li>
          );
        })}
      </ul>
      <div
        className={
          "correct-message" +
          (isCorrect == true ? " correct-message--visible" : "")
        }
      >
        <p>That is Correct!</p>
      </div>
      <div
        className={
          "incorrect-message" +
          (isCorrect === false ? " incorrect-message--visible" : "")
        }
      >
        <p>Sorry try again!</p>
      </div>
    </div>
  );
}
