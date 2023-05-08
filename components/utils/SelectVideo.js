// SelectVideo.js
import { useRef } from "react";

export default function SelectVideo({
  selectVideoRef,
  getSelectedItemCount,
  isHomepage,
  onCloseOverlay, // new prop for closing the overlay
}) {
  const handleSelectVideoClick = () => {
    if (getSelectedItemCount() > 0) {
      onCloseOverlay(); // call onCloseOverlay to close the overlay
    }
  };

  return (
    <div
      ref={selectVideoRef}
      className="flex items-center text-white opacity-50 select sm-pr-0 pr-8"
      onClick={handleSelectVideoClick}
    >
      <span>Select Videos</span>
      <span className="number text-white pl-6 pr-4">
        {isHomepage ? 0 : getSelectedItemCount()}
      </span>
      <span ref={selectVideoRef} className="round-circle "></span>
    </div>
  );
}
