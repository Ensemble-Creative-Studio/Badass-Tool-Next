export default function applyHeaderEffects(router, directorRef, selectVideoRef, directorName) {
  const pageSlug = router.asPath.split("/")[1];

  if (pageSlug === "director") {
    if (router.asPath.includes("/director")) {
      selectVideoRef.current.style.color = "#F93D3D";
      directorRef.current.style.color = "white";
      directorRef.current.style.opacity = 1;
      selectVideoRef.current.style.opacity = 1;

      // update the director link text content with the director name
      if (directorRef.current && directorName) {
        directorRef.current.lastChild.textContent = directorName;
      }

      if (window.innerWidth < 700) {
        const selectVideoElement = selectVideoRef.current;
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
          setTimeout(() => {
            const overlayHeader =  document.querySelector('.overlay-video header');
            const scrollToXnew = headerElement.scrollWidth - headerRect.width;
            console.log(scrollToXnew)
    
              overlayHeader.scrollTo({
                left: scrollToXnew,
                top: 0,
                behavior: 'smooth'
              });
        
      
          });
          }, 300);
       
      } else {
        // reset styles if the screen width is wider than 700px
        selectVideoRef.current.style.position = '';
        selectVideoRef.current.style.top = '';
        selectVideoRef.current.style.left = '';
      }
    }
  } else {
    selectVideoRef.current.style.color = "white";
    directorRef.current.style.color = "#F93D3D";
    directorRef.current.style.opacity = 1;
    selectVideoRef.current.style.opacity = 0.5;
  }
};
