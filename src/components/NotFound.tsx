import { FC } from 'react';
import styled from 'styled-components';
import Link from './Link';
import CenteredContainer from './styled/CenteredContainer';

const StyledNotFound = styled(CenteredContainer)`
  flex-direction: column;
  gap: 20px;
`;

const NotFound: FC = () => {
  return (
    <StyledNotFound>
      Page not found
      <Link to="">home</Link>
    </StyledNotFound>
  );
};

export default NotFound;
