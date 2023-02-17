import styled, { css } from 'styled-components';

const Button = styled.button<{ borderless?: boolean | undefined }>`
  display: block;
  padding: 5px;
  font-size: 20px;
  color: ${(props) => props.theme.secondaryColor};
  ${(props) =>
    props.borderless
      ? ''
      : css`
          border: 2px solid
            ${() =>
              props.disabled
                ? props.theme.loadingColor
                : props.theme.primaryColor};
        `}
  background-color: ${(props) =>
    props.disabled ? props.theme.loadingColor : props.theme.primaryColor};
  transition: background-color 0.15s linear, border 0.15s linear;

  ${(props) =>
    props.disabled
      ? ''
      : css`
          &:hover {
            background-color: ${() => props.theme.backgroundColor};
            cursor: pointer;
          }
        `}
`;

export default Button;
