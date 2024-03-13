import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

export function setUpComponents() {
    // image-track slider
    const projectSection = document.querySelector("#projects-section")
    const projectTrack = document.getElementById("project-track")
    createDraggableTrack(projectSection, projectTrack)

    // experience-track slider
    const historySection = document.querySelector("#workhistory-section")
    const experienceTrack = document.getElementById("experience-track")
    createDraggableTrack(historySection, experienceTrack)


    //Page progress bar
    const scrollContainer = document.querySelector("#scroll-container")
    scrollContainer.addEventListener('scroll', () => {
        const { scrollHeight, scrollTop } = scrollContainer;
        const scrollPrecentage = `${(scrollTop / (scrollHeight - window.innerHeight)) * 100}%`;
        document.querySelector("#progress-bar").style.setProperty('--progress', scrollPrecentage)
    });

    // Nav-links
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");
    let currentSection = "intro";
    scrollContainer.addEventListener('scroll', () => {
        sections.forEach(section => {
            if ((scrollContainer.scrollTop + window.innerHeight / 2) >= section.offsetTop) {
                currentSection = section.id.replace('-section', '');
            }
        })

        navLinks.forEach((nav) => {
            if (nav.id.indexOf(`${currentSection}`) > -1) {
                document.querySelector('.active').classList.remove('active');
                nav.classList.add('active');
            };
        });
    });

    gsap.registerPlugin(ScrollToPlugin)
    navLinks.forEach((nav) => {
        nav.addEventListener('click', () => {
            gsap.to(scrollContainer, { duration: 0.8, scrollTo: `#${nav.id}-section` })
        })
    })
}

function createDraggableTrack(dragSection, trackElement) {
    dragSection.addEventListener("touchstart", evt => {
        const touches = evt.changedTouches;
        trackElement.dataset.mouseDownAt = touches[0].clientX;
    });
    dragSection.addEventListener("mousedown", e => {
        trackElement.dataset.mouseDownAt = e.clientX;
    })

    function dragTrackByPrecentage(dragPrecentage) {
        const unconstrainedNextPercentage = parseFloat(trackElement.dataset.dragPercentage) + dragPrecentage,
            nextPercentage = Math.max(Math.min(unconstrainedNextPercentage, 0), -100);

        trackElement.dataset.percentage = nextPercentage;

        trackElement.animate({ transform: `translate(${nextPercentage}%,-50%)` },
            { duration: 1200, fill: "forwards" });

        for (const image of trackElement.getElementsByClassName("project-background")) {
            image.animate({ objectPosition: `${100 + nextPercentage}% center` },
                { duration: 1200, fill: "forwards" });
        }
    }

    //Listen toucmove on trackElement + preventdefault() prevents browser scrolls vertically to other section while dragging
    // but still allows scrolling vertically outside trackelement.
    dragSection.addEventListener("touchmove", e => {
        if (trackElement.dataset.mouseDownAt === "0") return;

        const touches = e.changedTouches;
        const touchDelta = parseFloat(trackElement.dataset.mouseDownAt) - touches[0].clientX,
            maxDelta = window.innerWidth,
            precentage = (touchDelta / maxDelta) * -100;

        dragTrackByPrecentage(precentage);
    })

    dragSection.addEventListener("mousemove", e => {
        if (trackElement.dataset.mouseDownAt === "0") return;
        const mouseDelta = parseFloat(trackElement.dataset.mouseDownAt) - e.clientX,
            maxDelta = window.innerWidth / 2,
            precentage = (mouseDelta / maxDelta) * -100;

        dragTrackByPrecentage(precentage);
    })

    function handelDraggingEnd() {
        trackElement.dataset.mouseDownAt = "0";
        trackElement.dataset.dragPercentage = trackElement.dataset.percentage;
    }
    dragSection.addEventListener("mouseup", handelDraggingEnd);
    dragSection.addEventListener("touchend", handelDraggingEnd);
    dragSection.addEventListener("touchcancel", handelDraggingEnd);
}


