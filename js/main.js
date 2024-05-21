document.addEventListener("DOMContentLoaded", function() {

    // CAROUSEL

    const carousels = document.querySelectorAll(".carousel");
    const arrowBtns = document.querySelectorAll(".wrapper i");
    const wrappers = document.querySelectorAll(".wrapper");

    carousels.forEach((carousel, index) => {
        const firstCard = carousel.querySelector(".card");
        const firstCardWidth = firstCard.offsetWidth;

        let isDragging = false,
        startX,
        startScrollLeft,
        timeoutId;

        const dragStart = (e) => {
            isDragging = true;
            carousel.classList.add("dragging");
            startX = e.pageX;
            startScrollLeft = carousel.scrollLeft;
        };

        const dragging = (e) => {
            if (!isDragging) return;

            // Calculate the new scroll position
            const newScrollLeft = startScrollLeft - (e.pageX - startX);

            // Check if the new scroll position exceeds
            // the carousel boundaries
            if (newScrollLeft <= 0 || newScrollLeft >=
                carousel.scrollWidth - carousel.offsetWidth) {

                    // If so, prevent further dragging
                    isDragging = false;
                    return;
                }

                // Otherwise, update the scroll position of the carousel
                carousel.scrollLeft = newScrollLeft;
            };

            const dragStop = () => {
                isDragging = false;
                carousel.classList.remove("dragging");
            };

            const autoPlay = () => {
                // Return if window is smaller than 800
                if (window.innerWidth < 800) return;

                // Calculate the total width of all cards
                const totalCardWidth = carousel.scrollWidth;

                // Calculate the maximum scroll position
                const maxScrollLeft = totalCardWidth - carousel.offsetWidth;

                // Check if the carousel is at the end
                if (carousel.scrollLeft >= maxScrollLeft) {
                    // If at the end, reset scroll position to the beginning
                    carousel.scrollLeft = 0;
                } else {
                    // Otherwise, autoplay the carousel after every 3500ms
                    carousel.scrollLeft += firstCardWidth;
                }

                // Autoplay the carousel after every 3500ms
                timeoutId = setTimeout(autoPlay, 3500);
            };

            carousel.addEventListener("mousedown", dragStart);
            carousel.addEventListener("mousemove", dragging);
            document.addEventListener("mouseup", dragStop);
            wrappers[index].addEventListener("mouseenter", () => clearTimeout(timeoutId));
            wrappers[index].addEventListener("mouseleave", autoPlay);

            // Add event listeners for the arrow buttons to
            // scroll the carousel left and right
            arrowBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    const isLeftButton = btn.id === "left";
                    const currentWrapper = btn.closest(".wrapper");
                    if (wrappers[index] === currentWrapper) {
                        carousel.scrollLeft += isLeftButton ? -firstCardWidth : firstCardWidth;
                    }
                });
            });

            // Start autoplay when the page loads
            autoPlay();
        });

        const cards = document.querySelectorAll(".card");

        cards.forEach((card) => {
            card.addEventListener("click", function() {
                // Remove the active class from all cards
                cards.forEach((c) => c.classList.remove("active"));
                // Add the active class to the clicked card
                card.classList.add("active");
            });
        });
    });
