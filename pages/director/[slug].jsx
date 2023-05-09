// pages/director/[slug].tsx
import { GetServerSideProps } from "next";
import groq from "groq";
import { client } from "../../lib/sanity.client";
import { useRef, useState, useEffect } from "react";
import urlFor from "../../lib/urlFor";
import { useRouter } from "next/router";
import Header from "../../components/header";
import Footer from "../../components/Footer";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap/dist/gsap.js";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

function Overlay({
  checkedItems,
  onClose,
  directorSlug,
  directorName,
  director,
  contact,
  overlayUrl,
  setCheckedItems,
}) {
  const [watchLaterUrl, setWatchLaterUrl] = useState("");

  useEffect(() => {
    setWatchLaterUrl(generateWatchLaterUrl());
  }, [checkedItems]);

  const generateWatchLaterUrl = () => {
    const filmSlugs = checkedItems.map((item) => item.slug.current).join("_");
    return `/presentation/${directorSlug},${filmSlugs}`;
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCloseOverlay = () => {
    onClose();
  };

  useEffect(() => {
    const videos = document.querySelectorAll(".video");
    let dragSrcEl = null;

    function handleDragStart(e) {
      dragSrcEl = this;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", this.innerHTML);
      // Add a white border to the dragged item
      this.style.border = "1px solid white";
    }

    function handleDragEnd(e) {
      // Remove the white border from the dragged item
      this.style.border = "none";
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }

      e.dataTransfer.dropEffect = "move";
      return false;
    }
    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      const dragIndex = Array.from(videos).indexOf(dragSrcEl);
      const dropIndex = Array.from(videos).indexOf(this);
      const newCheckedItems = [...checkedItems];
      const [draggedItem] = newCheckedItems.splice(dragIndex, 1);
      newCheckedItems.splice(dropIndex, 0, draggedItem);
      setCheckedItems(newCheckedItems);
      const newWatchLaterUrl = generateWatchLaterUrl();
      setWatchLaterUrl(newWatchLaterUrl);
      return false;
    }

    function handleTouchStart(e) {
      dragSrcEl = this;
      this.style.border = "1px solid white";
    }

    function handleTouchEnd(e) {
      this.style.border = "none";
    }

    function handleTouchMove(e) {
      if (dragSrcEl) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    videos.forEach((video) => {
      video.addEventListener("dragstart", handleDragStart, false);
      video.addEventListener("dragend", handleDragEnd, false);
      video.addEventListener("dragover", handleDragOver, false);
      video.addEventListener("drop", handleDrop, false);
      video.addEventListener("touchstart", handleTouchStart, false);
      video.addEventListener("touchend", handleTouchEnd, false);
      video.addEventListener("touchmove", handleTouchMove, false);
    });

    return () => {
      videos.forEach((video) => {
        video.removeEventListener("dragstart", handleDragStart, false);
        video.removeEventListener("dragend", handleDragEnd, false);
        video.removeEventListener("dragover", handleDragOver, false);
        video.removeEventListener("drop", handleDrop, false);
        video.removeEventListener("touchstart", handleTouchStart, false);
        video.removeEventListener("touchend", handleTouchEnd, false);
        video.removeEventListener("touchmove", handleTouchMove, false);
      });
    };
  }, [checkedItems]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const header = document.querySelector(".badass a");
    const directorName = document.querySelector(".directorName");
    const fixedBar = document.querySelector(".fixed-bar");
    const footer = document.querySelector(".footer");
    if (window.innerWidth > 700) {
      ScrollTrigger.create({
        trigger: ".overlay-video",
        start: "top center",
        endTrigger: ".overlay-video",
        end: "center   center",

        scroller: ".overlay-video",
        onLeave: () => {
          fixedBar.style.pointerEvents = "auto";
          // $brandLink.value.classList.remove('isActive')
          gsap.to(header, {
            fontSize: 50,
            ease: "power4.out",
          });
          gsap.to(directorName, {
            fontSize: 20,
            marginLeft: 30,
            ease: "power4.out",
          });
          gsap.to(footer, {
            y: 0,
            ease: "power4.out",
          });
        },
        onEnterBack: () => {
          fixedBar.style.pointerEvents = "none";
          gsap.to(header, {
            fontSize: 200,
            ease: "power4.out",
          });
          gsap.to(directorName, {
            fontSize: 64,
            marginLeft: 60,
            ease: "power4.out",
          });
          gsap.to(footer, {
            y: 50,
            ease: "power4.out",
          });
        },
      });
    } else {
      ScrollTrigger.create({
        trigger: ".overlay-video",
        start: "10% center",
        endTrigger: ".overlay-video",
        end: "20%   center",

        scroller: ".overlay-video",
        onLeave: () => {
          gsap.to(header, {
            fontSize: 50,
            ease: "power4.out",
          });
          gsap.to(directorName, {
            fontSize: 18,
            ease: "power4.out",
            bottom: "calc(100% - 60px )",
          });
          gsap.to(footer, {
            y: 0,
            ease: "power4.out",
          });
        },
        onEnterBack: () => {
          gsap.to(header, {
            fontSize: 200,
            ease: "power4.out",
          });
          gsap.to(directorName, {
            fontSize: 32,
            ease: "power4.out",
            bottom: "35px",
            width: "100%",
          });
          gsap.to(footer, {
            y: 50,
            ease: "power4.out",
          });
        },
      });
    }
    // IF SCREEN WIDTH IF SMALLER THAN 800PX

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  return (
    <div
      className="fixed w-full h-full top-0 overlay bg-black overflow-scroll overlay-video"
      onClick={handleOverlayClick}
    >
      <Header
        directorName={directorName}
        getSelectedItemCount={() => checkedItems.length}
        isHomepage={undefined}
        watchLaterUrl={watchLaterUrl}
        overlayUrl={overlayUrl} // pass overlayUrl to Header component
        onCloseOverlay={handleCloseOverlay} // make sure onCloseOverlay is defined and passed as a prop
        onPreviewClick={undefined}
        handleCloseOverlay={undefined}
      />{" "}
      <div className="fixed-bar w-full md:w-auto  fixed h-full md:h-auto md:top-1/2 md:-translate-y-1/2 z-50  md:left-24 left-0 md:flex block items-center mix-blend-difference pointer-events-none">
        <h1 className="badass md:w-auto relative md:top-0 -top-14 ">
          <Link
            className="tungsten w-full text-center"
            href="https://badassfilms.tv/"
          >
            BADASS
          </Link>
        </h1>
        <h2 className=" directorName text-center w-full md:w-auto md:text-big text-big-mobile absolute bottom-14 md:relative md:bottom-0 md:ml-16 ml-0 text-white founder-semiBold uppercase">
          {director.name}
        </h2>
      </div>
      <div className="customFullHeight">
        {isMobile ? (
          <video
            className="h-full w-full object-cover"
            poster={urlFor(director.thumbnailImage).url()}
          ></video>
        ) : (
          <video
            className="h-full w-full object-cover"
            poster={urlFor(director.thumbnailImage).url()}
            src={director.reelUrl}
            autoPlay
            loop
          ></video>
        )}
      </div>
      <div className="overlay-content pt-40 pb-96 ">
        <ul className="sm:grid films flex flex-col  sm:px-24 px-12 sm:gap-24 gap-48 text-white ">
          {checkedItems.map((item, index) => (
            <li
              className="video flex flex-col justify-end relative"
              key={item.slug.current}
              draggable={!isMobile}
              style={{ cursor: isMobile ? "auto" : "move" }}
            >
              {isMobile ? (
                <video
                  poster={urlFor(item.thumbnailImage).url()}
                  src={item.videoLoopUrl}
                  muted
                ></video>
              ) : (
                <video
                  loop
                  src={item.videoLoopUrl}
                  autoPlay
                  poster={urlFor(item.thumbnailImage).url()}
                  muted
                ></video>
              )}
              <div className="pt-5 flex justify-between uppercase items-center">
                <div className="flex">
                  <h3 className="founder-semiBold  text-14px pr-2">
                    {item.client}
                  </h3>
                  <h4 className="founder-regular text-14px">{item.title}</h4>
                </div>
                <div>
                  <Image
                    src="/icons/arrows.svg"
                    alt="arrow"
                    height={15}
                    width={15}
                  />
                </div>
              </div>
              <div className="absolute -left-10  h-full flex flex-col justify-between">
                <Image
                  className="rotate-180 up-arrow"
                  src="/icons/arrows-red.svg"
                  alt="arrow"
                  height={20}
                  width={20}
                  onClick={() => {
                    const currentIndex = checkedItems.findIndex(
                      (item) =>
                        item.slug.current === checkedItems[index].slug.current
                    );
                    if (currentIndex > 0) {
                      const newCheckedItems = [...checkedItems];
                      const [removed] = newCheckedItems.splice(currentIndex, 1);
                      newCheckedItems.splice(currentIndex - 1, 0, removed);
                      setCheckedItems(newCheckedItems);
                    }
                  }}
                />
         <Image
  className="down-arrow"
  src="/icons/arrows-red.svg"
  alt="arrow"
  height={20}
  width={20}
  onClick={() => {
    const currentIndex = checkedItems.findIndex((item) => item.slug.current === checkedItems[index].slug.current);
    if (currentIndex < checkedItems.length - 1) {
      const newCheckedItems = [...checkedItems];
      const [removed] = newCheckedItems.splice(currentIndex, 1);
      newCheckedItems.splice(currentIndex + 1, 0, removed);
      setCheckedItems(newCheckedItems);
    }
  }}
/>

              </div>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
        <a
          href={generateWatchLaterUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>Open Watch Later</button>
        </a>
      </div>
      <Footer contact={contact} />;
    </div>
  );
}
export default function Director({ director, contact }) {
  const [checkedItems, setCheckedItems] = useState([]);

  const updateCheckedItems = (newItems) => {
    setCheckedItems(newItems);
  };
  const [overlayVisible, setOverlayVisible] = useState(false);
  const router = useRouter();
  const checkboxRefs = useRef({});
  const [overlayUrl, setOverlayUrl] = useState(""); // add overlayUrl state variable

  const handleCheckboxChange = (event, film) => {
    if (event.target.checked) {
      setCheckedItems([...checkedItems, film]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== film));
    }
  };

  const handleOverlayClose = () => {
    setOverlayVisible(false);
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
  };

  const handleModalOpen = () => {
    setOverlayVisible(true);
    const url = `/presentation/${director.slug.current},${checkedItems
      .map((item) => item.slug.current)
      .join("_")}`;
    setOverlayUrl(url); // set overlayUrl state when overlay is opened
  };

  const directorName = director.name;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  useEffect(() => {
    console.log(window.innerWidth);
  }, [isMobile]);

  return (
    <div className="">
      <Header
        directorName={directorName}
        getSelectedItemCount={() => checkedItems.length}
        onPreviewClick={handleModalOpen}
        onCloseOverlay={handleCloseOverlay}
        isHomepage={undefined}
        handleCloseOverlay={undefined}
        overlayUrl={overlayUrl} // pass overlayUrl to Header component
      />

      {director.relatedFilms && director.relatedFilms.length > 0 ? (
        <div className="sm:grid flex flex-col grid-cols-3 sm:gap-12 gap-32 sm:px-24 px-12 pt-24 pb-24 founder-regular sm:text-2xl text-14px uppercase">
          {director.relatedFilms.map(
            (film) =>
              film && (
                <div
                  className="cursor-pointer flex flex-col justify-end"
                  key={film._id}
                >
                  {isMobile ? (
                    <video
                      poster={urlFor(film.thumbnailImage).url()}
                      onClick={() => {
                        film.checkboxRef.click();
                      }}
                    ></video>
                  ) : (
                    <video
                      poster={urlFor(film.thumbnailImage).url()}
                      src={film.videoLoopUrl}
                      autoPlay
                      loop
                      onClick={() => {
                        film.checkboxRef.click();
                      }}
                    ></video>
                  )}
                  <div className="pt-5 flex justify-between">
                    <div className="flex">
                      <h3 className="founder-semiBold pr-2">{film.client}</h3>
                      <h4>{film.title}</h4>
                    </div>
                    <div className="flex items-center">
                      <input
                        onChange={(event) => handleCheckboxChange(event, film)}
                        ref={(checkbox) => (film.checkboxRef = checkbox)}
                        className="round-circle-no-fill"
                        type="checkbox"
                        id={`checkbox-${film._id}`}
                        name={`checkbox-${film._id}`}
                      />
                      <label htmlFor={`checkbox-${film._id}`}></label>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      ) : (
        <p>No films</p>
      )}

      {overlayVisible && (
        <Overlay
          checkedItems={checkedItems}
          onClose={handleOverlayClose}
          directorSlug={director.slug.current}
          directorName={directorName}
          director={director}
          contact={contact}
          setCheckedItems={setCheckedItems} // pass setCheckedItems as a prop
          overlayUrl={overlayUrl}
        />
      )}
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { slug } = context.query;
  const query = groq`*[_type == 'directors' && slug.current == $slug] {
      name,
      slug,
      reelUrl,
      thumbnailImage,
      relatedFilms[]->{
        _id,
        title,
        client,
        slug,
        releaseDate,
        videoLoopUrl,
        thumbnailImage,
        "posterUrl": poster.asset->url
      },
      thumbnailImage {
        asset->{
          url
        }
      }
    }[0]`;
  const director = await client.fetch(query, { slug });
  const contactQuery = groq`*[_type == 'contact'] {
    _createdAt,
    _id,
    _rev,
    _type,
    _updatedAt,
    address,
    credits,
    socialMedia,
    title
  }[0]`;
  const contact = await client.fetch(contactQuery);

  return { props: { director, contact } };
};
