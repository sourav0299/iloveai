import React, { useState } from "react";
import styled from "styled-components";

const Radio = () => {
  const [selectedOption, setSelectedOption] = useState("Gemini 1.0");

  const handleOptionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOption = event.target.value;
    setSelectedOption(newOption);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Test message",
          selectedOption: newOption,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <StyledWrapper>
      <div className="select">
        <div className="selected">
          {selectedOption}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            className="arrow"
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </div>
        <div className="options">
          <div title="all">
            <input
              id="all"
              name="option"
              type="radio"
              value="Gemini 1.0"
              checked={selectedOption === "Gemini 1.0"}
              onChange={handleOptionChange}
            />
            <label className="option" htmlFor="all">
              Gemini 1.0
            </label>
          </div>
          <div title="option-1">
            <input
              id="option-1"
              name="option"
              type="radio"
              value="Gemini 2.0"
              checked={selectedOption === "Gemini 2.0"}
              onChange={handleOptionChange}
            />
            <label className="option" htmlFor="option-1">
              Gemini 2.0
            </label>
          </div>
          <div title="option-2">
            <input
              id="option-2"
              name="option"
              type="radio"
              value="Gemini 3.0"
              checked={selectedOption === "Gemini 3.0"}
              onChange={handleOptionChange}
            />
            <label className="option" htmlFor="option-2">
              Gemini 3.0
            </label>
          </div>
          <div title="option-3">
            <input
              id="option-3"
              name="option"
              type="radio"
              value="Gemini 4.0"
              checked={selectedOption === "Gemini 4.0"}
              onChange={handleOptionChange}
            />
            <label className="option" htmlFor="option-3">
              Gemini 4.0
            </label>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .select {
    width: fit-content;
    cursor: pointer;
    position: relative;
    transition: 300ms;
    color: white;
  }

  .selected {
    background-color: #2a2f3b;
    padding: 5px;
    border-radius: 5px;
    position: relative;
    z-index: 2;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 150px;
  }

  .arrow {
    height: 10px;
    width: 25px;
    fill: white;
    transition: 300ms;
  }

  .options {
    display: none;
    flex-direction: column;
    border-radius: 5px;
    padding: 5px;
    background-color: #2a2f3b;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1;
    margin-top: 2px;
  }

  .select:hover .options {
    display: flex;
  }

  .select:hover .arrow {
    transform: rotate(180deg);
  }

  .option {
    border-radius: 5px;
    padding: 5px;
    transition: 300ms;
    background-color: #2a2f3b;
    font-size: 15px;
  }

  .option:hover {
    background-color: #323741;
  }

  .options input[type="radio"] {
    display: none;
  }

  .options label {
    display: block;
    width: 100%;
  }
`;

export default Radio;