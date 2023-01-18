import styled from 'styled-components';

const Button = styled.button`
  display: block;
  padding: 5px;
  font-size: 20px;
  color: ${(props) => props.theme.secondaryColor};
  border: 2px solid ${(props) => props.theme.primaryColor};
  background-color: ${(props) => props.theme.primaryColor};
  transition: background-color 0.15s linear;

  &:hover {
    background-color: ${(props) => props.theme.backgroundColor};
    cursor: pointer;
  }
`;

export default Button;
