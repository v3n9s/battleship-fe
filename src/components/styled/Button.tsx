import styled, { css } from 'styled-components';

const Button = styled.button.attrs<
  {
    isLoading?: boolean | undefined;
    borderless?: boolean | undefined;
  },
  {
    disabled: boolean | undefined;
    isLoading: boolean;
    borderless: boolean;
  }
>((props) => ({
  disabled: props.disabled ?? props.isLoading,
  isLoading: props.isLoading ?? false,
  borderless: props.borderless ?? false,
}))`
  display: block;
  padding: 5px;
  font-size: 20px;
  color: ${(props) => props.theme.secondaryColor};
  ${(props) =>
    props.borderless
      ? ''
      : css`
          border: 2px solid
            ${(p) =>
              props.isLoading ? p.theme.loadingColor : p.theme.primaryColor};
        `}
  background-color: ${(props) =>
    props.isLoading ? props.theme.loadingColor : props.theme.primaryColor};
  transition: background-color 0.15s linear, border 0.15s linear;

  ${(props) =>
    props.isLoading
      ? ''
      : css`
          &:hover {
            background-color: ${(props) => props.theme.backgroundColor};
            cursor: pointer;
          }
        `}
`;

export default Button;
