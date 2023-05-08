// DirectorLink.js
import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";
export default function Footer({ contact, films }) {
  const [isContactActive, setIsContactActive] = useState(false);

  const handleContactClick = () => {
    setIsContactActive(!isContactActive);
  };
  const handleDownloadAllClick = () => {
    console.log('ckioo')
    films.forEach((film, index) => {
      console.log(film.downloadVideoUrl)
      
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = film.downloadVideoUrl;
        link.download = `${film.title}_${index}.mp4`;
        link.click();
      }, index * 1000);
    });
  };
  

  return (
    <div>
      <div className="h-12 z-40 bg-black films gap-24 films grid uppercase  fixed bottom-0 left-0 w-full text-red  text-14px  sm:px-24 px-12 ">
        <button
        onClick={handleContactClick}       
           className=" text-red  text-14px uppercase founder-semiBold justify-self-start "
        >
          Contact
        </button>
        <button className="flex justify-between items-center" onClick={handleDownloadAllClick}>
          <div className="relative right-8 sm:right-0">
            <span className=" text-red  text-14px uppercase founder-semiBold pr-4 ">
              download
            </span>
            <span className=" text-red  text-14px founder-regular uppercase ">
              all
            </span>
          </div>
          <Image
            src="/icons/arrows-red.svg"
            alt="arrow"
            height={15}
            width={15}
          />
        </button>
      
      </div>
      <div
        className={`ContactOverlay ${
          isContactActive ? "active" : ""
        }`}
      >
          <div className="ContactOverlay__container">
            <div className="ContactOverlay__names">
              <ul className="list">
                {contact.credits.map((credit) => (
                  <li key={credit._key} className="item">
                    <h2 className="item__name">{credit.name}</h2>
                    <h3 className="item__role">{credit.role}</h3>
                    <a href={`mailto:${credit.mail}`} className="item__mail">
                      {credit.mail}
                    </a>
                    <p className="item__phone">{credit.phone}</p>
                  </li>
                ))}
                <li className="item">
                  <h2 className="item__name">BADASS</h2>
                  <h3 className="item__role">{contact.address.streetName}</h3>
                  <p className="item__address">{contact.address.city}</p>
                  <p className="item__country">{contact.address.country}</p>
                </li>
              </ul>
            </div>
            <div className="ContactOverlay__socials">
              <ul className="list">
                <li className="item">
                  <a
                    href={contact.socialMedia.instagram}
                    target="_blank"
                    className="item__link"
                  >
                    Instagram
                  </a>
                </li>
                <li className="item">
                  <a
                    href={contact.socialMedia.facebook}
                    target="_blank"
                    className="item__link"
                  >
                    Facebook
                  </a>
                </li>
                <li className="item">
                  <a
                    href={contact.socialMedia.vimeo}
                    target="_blank"
                    className="item__link"
                  >
                    Vimeo
                  </a>
                </li>
              </ul>
            </div>
            <div className="ContactOverlay__credits">
              <a
                href="https://www.ensemble.ooo"
                target="_blank"
                className="ContactOverlay__credits-inner"
              >
                Website by Ensemble
              </a>
            </div>
          </div>
        </div>
    </div>
  )
}
