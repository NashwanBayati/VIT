let words = document.querySelectorAll(".word");
words.forEach((word)=>{
    let letters = word.textContent.split("");
    word.textContent =""
    letters.forEach((letter)=>{
        let span = document.createElement("span");
        span.textContent = letter;
        span.className = "letter";
        word.append(span);

    })
})

let currentwordindex = 0;
let maxword = words.length -1;
words[currentwordindex].style.opacity = ["1"];

let changetext = ()=>{
    let currentword = words[currentwordindex]
    let nextword = currentwordindex === maxword ? words[0] : words[currentwordindex + 1]

    Array.from(currentword.children).forEach((letter,i)=>{
        setTimeout(()=>{
            letter.className = "letter out";
        },i * 80);
    })

    nextword.style.opacity = "1";
    Array.from(nextword.children).forEach((letter,i)=>{
        letter.className = "letter behind";
        setTimeout(()=>{
            letter.className = "letter in";
        },340 + i * 80);
    })    
    
    currentwordindex = currentwordindex === maxword ? 0 : currentwordindex + 1;
}

changetext()
setInterval(changetext,3000)

const circles = document.querySelectorAll('.circle');
circles.forEach(elem=>{
    var dots = elem.getAttribute("data-dots");
    var marked = elem.getAttribute("data-percent");
    var percent = Math.floor(dots*marked/100);
    var points = "";
    var rotate = 360 / dots;

    for(let i = 0 ; i < dots ; i++){
        points += `<div class="points" style="--i:${i}; --rot:${rotate}deg"></div>`
    }
    elem.innerHTML = points;

    const pointsmarked = elem.querySelectorAll('.points');
    for(let i = 0; i<percent ; i++){
        pointsmarked[i].classList.add('marked')
    }
})

function calc (ope) {
    if (ope == 'a') 
    document.getElementById("nav").style.display = "block";
    document.getElementsByClassName("fa-bars")[0].style.display = "none";
    document.getElementsByClassName("fa-xmark")[0].style.display = "block";
}
function cal (ope) {
    if (ope == 'b') 
    document.getElementById("nav").style.display = "none";
    document.getElementsByClassName("fa-bars")[0].style.display = "block";
    document.getElementsByClassName("fa-xmark")[0].style.display = "none";
}

const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show-items");
        }else{
            entry.target.classList.remove("show-items");
        }
    })
})

const scrollscale = document.querySelectorAll(".scroll-scale");
scrollscale.forEach((el)=>observer.observe(el));

const scrollbottom = document.querySelectorAll(".scroll-bottom");
scrollbottom.forEach((el)=>observer.observe(el));

const scrolltop = document.querySelectorAll(".scroll-top");
scrolltop.forEach((el)=>observer.observe(el));

