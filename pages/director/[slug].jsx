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
  setCheckedItems
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
    const header = document.querySelector(".badass");
  
    ScrollTrigger.create({
      trigger: ".overlay-content",
      start: "top top",
      endTrigger: ".overlay-content",
      end: "bottom top",
      onEnter: () => {
        gsap.to(header, { fontSize: "64px", duration: 0.5 });
      },
      onLeaveBack: () => {
        gsap.to(header, { fontSize: "96px", duration: 0.5 });
      },
    });
  
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
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
        watchLaterUrl ={watchLaterUrl}
        overlayUrl={overlayUrl} // pass overlayUrl to Header component
        onCloseOverlay={handleCloseOverlay} // make sure onCloseOverlay is defined and passed as a prop
        onPreviewClick={undefined} handleCloseOverlay={undefined}  
            />{" "}
          <div className="fixed-bar fixed top-1/2 -translate-y-1/2  left-24 flex items-center mix-blend-difference">
      <h1 className="badass">
        <Link className="tungsten"  href='https://badassfilms.tv/'>BADASS</Link>
      </h1>
      <h2 className="pl-8 directorName text-big ml-16 text-white founder-semiBold uppercase">{director.name}</h2>
    </div> 
      <div className="customFullHeight">
        <video
          className="h-full w-full object-cover"
          poster={urlFor(director.thumbnailImage).url()}
          src={director.reelUrl}
          autoPlay
          loop
        ></video>
      </div>
      <div className="overlay-content pt-40 pb-96 ">
        <ul className="sm:grid films flex flex-col  sm:px-24 px-12 sm:gap-24 gap-48 text-white ">
          {checkedItems.map((item, index) => (
            <li
              className="video"
              key={item.slug.current}
              draggable={true}
              style={{ cursor: "move" }}
            >
              <video
                poster={urlFor(item.thumbnailImage).url()}
                src={item.videoLoopUrl}
                loop
                autoPlay
              ></video>
              <div className="pt-5 flex justify-between uppercase items-center">
                <div className="flex">
                  <h3 className="founder-semiBold  text-14px pr-2">{item.client}</h3>
                  <h4 className="founder-regular text-14px">{item.title}</h4>
                </div>
                <div>
                <Image src="/icons/arrows.svg" alt='arrow' height={15} width={15} />

                </div>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
        <a href={generateWatchLaterUrl()} target="_blank" rel="noopener noreferrer">
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
                <div className="cursor-pointer" key={film._id}>
                  <video
                    poster={urlFor(film.thumbnailImage).url()}
                    src={film.videoLoopUrl}
                    autoPlay
                    loop
                    onClick={() => {
                      film.checkboxRef.click();
                    }}
                  ></video>
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