import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`;

const StyledOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.overlayColor};
`;

const StyledModal = styled.div`
  position: relative;
  padding: 0px 10px;
  pointer-events: none;
`;

const StyledModalBody = styled.div<{ maxWidth?: number | undefined }>`
  margin: 10px auto;
  max-width: ${(props) =>
    props.maxWidth ? props.maxWidth : props.theme.mainContainerMaxWidth}px;
  max-height: calc(100vh - 20px);
  padding: 10px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 2px solid ${(props) => props.theme.primaryColor};
  pointer-events: auto;
  overflow-y: auto;
`;

const Modal: FC<{
  children: ReactNode;
  closeModal: () => void;
  maxWidth?: number | undefined;
}> = ({ children, closeModal, maxWidth }) => {
  return (
    <>
      <StyledWrapper>
        <StyledOverlay onClick={closeModal} />
        <StyledModal>
          <StyledModalBody maxWidth={maxWidth}>{children}</StyledModalBody>
        </StyledModal>
      </StyledWrapper>
    </>
  );
};

export default Modal;
