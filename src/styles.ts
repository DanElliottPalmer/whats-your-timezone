import { css } from "lit";

export const buttonStyles = css`
  button,
  .button {
    appearance: none;
    background: var(--color-primary);
    border-radius: var(--spacing-base);
    border: none;
    box-shadow: 0 0 0 1px var(--color-secondary);
    box-sizing: border-box;
    color: var(--color-secondary);
    cursor: pointer;
    font-family: var(--font-sans-serif);
    font-size: var(--font-size-sm);
    font-weight: bold;
    padding-block: var(--spacing-base);
    padding-inline: var(--spacing-small);
    transition: box-shadow 0.1s ease-in-out;
  }

  button:hover,
  button:focus,
  .button:hover,
  .button:focus {
    box-shadow: 0 0 0 3px var(--color-secondary);
  }
`;

export const textInputStyles = css`
  .input-text {
    border: none;
    box-shadow: 0 0 0 1px var(--color-secondary);
    font-size: var(--font-size-base);
    padding-block: var(--spacing-xsmall);
    padding-inline: var(--spacing-xsmall);
    transition: box-shadow 0.1s ease-in-out;
  }

  .input-text:hover,
  .input-text:focus {
    box-shadow: 0 0 0 3px var(--color-secondary);
  }
`;
