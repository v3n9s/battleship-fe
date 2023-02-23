import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import Button from '../styled/Button';

const StyledLink = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;

const Link: FC<{
  to: string;
  children?: ReactNode | undefined;
  borderless?: boolean | undefined;
}> = ({ to, children, borderless }) => {
  return (
    <StyledLink borderless={borderless} as="a" href={'#/' + to}>
      {children}
    </StyledLink>
  );
};

export default Link;
