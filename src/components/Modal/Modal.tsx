import { Container, Content, Footer, Body } from './styles';

interface ModalProps {
  show: boolean;
  modalTitle?: string;
}

const Modal: React.FC<ModalProps> = ({ children, show, modalTitle }) => {
  if (!show) return null;

  return (
    <Container>
      <Content>
        <div className="modal-header">
          <h2 className="modal-title">{modalTitle ?? ``}</h2>
        </div>
        <Body>{children}</Body>
        <Footer></Footer>
      </Content>
    </Container>
  );
};

export default Modal;
