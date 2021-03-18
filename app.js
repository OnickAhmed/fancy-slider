const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const search = document.getElementById("search");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
const durationInput = document.getElementById("duration");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
  toggleSpinner('search-spinner'); 
};

const getImages = (query) => {
  toggleSpinner('search-spinner');
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");

  //if diselect removed from array by splice by detecting its index
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
};
var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    let timerInterval;
    // added sweet alert for beautification
    Swal.fire({
      title: "Select at least 2 image.!",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getContent();
          if (content) {
            const b = content.querySelector("b");
            if (b) {
              b.textContent = Swal.getTimerLeft();
            }
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        //console.log("I was closed by the timer");
      }
    });
    
    //alert('Select at least 2 image.')
    return;
  }
  toggleSpinner('slider-spinner');
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  //a default intervall added 1 sec
  if (!durationInput.value) {
    durationInput.value = 1000;
  }
  //console.log(durationInput.value);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, durationInput.value);
  toggleSpinner('slider-spinner');
};

durationInput.onkeydown = function (e) {
  // added some keys to prevent unwanted inputs
  if (
    !(
      (e.keyCode > 95 && e.keyCode < 106) ||
      (e.keyCode > 45 && e.keyCode < 58) ||
      (e.keyCode > 34 && e.keyCode < 40) ||
      e.keyCode == 8 ||
      e.keyCode == 13
    )
  ) {
    return false;
  }
  // added search on enter key press
  if (e.keyCode == 13) {
    createSlider();
  }
};

function clearValue(id) {
  document.getElementById(id).value = "";
}

// change slider index
function changeItem(index) {
  changeSlide((slideIndex += index));
}

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

sliderBtn.addEventListener("click", function () {
  createSlider();
});

search.onkeydown = function (e) {
  // added some keys to prevent unwanted inputs
  console.log(e.keyCode);
  if (
    !(
      (e.keyCode > 64 && e.keyCode < 91) ||
      (e.keyCode > 34 && e.keyCode < 40) ||
      e.keyCode == 8 ||
      e.keyCode == 13
    )
  ) {
    return false;
  }
  // added search on enter key press
  if (e.keyCode == 13) {
    searchImage();
  }
};

function searchImage() {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  //toggleSpinner('loading-spinner');
  getImages(search.value);
  sliders.length = 0;
}

// spinner

const toggleSpinner = (id) => {
  const spinner = document.getElementById(id);
  spinner.classList.toggle('d-none');
}