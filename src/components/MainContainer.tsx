import { useTheme } from 'styled-components';
import Container from './styled/Container';
import Routes from './Routes';
import Alerts from './Alerts';

const MainContainer = () => {
  const theme = useTheme();

  return (
    <Container maxWidth={theme.mainContainerMaxWidth}>
      <Alerts />
      <Routes />
    </Container>
  );
};

export default MainContainer;
