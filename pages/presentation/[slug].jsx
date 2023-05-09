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
import VideoPlayer from "../../components/utils/VideoPlayer";
import { gsap } from "gsap/dist/gsap.js";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function WatchLater({ director, contact, films }) {

    const [activeVideoIndex, setActiveVideoIndex] = useState(-1);
  
    const handleVideoClick = (index) => {
      setActiveVideoIndex(index);
    };
  
    const handleCloseOverlay = () => {
      setActiveVideoIndex(-1);
    };
    useEffect(() => {
    
      gsap.registerPlugin(ScrollTrigger);
        const header = document.querySelector(".badass a");
        const directorName = document.querySelector(".directorName");
        const fixedBar = document.querySelector(".fixed-bar");
        const footer = document.querySelector(".footer");
        if (window.innerWidth > 700) {
    
          ScrollTrigger.create({
            trigger: ".overlay-video",
            start: "10% center",
            endTrigger: ".overlay-video",
            end: "20%   center",
        
            scroller: '.overlay-video',
            onLeave: () => {
              fixedBar.style.pointerEvents = "auto";
              // $brandLink.value.classList.remove('isActive')
              gsap.to(header, {
                fontSize: 50,
                ease: 'power4.out',
              })
              gsap.to(directorName, {
                fontSize: 20,
                marginLeft: 30,
                ease: 'power4.out',
              })
              gsap.to(footer, {
                y: 0,
                ease: 'power4.out',
              })
            },
            onEnterBack: () => {
              fixedBar.style.pointerEvents = "none";
              gsap.to(header, {
                fontSize: 200,
                ease: 'power4.out',
              })
              gsap.to(directorName, {
                fontSize: 64,
                marginLeft: 60,
                ease: 'power4.out',
              })
              gsap.to(footer, {
                y: 50,
                ease: 'power4.out',
              })
            },
          })
        }
    
    else{
      ScrollTrigger.create({
    
        trigger: ".overlay-video",
        start: "10% center",
        endTrigger: ".overlay-video",
        end: "20%   center",

        scroller: '.overlay-video',
        onLeave: () => {
          gsap.to(header, {
            fontSize: 50,
            ease: 'power4.out',
            top:'35px'
          })
          gsap.to(directorName, {
            fontSize: 18,
            ease: 'power4.out',
            bottom: 'calc(100% - 90px )',
          })
          gsap.to(footer, {
            y: 0,
            ease: 'power4.out',
          })
        },
        onEnterBack: () => {
          gsap.to(header, {
            fontSize: 200,
            ease: 'power4.out',
            top:'0'
          })
          gsap.to(directorName, {
            fontSize: 32,
            ease: 'power4.out',
            bottom: '0',
            width:'100%',
            
          })
          gsap.to(footer, {
            y: 50,
            ease: 'power4.out',
          })
        },
      })
    
    }
    // IF SCREEN WIDTH IF SMALLER THAN 800PX
      
    
      
      
        return () => {
          ScrollTrigger.getAll().forEach((trigger) => {
            trigger.kill();
          });
        };
      }, []);
    return (
      <div className="fixed w-full h-full top-0 overlay bg-black overflow-scroll overlay-video">
        <div className="fixed-bar w-full md:w-auto  fixed h-full md:h-auto md:top-1/2 md:-translate-y-1/2 z-50  md:left-24 left-0 md:flex block items-center mix-blend-difference pointer-events-none">
      <h1 className="badass md:w-auto relative md:top-0 -top-14 ">
        <Link className="tungsten w-full text-center relative"  href='https://badassfilms.tv/'>BADASS</Link>
      </h1>
      <h2 className=" directorName text-center w-full md:w-auto md:text-big text-big-mobile absolute bottom-0 md:relative md:bottom-0 md:ml-16 ml-0 text-white founder-semiBold uppercase">{director.name}</h2>
    </div>  
      <div className="h-full">
          <video
            className="h-full w-full object-cover"
            poster={urlFor(director.thumbnailImage).url()}
            src={director.reelUrl}
            autoPlay
            loop
          ></video>
        </div>
        <div className="overlay-content pt-40 pb-96  ">
          <ul className="sm:grid films flex flex-col sm:px-24 px-12 sm:gap-24 gap-48 text-white ">
            {films.map((item, index) => (
              <li className="video cursor-pointer " key={item.slug.current} onClick={() => handleVideoClick(index)}>
                <video
                  loop
                  autoPlay
                  poster={urlFor(item.thumbnailImage).url()}
                  src={item.videoLoopUrl}
                  muted
                ></video>
                <div className="pt-5 flex justify-between uppercase items-center">
                  <div className="flex">
                    <h3 className="founder-semiBold text-14px pr-2">{item.client}</h3>
                    <h4 className="founder-regular text-14px">{item.title}</h4>
                  </div>
                  <div>
                    <a href={item.downloadVideoUrl} download>
                      <Image src="/icons/arrows.svg" alt="arrow" height={15} width={15} />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
       
        {activeVideoIndex !== -1 && (
        <VideoPlayer
          videoUrl={films[activeVideoIndex].fullVideoUrl}
          poster={urlFor(films[activeVideoIndex].thumbnailImage).url()}
          onClose={handleCloseOverlay}
          contact={contact} // pass the contact prop here
        />
      
        )}
  
        <Footer contact={contact} films={films} />
      </div>
    );
  }

export const getServerSideProps = async (context) => {
  const { slug } = context.query;
  const [directorSlug, filmSlugs] = slug.toString().split(",");
  const slugs = filmSlugs.split("_");

  console.log(directorSlug);
  const query = groq`*[_type == 'films' && slug.current in $slugs] {
  client,
  director->{
    name,
    slug
  },
  downloadVideoUrl,
  fullVideoUrl,
  videoLoopUrl,
  slug,
  thumbnailImage {
    asset->{
      url
    }
  },
  title
}`;

  const Directorquery = groq`*[_type == 'directors' && slug.current == $directorSlug] {
     name,
      slug,
      reelUrl,
      thumbnailImage,
   
      thumbnailImage {
        asset->{
          url
        }
      }
  }[0]`;
  const films = await client.fetch(query, { slugs });
  const director = await client.fetch(Directorquery, { directorSlug });
  console.log(director.name);
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
  console.log(films);
  return { props: { films, contact, director } };
};
