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
    dragSection.onmousedown = e => { trackElement.dataset.mouseDownAt = e.clientX; }
    dragSection.onmousemove = e => {
        if (trackElement.dataset.mouseDownAt === "0") return;
        const mouseDelta = parseFloat(trackElement.dataset.mouseDownAt) - e.clientX,
            maxDelta = window.innerWidth / 2;

        const precentage = (mouseDelta / maxDelta) * -100,
            unconstrainedNextPercentage = parseFloat(trackElement.dataset.dragPercentage) + precentage,
            nextPercentage = Math.max(Math.min(unconstrainedNextPercentage, 0), -100);

        trackElement.dataset.percentage = nextPercentage;

        trackElement.animate({ transform: `translate(${nextPercentage}%,-50%)` },
            { duration: 1200, fill: "forwards" });

        for (const image of trackElement.getElementsByClassName("project-background")) {
            image.animate({ objectPosition: `${100 + nextPercentage}% center` },
                { duration: 1200, fill: "forwards" });
        }
    }
    dragSection.onmouseup = () => {
        trackElement.dataset.mouseDownAt = "0";
        trackElement.dataset.dragPercentage = trackElement.dataset.percentage;
    }
}


