import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useStore } from '../hooks/store';
import { MessageHandler, useWs } from '../hooks/ws';
import Alert from './Alert';

const FixedContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const StyledAlerts = styled.div`
  margin: 10px auto;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 10px;
  padding: 0px 10px;
`;

const Alerts: FC = () => {
  const { dispatch, state } = useStore();

  const { addMessageHandler, removeMessageHandler } = useWs();

  useEffect(() => {
    const handler: MessageHandler = (message) => {
      if (message.type === 'Error') {
        dispatch(() => {
          const id = crypto.randomUUID();
          dispatch({
            type: 'ShowAlert',
            payload: { id, text: message.payload.text },
          });
          setTimeout(() => {
            dispatch({
              type: 'HideAlert',
              payload: { id },
            });
          }, 2000);
        });
      }
    };
    addMessageHandler(handler);
    return () => {
      removeMessageHandler(handler);
    };
  }, [addMessageHandler, removeMessageHandler, dispatch, state]);

  return (
    <FixedContainer>
      <StyledAlerts>
        {state.alerts.map((alert) => (
          <Alert key={alert.id} alert={alert} />
        ))}
      </StyledAlerts>
    </FixedContainer>
  );
};

export default Alerts;
