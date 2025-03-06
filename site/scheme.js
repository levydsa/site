const root = document.documentElement;

const toggleScheme = () => {
    let theme = root.getAttribute("data-theme");
    theme = theme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
};

const toggle = document.querySelector("#scheme-toggle");
toggle.addEventListener("click", toggleScheme);
