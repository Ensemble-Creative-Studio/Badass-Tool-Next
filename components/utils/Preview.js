export default function Preview({
    selectVideoRef,
    getSelectedItemCount,
    isHomepage,
    onModalOpen,
  }) {
    const opacityClassName = isHomepage
      ? "opacity-50 pointer-events-none"
      : getSelectedItemCount() > 0
      ? ""
      : "opacity-50 pointer-events-none";
  
    return (
      <button
        className={`flex preview uppercase items-center text-white sm-pr-0 pr-8 ${opacityClassName}`}
        onClick={onModalOpen}
      >
        Preview / Edit page
      </button>
    );
  }
  