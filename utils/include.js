function includeHTML() {
    const includeElements = document.querySelectorAll("[data-include]");
    const promises = [];

    includeElements.forEach(el => {
        let file = el.getAttribute("data-include");
        const promise = fetch(file)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.statusText}`);
                return res.text();
            })
            .then(html => {
                el.innerHTML = html;
            })
            .catch(error => console.error("Error including HTML:", error));
        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        console.log("All HTML includes are finished.");
        const event = new Event("htmlIncluded");
        document.dispatchEvent(event);
    });
}

window.addEventListener("DOMContentLoaded", includeHTML);
