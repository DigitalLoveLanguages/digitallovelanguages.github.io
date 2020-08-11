$( document ).ready(function() {
    console.log( "ready!" );

let orientation = [];
const orientationWrapper = document.getElementById("orientation-blocks");

const axiosArena = axios.create({
  baseURL: "https://api.are.na/v2/",
});

let loading = document.createElement("div");
loading.className = "loading";
loading.innerHTML = 'loading...';
orientationWrapper.appendChild(loading);

axiosArena.defaults.headers.Authorization = 'Bearer ---' ;
axiosArena.get("channels/digital-love-looks?per=100").then(response => {
  console.log(response);
  if (response.data && response.data.contents.length > 1) {
    orientationWrapper.removeChild(loading);
    createOrientation(response.data.contents);
  } else {

  }
});

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createOrientation(orientationData) {
  for (let i=0; i<orientationData.length; i++) {
    //create block
    let block = document.createElement("div");
    block.className = "block";

    if (orientationData[i].source) {
      block = document.createElement("a");
      block.className = "block";
      block.href = orientationData[i].source.url;
      block.target = "_blank";
    }

    if (orientationData[i].class === "Channel") {
      block = document.createElement("a");
      block.className = "channel";
      block.href = `https://are.na/${orientationData[i].user.slug}/${orientationData[i].slug}`;
      block.target = "_blank";
    }

    //create image
    if (orientationData[i].image) {

      var randWidth = randomIntFromInterval(60, 650)
      const image = document.createElement("img");
      image.className = "image";
      image.src = orientationData[i].image.square.url;
      $(image).width(randWidth);
      block.appendChild(image);

    }
    //create title
    // if (orientationData[i].title) {
    //   const title = document.createElement("div");
    //   title.className = "title";
    //   title.innerHTML = orientationData[i].title;
    //   block.appendChild(title);
    // }

    //create text
    // if (orientationData[i].class === "Text") {
    //   const text = document.createElement("div");
    //   text.className = "text";
    //   text.innerHTML = orientationData[i].content;
    //   block.appendChild(text);
    // }

    orientationWrapper.appendChild(block);
  }
}

});
