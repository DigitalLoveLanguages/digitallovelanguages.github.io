$(document).ready(function() {
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

  // function to get a sample of size numElements from an array
  function getRandomElementsFromArray(array, numElements) {
    var arr = [];
    const toReturn = []
    while(arr.length < numElements){
        var r = randomIntFromInterval(0, array.length)
        if(arr.indexOf(r) === -1) {
          arr.push(r);
          toReturn.push(array[r]);
        }
    }
    return toReturn;
  }

  axiosArena.defaults.headers.Authorization = 'Bearer ---' ;
  axiosArena.get("channels/webzine-landscape-blob-pngs?per=100").then(response => {
    console.log(response);
    if (response.data && response.data.contents.length > 1) {
      orientationWrapper.removeChild(loading);
      // for testing purposes, triple the number of blobs
      var blocks = [];
       for (let i=0; i<response.data.contents.length*3; i++) {
         var j = i%response.data.contents.length;
         blocks.push(response.data.contents[j])
       }
       // then place the blocks
      randomlyPlaceBlobs(blocks);

       // after placing the blocks, we add the click function
      // (html elements need to exist on the page before a click function can be added)
        $('.blobImage').click(function(e) {
            e.preventDefault();
            console.log('++ blob clicked');
            // find parent block
            var parentBlock = $(this).parent('.block');
            var linksWrapper = parentBlock.find('.linkswrapper');
            // toggle visibility of links wrapper
            linksWrapper.toggle();
            // also select three random blocks to put in linkswrapper
            var randomSample = getRandomElementsFromArray(availableBlocks, 3);
            // clear links wrapper
            linksWrapper.empty();
            // then populate it
            for (let i=0; i<3; i++) {
                var block= randomSample[i]
                var blockDiv = document.createElement("div");
                blockDiv.innerHTML = block.title;
                linksWrapper.append(blockDiv);
            }

        });
    } else {
        console.log('++ there was an error with are.na api')
    }
  });


  var availableBlocks = []
  // this function prefetches all the blocks from arena that will be displayed in popups
  // so that when someone clicks a blob, no requests to the arena API are needed
  function getBlocksPool() {
      const listOfChannels = [
          'webzine-landscape-blob-pngs',
          'digital-love-languages-examples'
      ];
      for (let i=0; i<listOfChannels.length; i++) {
          var channel = listOfChannels[i];
          var channelUrl = "channels/" + channel + "?per=100"
          console.log('++ fetching blocks from ' + channel);
          axiosArena.get(channelUrl).then(response => {
            console.log(response);
            if (response.data && response.data.contents.length > 1) {
               for (let i=0; i<response.data.contents.length; i++) {
                 availableBlocks.push(response.data.contents[i])
               }
            }
          });
      }
  }
  getBlocksPool();
  // now availableBlocks is filled with blocks


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
        $(block).css({'left': moveLeftPixels, 'top': moveTopPixels});

        // append to html
        block.appendChild(image);
      }

      var linksWrapper =  document.createElement("div");
      linksWrapper.className = "linkswrapper"
      block.appendChild(linksWrapper);

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
