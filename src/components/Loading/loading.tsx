import { useState, CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const loaderContainerStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9999,
};

function Loading({ isLoading: isLoading }: { isLoading: boolean }) {
  if (!isLoading) {
    // Si isLoading es false, no renderiza nada
    return null;
  }

  return (
    <div className="sweet-loading" style={loaderContainerStyle}>
      <RingLoader
        color="#36d7b7"
        loading={isLoading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loading;
