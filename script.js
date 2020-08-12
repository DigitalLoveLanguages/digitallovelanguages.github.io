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
axiosArena.get("channels/webzine-landscape-blob-pngs?per=100").then(response => {
  console.log(response);
  if (response.data && response.data.contents.length > 1) {
    orientationWrapper.removeChild(loading);
    // for testing purposes, triple the length of blocks
    var blocks = [];
     for (let i=0; i<response.data.contents.length*3; i++) {
       var j = i%response.data.contents.length;
       blocks.push(response.data.contents[j])
     }
     // then place the blocks
    randomlyPlaceBlobs(blocks);
  } else {

  }
});




function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function randomlyPlaceBlobs(arenaBlocks) {
  for (let i=0; i<arenaBlocks.length; i++) {
    //create block
    let block = document.createElement("div");
    block.className = "block";

    if (arenaBlocks[i].source) {
      block = document.createElement("a");
      block.className = "block";
      block.href = arenaBlocks[i].source.url;
      block.target = "_blank";
    }

    if (arenaBlocks[i].class === "Channel") {
      block = document.createElement("a");
      block.className = "channel";
      block.href = `https://are.na/${arenaBlocks[i].user.slug}/${arenaBlocks[i].slug}`;
      block.target = "_blank";
    }

    //create image
    if (arenaBlocks[i].image) {
      var randWidth = randomIntFromInterval(60, 650)
      const image = document.createElement("img");
      image.className = "image blobImage";
      image.src = arenaBlocks[i].image.square.url;
      $(image).width(randWidth);

      // move the blob by a random position to make things a bit less grid-like
      var delta = 500;
      var moveLeftPixels = randomIntFromInterval(0, delta);
      var moveTopPixels = randomIntFromInterval(0, delta);
      $(image).css({'left': moveLeftPixels, 'top': moveTopPixels});

      // append to html
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
