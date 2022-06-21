const globalNewsArr = [];
let randomIdGen = 100;

const idGenerator = () => {
    let id = Math.round(Math.random() * randomIdGen);
    randomIdGen += 100;
    return id;
}

const fetchNews = async (url) => {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}`);
    const news = await response.json();
  globalNewsArr.push(news);
}

const getNewsData = (magazines) => {
  magazines.forEach(url => {
    fetchNews(url);
  })
}
getNewsData(magazines);

const getDate = (dateString) => {
  let date = new Date(dateString);
  let fullDate = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
  return fullDate;
}

const newsCard = (news) => {
  return `<a href="${news.link}">
                      <div class="card">                      
                      <img src="${news.enclosure.link}" class="card-img-top" alt="...">
                      <div class="card-body">
                              <h3 class="card-title">${news.title}</h3>
                              <div class = "d-flex align-items-center">
                                <h6 class = "author">${news.author}</h6>
                                <div class = "ellipse"></div>
                                <h6 class = "author">${getDate(news.pubDate)}</h6>
                              </div>
                              <p class="card-text">${news.content}</p>
                      </div>                      
                    </div>
                    </a>`;
}

const carouselItem = (rssFeed) => {
  let newsItems = rssFeed.items;
  let completeNewsCarousel = "";
  newsItems.forEach((news, index) => {
    let newsItemDiv = document.createElement("div");
    if (index === 0) {
      newsItemDiv.classList.add("carousel-item",'active');
    }else
      newsItemDiv.classList.add("carousel-item");
    newsItemDiv.innerHTML += newsCard(news);
    completeNewsCarousel += newsItemDiv.outerHTML;
  })
  return completeNewsCarousel;
}

const makeCarousel = (rssFeed) => {
    let carouselId = `carouselId${idGenerator()}`;
    return `<div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                                                        <div class="carousel-inner">
                                                        ${carouselItem(rssFeed)}
                                                        </div>
                                                        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}"
                                                                data-bs-slide="prev">
                                                                <i class="fa-solid fa-angle-left" style = "color:black"></i>
                                                                <span class="visually-hidden">Previous</span>
                                                        </button>
                                                        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}"
                                                                data-bs-slide="next">
                                                                <i class="fa-solid fa-angle-right" style = "color:black"></i>
                                                                <span class="visually-hidden">Next</span>
                                                        </button>
                                                </div>`;
}

const makeAccordion = () => {
  let accordion = document.getElementById("newsAccordion");
  // console.log('acoordion array',globalNewsArr)
  globalNewsArr.forEach((rssFeed, index) => {
      // console.log(rssFeed,index)
    let accordionHeaderId = `accordion${idGenerator()}`
        let accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
        let collapsibleBodyId = `collapse${idGenerator()}`;
        accordionItem.innerHTML = `<h2 class="accordion-header" id="${accordionHeaderId}">
                                        <button class="accordion-button ${index===0?'':'collapsed'}" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#${collapsibleBodyId}" aria-expanded="true" aria-controls="collapseOne">
                                                ${rssFeed.feed.title}
                                        </button>
                                </h2>
                                <div id="${collapsibleBodyId}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="${accordionHeaderId}">
                                        <div class="accordion-body px-0 pt-0">
                                        ${makeCarousel(rssFeed)}
                                        </div>
                                </div>`;
      accordion.append(accordionItem);
    });
}

setTimeout(()=>makeAccordion(),"2000")

