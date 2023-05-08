import { GetServerSideProps } from "next";
import groq from "groq";
import { client } from "../../lib/sanity.client";
import { useRef, useState, useEffect } from "react";
import urlFor from "../../lib/urlFor";
import { useRouter } from "next/router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";
import Image from "next/image";
import VideoPlayer from "../../components/utils/VideoPlayer";

export default function WatchLater({ director, contact, films }) {

    const [activeVideoIndex, setActiveVideoIndex] = useState(-1);
  
    const handleVideoClick = (index) => {
      setActiveVideoIndex(index);
    };
  
    const handleCloseOverlay = () => {
      setActiveVideoIndex(-1);
    };
  
    return (
      <div className="fixed w-full h-full top-0 overlay bg-black overflow-scroll overlay-video">
        <div className="fixed-bar fixed top-1/2 -translate-y-1/2  left-24 flex items-center">
          <h1>
            <Link className="tungsten" href="https://badassfilms.tv/">
              BADASS
            </Link>
          </h1>
          <h2 className="pl-8 text-3xl text-white founder-semiBold uppercase">
            {director.name}
          </h2>
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
        <div className="overlay-content pt-40 pb-40 ">
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
