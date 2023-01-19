import { FC, useRef } from 'react';
import styled from 'styled-components';
import Form from './Form';
import Modal from './Modal';

const StyledPasswordModal = styled.div`
  margin: 10px auto;
  max-width: 400px;
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 2px solid ${(props) => props.theme.primaryColor};
`;

export type OnPasswordSubmit = (fields: { password: string }) => void;

const PasswordModal: FC<{
  isOpen: boolean;
  onSubmit: OnPasswordSubmit;
  closeModal: () => void;
}> = ({ isOpen, onSubmit, closeModal }) => {
  const formFields = useRef({
    password: {
      type: 'password',
      placeholder: 'password',
      value: '',
    },
  }).current;

  return isOpen ? (
    <Modal closeModal={closeModal}>
      <StyledPasswordModal>
        <Form fields={formFields} onSubmit={onSubmit} submitButtonText="join" />
      </StyledPasswordModal>
    </Modal>
  ) : null;
};

export default PasswordModal;
