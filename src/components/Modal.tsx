import Modal from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
  },
};

export const ModalView = ({
  children,
  setClicked,
  clicked,
}: {
  children: React.ReactNode;
  setClicked: (clicked: boolean) => void;
  clicked: boolean;
}) => {
  return (
    <Modal
      isOpen={clicked}
      onRequestClose={() => setClicked(false)}
      style={customStyles}
      contentLabel="Authentication Modal"
    >
      {children}
    </Modal>
  );
};
