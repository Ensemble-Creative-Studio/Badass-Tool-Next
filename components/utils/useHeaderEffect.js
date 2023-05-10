import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useHeaderEffects(directorRef, selectVideoRef, directorName) {
  const router = useRouter();

  useEffect(() => {
    function applyHeaderEffects() {
      const pageSlug = router.asPath.split("/")[1];

      if (pageSlug === "director") {
        if (router.asPath.includes("/director")) {
          console.log('director')
          if (selectVideoRef.current) {
            selectVideoRef.current.style.color = "#F93D3D";
            selectVideoRef.current.style.opacity = 1;
          }

          if (directorRef.current) {
            directorRef.current.style.color = "white";
            directorRef.current.style.opacity = 1;

            // update the director link text content with the director name
            if (directorName) {
              directorRef.current.lastChild.textContent = directorName;
            }
          }

          if (typeof window !== 'undefined' && window.innerWidth < 700) {
            const selectVideoElement = selectVideoRef.current;
            if (selectVideoElement) {
              const selectVideoRect = selectVideoElement.getBoundingClientRect();
              const headerElement = document.querySelector('header');
              const headerRect = headerElement.getBoundingClientRect();

              const centerOffsetX = (headerRect.width / 2) - (selectVideoRect.width / 2);

              const scrollToX = selectVideoRect.left + window.scrollX - headerRect.left - centerOffsetX;

              headerElement.scrollTo({
                left: scrollToX,
                top: 0,
                behavior: 'smooth'
              });

              // add event listener to 'Preview' button
              const previewButton = document.querySelector('.preview');

              previewButton.addEventListener('click', () => {
                console.log("preview click")
                setTimeout(() => {
                  const overlayHeader =  document.querySelector('.overlay-video header');
                  const scrollToXnew = headerElement.scrollWidth - headerRect.width;

                  overlayHeader.scrollTo({
                    left: scrollToXnew,
                    top: 0,
                    behavior: 'smooth'
                  });
                });
              }, 300);
            }

          } else {
            // reset styles if the screen width is wider than 700px
            if (selectVideoRef.current) {
              selectVideoRef.current.style.position = '';
              selectVideoRef.current.style.top = '';
              selectVideoRef.current.style.left = '';
            }
          }
        }
      } else {
        if (selectVideoRef.current) {
          selectVideoRef.current.style.color = "white";
          selectVideoRef.current.style.opacity = 0.5;
        }

        if (directorRef.current) {
          directorRef.current.style.color = "#F93D3D";
          directorRef.current.style.opacity = 1;
        }
      }
    }

    applyHeaderEffects();

    // reapply the effects when the route changes or the refs/props change
    router.events.on('routeChangeComplete', applyHeaderEffects);

    return () => {
      router.events.off('routeChangeComplete', applyHeaderEffects);
    };
  }, [router, directorRef, selectVideoRef, directorName]);
}
