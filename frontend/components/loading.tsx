import { Spinner } from "react-bootstrap";

type LoadingSpinnerProps = {
  message?: string;
};
const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div className="py-3 text-center fw-light">
      <div
        className="py-1"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner variant="primary" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
      {props.message && <p className="my-3">{props.message}</p>}
    </div>
  );
};

export default LoadingSpinner;
