import { usePopupContext } from "../../contexts/PopupContext";
import "./loadingOverlay.sass";

export const LoadingOverlay = () => {
  const { visible } = usePopupContext();

  return (
    <div className={`loading-overlay ${!visible ? "disabled" : ""}`}>
      <div className="icon" />
    </div>
  );
};
