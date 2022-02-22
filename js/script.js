function page(name) { if (document.body.classList.contains(name)) return true; return false; }
hljs.highlightAll();

if (page("home")) {
    document.querySelector("section.introduction a.arrow").addEventListener("click", () => {
        window.scrollBy(0, 500)
    });
}


function populateToc() {
    const nav = document.querySelector("nav.toc"),
        ul = nav.querySelector("ul");
    let headers = document.querySelectorAll("h1, h2, h3");
    if (page("home")) headers = document.querySelectorAll("h1,h2")



    headers.forEach(h => {
        if (!h.classList.contains("no_index")) {
            const listItem = generateListItem(h);
            ul.append(listItem);
        }
    });

    tocListener();
}

function generateListItem(h) {
    const li = document.createElement("li"),
        id = (h.getAttribute("data-id")) ? h.getAttribute("data-id") : h.id,
        a = document.createElement("a");

    li.setAttribute('data-for', id);

    a.href = `#${id}`;
    a.textContent = h.textContent;
    a.classList.add("link")
    li.appendChild(a);

    return li;
}



function tocListener() {
    const maxArticleWidth = 600;
    const toc = document.querySelector("nav.toc");
    const a = document.querySelector("a.link.back")
    const tocWidth = toc.querySelector("ul").offsetWidth + 80;
    console.log(tocWidth);
    if (window.innerWidth < (maxArticleWidth + (tocWidth * 2))) {
        toc.classList.add("static");
        if (page("project"))
            a.classList.add("static");
    }
    else {
        toc.classList.remove("static");
        if (page("project"))
            a.classList.remove("static");
    }
}

window.addEventListener("resize", tocListener);
populateToc();



let hs = document.querySelectorAll("h1, h2, h3");
if (page("home")) hs = document.querySelectorAll("h1,h2")
hs.forEach(h => {
    setTimeout(() => {
        if (h.getBoundingClientRect().y <= 80) {
            setActive(h);
        }
    }, 150);
});

window.addEventListener('scroll', () => {
    hs.forEach(h => {
        if (h.getBoundingClientRect().y <= 80) setActive(h);
    })
    if ((window.scrollY + window.innerHeight) > (document.body.scrollHeight - 10)) setActive(hs[hs.length - 1]);

    if (page("home")) {
        const odf = document.querySelector("section.introduction h2");
        if (odf.getBoundingClientRect().top < 0) {
            document.body.classList.add("show_toc");
        } else document.body.classList.remove("show_toc")
    }
});




function setActive(el) {
    const lis = document.querySelectorAll("nav.toc li");
    lis.forEach(li => {
        li.classList.remove("active");
    })
    document.querySelector(`li[data-for=${el.id}]`).classList.add("active")
}

document.querySelectorAll("pre, .pre").forEach(pre => {
    if (pre.offsetHeight < 200) {
        pre.classList.add("no_expand");
    }
    else {
        pre.setAttribute("data-height", pre.offsetHeight);
        pre.style = "height: 10rem;"
        pre.classList.add("expandable")
    }
    pre.addEventListener("click", () => {
        pre.style = `height: ${pre.getAttribute("data-height")}px`;
        pre.classList.add("expanded");
        setTimeout(() => {
            pre.style = "height: 100%; "
            pre.classList.add("scrollable")
        }, 500)
    })
    pre.scrollTo(0, 0)
})

document.querySelectorAll("figure.expand").forEach(figure => {
    figure.querySelector("img").addEventListener("load", () => {
        figure.setAttribute("data-height", figure.offsetHeight);
        figure.style = `height: 10rem; `
        figure.classList.add("expandable")

    });
    figure.addEventListener("click", () => {
        figure.style = `height: ${figure.getAttribute("data-height")}px`;
        figure.classList.add("expanded");
        setTimeout(() => {
            figure.style = "height: 100%";
        }, 500);
    });
})

document.querySelectorAll("section.project article p a").forEach(a => {
    a.setAttribute("target", "_blank")
});