import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "30px",
        height: "30px",
        margin: "auto",
        display: "inline-block",
      }}
    ></Spinner>
  );
}

export default Loader;
