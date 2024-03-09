import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function setUpAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.title', {
        scrollTrigger: {
            trigger: ".title",
            scroller: "#scroll-container",
            start: "top center"
        },
        duration: 1.5,
        y: '-100%',
        ease: "power4.out",
        stagger: 0.3,
    })

    gsap.from('.project', {
        scrollTrigger: {
            trigger: "#project-track",
            scroller: "#scroll-container",
            start: "top bottom"
        },
        duration: 0.8,
        x: '300%',
        ease: "power3.out",
        stagger: 0.2
    })

    gsap.from('.experience', {
        scrollTrigger: {
            trigger: "#experience-track",
            scroller: "#scroll-container",
            start: "top bottom"
        },
        duration: 0.8,
        x: '200%',
        ease: "power3.out",
        stagger: 0.2
    })

    gsap.from('.end-title', {
        scrollTrigger: {
            trigger: ".end-title",
            scroller: "#scroll-container",
            start: "top center"
        },
        duration: 1,
        y: '-100%',
        ease: "power3.out",
    })

    // const navLinks = document.querySelectorAll(".nav-link");
    // const sections = document.querySelectorAll("section");
    // navLinks.forEach((nav) => {
    //     ScrollTrigger.create({
    //         trigger: `#${nav.id}-section`,
    //         scroller: "#scroll-container",
    //         start: "bottom top",
    //         onEnter: () => {
    //             console.log(nav)
    //         },
    //         onLeave: () => nav.classList.remove('active')
    //     })
    // })

};