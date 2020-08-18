/**
 * helper function to shuffle an array in place.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}


$(document).ready(function() {
  console.log("ready!");

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
    while (arr.length < numElements) {
      var r = randomIntFromInterval(0, array.length)
      if (arr.indexOf(r) === -1) {
        arr.push(r);
        toReturn.push(array[r]);
      }
    }
    return toReturn;
  }

  axiosArena.defaults.headers.Authorization = 'Bearer ---';
  axiosArena.get("channels/webzine-landscape-blob-pngs?per=100").then(response => {
    console.log(response);
    if (response.data && response.data.contents.length > 1) {
      orientationWrapper.removeChild(loading);
      // for testing purposes, triple the number of blobs
      var blocks = [];
      for (let i = 0; i < response.data.contents.length * 3; i++) {
        var j = i % response.data.contents.length;
        // then add to the list of blocks
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
        // if linksWrapper is empty, then add blocks to it
        if ($(linksWrapper).is(':empty')) {
          // also select three random blocks to put in linkswrapper
          var randomSample = getRandomElementsFromArray(availableBlocks, 3);
          // clear links wrapper
          populateArenaPopup(linksWrapper, randomSample);
        }
      });
      // use the same click function for clicking the wrapper, not just the blob image
      $('.linkswrapper').click(function(e) {
        e.preventDefault();
        console.log('++ links wrapper clicked');
        $(this).toggle();
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
      // 'webzine-landscape-blob-pngs',
      'digital-love-projects-ephemera',
      'love-letters-to-a-speculative-liberatory-learning-environment',
      'code-as-a-gift',
      'people-r1w1odycp2i',
      'people-cdxyphwj0lo',
      'folder-poetry-fm8h1k8vsfk',
      'folder-poetry-4ds7cifq2do',
      'passing-notes',
      'passing-notes-lepghojthjg',
      'digital-love-languages',
      'learning-growing-reaching-extending'
    ];
    for (let i = 0; i < listOfChannels.length; i++) {
      var channel = listOfChannels[i];
      var channelUrl = "channels/" + channel + "?per=100"
      console.log('++ fetching blocks from ' + channel);
      axiosArena.get(channelUrl).then(response => {
        // console.log(response);
        if (response.data && response.data.contents.length > 1) {
          for (let i = 0; i < response.data.contents.length; i++) {
            // set the channel title to be part of the block so we can access it later
            response.data.contents[i].channelTitle = response.data.title;
            response.data.contents[i].channelSlug = response.data.slug;
            // then add it to the queue
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
    // first lets randomly shuffle the blocks, so they are not always in the same order
    shuffle(arenaBlocks);
    // then lets loop through them
    for (let i = 0; i < arenaBlocks.length; i++) {
      //create block
      let block = document.createElement("div");
      block.className = "block";


      // we dont technically need this because this all about the blobbs which are all images
      // if (arenaBlocks[i].source) {
      //   block = document.createElement("a");
      //   block.className = "block";
      //   block.href = arenaBlocks[i].source.url;
      //   block.target = "_blank";
      // }
      //
      // if (arenaBlocks[i].class === "Channel") {
      //   block = document.createElement("a");
      //   block.className = "channel";
      //   block.href = `https://are.na/${arenaBlocks[i].user.slug}/${arenaBlocks[i].slug}`;
      //   block.target = "_blank";
      // }

      //create image
      if (arenaBlocks[i].image) {
        var randWidth = randomIntFromInterval(60, 500)
        const image = document.createElement("img");
        var randomClass = "";
        if (i % 4 === 0) {
          randomClass = " random";
        } else {
          randomClass = "";
        }

        image.className = ("image blobImage shadowfilter" + randomClass);

        // console.log(arenaBlocks[i].image.original.url);
        image.src = arenaBlocks[i].image.original.url;
        $(image).width(randWidth);

        // move the blob by a random position to make things a bit less grid-like
        var delta = 400;
        // var moveLeftPixels = randomIntFromInterval(0, 3000);
        // var moveTopPixels = randomIntFromInterval(200, 8000);
        var moveLeftPixels = randomIntFromInterval(0, delta / 2);
        var moveTopPixels = randomIntFromInterval(0, delta);
        $(block).css({
          'left': moveLeftPixels,
          'top': moveTopPixels
        });

        // append to html
        block.appendChild(image);
      }

      var linksWrapper = document.createElement("div");
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

  // helper function which inserts arena blocks into the popup dialog for that blob
  // including images and descriptions
  function populateArenaPopup(linksWrapper, blocks) {
    // for each block, create a div element for it in the links wrapper appropriately
    for (let i = 0; i < blocks.length; i++) {
      var block = blocks[i]
      var blockWrapper = document.createElement("div");
      blockWrapper.className = "popupBlock";

      // if the block is a link, then also turn this into a link
      if (block.source) {
        blockWrapper = document.createElement("a");
        blockWrapper.className = "popupBlock";
        blockWrapper.href = block.source.url;
        blockWrapper.target = "_blank";
      }

      // append title of channel  & title of block
      const titleWrapper = document.createElement('a');
      const titleBlockWrapper = document.createElement('div');
      titleWrapper.className = 'popupChannelTitle'
      titleBlockWrapper.className = 'popupBlockTitle'
      // make link to block?
      titleWrapper.href = 'http://are.na/channels/' + block.channelSlug;
      titleWrapper.target = "_blank";
      titleWrapper.innerHTML = block.channelTitle;
      titleBlockWrapper.innerHTML = block.title;
      blockWrapper.appendChild(titleWrapper);
      blockWrapper.appendChild(titleBlockWrapper);



      // if its an image
      if (block.image) {
        const image = document.createElement("img");
        image.className = "popupImage";
        image.src = block.image.original.url;
        $(image).width('100%');
        // append to html
        blockWrapper.appendChild(image);
      }

      // if it has content
      if (block.content) {
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "popupContent";
        contentWrapper.innerHTML = block.content;
        // append to html
        blockWrapper.appendChild(contentWrapper);
      }

      // if there is a description
      if (block.description) {
        const descriptionWrapper = document.createElement("div");
        descriptionWrapper.className = "popupDescription";
        descriptionWrapper.innerHTML = block.description;
        // append to html
        blockWrapper.appendChild(descriptionWrapper);
      }


      // filter out empty blocks
      if (!block.image || !block.description || !block.content) {
        linksWrapper.append(blockWrapper);
      }
    }
    // finally set popupChannelTitle click function
    $('.popupChannelTitle').click(function(e) {
      console.log('++ channel title clicked');
      e.stopPropagation();
    });
  }



  $(function() {
    $('.hand-about').hover(function() {
      $('#about').fadeIn(3000);
    }, function() {
      $('#about').fadeOut(3000);
    });
  });

  $(function() {
    $("#about-container").click(function() {
      $("#about-container").toggle();
    });

  });

  $(function() {
    $(".hand-about").click(function() {
      console.log("show content")
      $("#about-container").toggle();
    });

  });

});
