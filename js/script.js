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
    headers = document.querySelectorAll("h1, h2, h3");


    headers.forEach(h => {
        const listItem = generateListItem(h);
        ul.append(listItem);
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
    const tocWidth = toc.querySelector("ul").offsetWidth + 80;
    if (window.innerWidth < (maxArticleWidth + (tocWidth * 2))) toc.classList.add("static");
    else toc.classList.remove("static");
}

window.addEventListener("resize", tocListener);
populateToc();



const hs = document.querySelectorAll("h1, h2, h3");
hs.forEach(h => {
    setTimeout(() => {
        if(h.getBoundingClientRect().y <= 80) {
            setActive(h);
        }
    }, 150)
});

window.addEventListener('scroll', ()=> {
    hs.forEach(h=> {
        if(h.getBoundingClientRect().y <= 80) setActive(h);
    })
    if((window.scrollY + window.innerHeight) > (document.body.scrollHeight - 10)) setActive(hs[hs.length - 1]);
});


function setActive(el) {
    const lis = document.querySelectorAll("nav.toc li");
    lis.forEach(li => {
        li.classList.remove("active");
    })
    document.querySelector(`li[data-for=${el.id}]`).classList.add("active")
}

document.querySelectorAll("pre").forEach(pre =>{
    if(pre.offsetHeight < 200) {
        pre.classList.add("no_expand");
    }
    else {
        pre.setAttribute("data-height", pre.offsetHeight);
        pre.style="height: 10rem;"
        pre.classList.add("expandable")
    }
    pre.addEventListener("click", ()=>{
        pre.style=`height: ${pre.getAttribute("data-height")}px`;
        pre.classList.add("expanded");
        setTimeout(()=> {
            pre.style="height: 100%; "
            pre.classList.add("scrollable")
        }, 500)
    })
})