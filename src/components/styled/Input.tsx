import styled from 'styled-components';

const Input = styled.input`
  font-size: 25px;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.inputLoadingColor
      : props.theme.secondaryColor};
  color: ${(props) => props.theme.backgroundColor};
  transition: background-color 0.15s linear;
`;

export default Input;
