import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DirectorLink from "./utils/DirectorLink";
import SelectVideo from "./utils/SelectVideo";
import Preview from './utils/Preview';
import useHeaderEffect from "./utils/useHeaderEffect";

export default function Header({
  directorName,
  getSelectedItemCount,
  isHomepage,
  onPreviewClick,
  handleCloseOverlay,
  onCloseOverlay,
  overlayUrl,
  handleCheckboxChange,
  watchLaterUrl,
}) {
  const router = useRouter();
  const directorRef = useRef(null);
  const selectVideoRef = useRef(null);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    useHeaderEffect(
      router,
      directorRef,
      selectVideoRef,
      directorName,
    );
  }, [router.query.director, router.asPath, directorRef, selectVideoRef, directorName]);

  const handleVideoSelect = () => {
    setIsVideoSelected(true);
  };

  const handleVideoDeselect = () => {
    setIsVideoSelected(false);
  };

  const handleCopyLink = () => {
    event.preventDefault(); // prevent the link from opening
    const shareUrl = window.location.origin + watchLaterUrl; // use window.location.origin to get the full URL
    navigator.clipboard.writeText(shareUrl);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 20000);
  };

  return (
    <div className="top-0 sticky">
      <header className="sm:h-24 overflow-auto sm:overflow-scroll flex-nowrapwrap h-16 top-0 sticky bg-black  sm:px-24 px-12 flex sm:text-3xl text-14px uppercase pb-2 founder-regular text-white justify-between z-50 ">
        <div className=" flex items-center sm:w-2/3 w-auto justify-between shrink-0">
          <DirectorLink directorRef={directorRef} directorName={directorName} />
          <SelectVideo
            selectVideoRef={selectVideoRef}
            getSelectedItemCount={getSelectedItemCount}
            isHomepage={isHomepage}
            onSelect={handleVideoSelect}
            onDeselect={handleVideoDeselect}
            onCloseOverlay={onCloseOverlay}
          />
          <Preview onModalOpen={onPreviewClick} isHomepage={isHomepage} getSelectedItemCount={getSelectedItemCount} />
        </div>
        <div className="shrink-0 relative shareLink flex items-center opacity-50">
          <a href={watchLaterUrl} onClick={handleCopyLink}>
            <span>Share Link</span>
          </a>
          {showTooltip && (
            <div className="absolute whitespace-nowrap copied top-0 sm:top-5 -right-10  bg-gray-800 py-2 px-5 rounded-lg  text-14px text-white ">
              Copied to clipboard
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
