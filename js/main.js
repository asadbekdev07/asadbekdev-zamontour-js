document.addEventListener("DOMContentLoaded", function() {
    // BURGER
    const modifiers = {
        elSiteHeaderOpen: "site-header--open"
    }

    const elSiteHeader = document.querySelector(".site-header");
    const elSiteHeaderToggler = elSiteHeader.querySelector(".site-header__toggler");

    if (elSiteHeaderToggler) {
        elSiteHeaderToggler.addEventListener("click", function () {
            elSiteHeader.classList.toggle(modifiers.elSiteHeaderOpen);
        });
    }

    // MAIN-SLIDER
    const slides = document.querySelectorAll('.slider__item');
    const progressBars = document.querySelectorAll('.controller__progressbar-fill');
    const labels = document.querySelectorAll('.controller__label');
    const duration = 5000; // Duration for each slide in milliseconds

    let currentIndex = 0;
    let progressInterval;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        // Reset all progress bars
        progressBars.forEach(progressBar => {
            progressBar.style.width = '0%';
            progressBar.style.transition = 'none';
        });

        // Show the current slide
        slides[index].style.display = 'block';
        // Animate the progress bar of the current slide
        progressBars[index].style.transition = `width ${duration}ms linear`;
        progressBars[index].style.width = '100%';
    }

    function startSlideshow() {
        showSlide(currentIndex);

        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, duration);
    }

    // Start the slideshow
    startSlideshow();

    // Add click event listener to each controller label
    labels.forEach((label, index) => {
        label.addEventListener('click', () => {
            // Show the corresponding slide when the label is clicked
            showSlide(index);
            currentIndex = index; // Update current index
        });
    });


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

        // LOCATION-CARD
        const cards = document.querySelectorAll(".card");

        cards.forEach((card) => {
            card.addEventListener("click", function() {
                // Remove the active class from all cards
                cards.forEach((c) => c.classList.remove("active"));
                // Add the active class to the clicked card
                card.classList.add("active");
            });
        });

        // TELEGRAM

        const form = document.querySelector("form");
        const telegramTokenBot = "6913787807:AAFBNLiHn-ysNkKEh-bCjIiWCwBDIiqdVLY";
        const chatId = "6726160029";

        const message = {
            loading: "Loading...",
            success: "We're deeply grateful you've entrusted your travel plans to our agency.",
            failure: "Something went wrong"
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault()


            const statusMessage = document.createElement("div");
            statusMessage.style.cssText = `
            color: #22b3c1;
            text-align: center;
            font-size: 20px;
            margin-top: 10px;
            `
            form.append(statusMessage)

            const formData = new FormData(form);

            const object = {}
            formData.forEach((value, key) => {
                object[key] = value
            })


            fetch(`https://api.telegram.org/bot${telegramTokenBot}/sendMessage`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                chat_id: chatId,
                text: `
                Name: ${object.name},
                Phone: ${object.phone},
                Number: ${object.number},
                Date: ${object.date},
                Destination: ${object.destination},
                Country: ${object.country},
                `
            }),
        })
        .then(() => (statusMessage.textContent = message.success), form.reset())
        .catch(() => (statusMessage.textContent = message.failure))
        .finally(() => {
            setTimeout(() => {
                statusMessage.remove()
            }, 1000)
        })
    })

});
