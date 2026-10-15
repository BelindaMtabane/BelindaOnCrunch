
/* =========================================================
   BELINDA ON CRUNCH — SHOWCASE JAVASCRIPT
   File: showcase.js

   Add your actual video links in the videoUrl fields below.
   Add thumbnail image URLs in thumbnailUrl if available.
   ========================================================= */

const showcaseVideos = [
  {
    title: "Drop by Drop: Flow of Hope",
    category: "games",
    categoryLabel: "Game Development",
    symbol: "💧",
    thumbnailText: "A JOURNEY OF HOPE",

    description:
      "Explore a water-conservation runner inspired by the challenges faced by rural South African communities. Follow Zuri as she collects resources, avoids hazards and works towards restoring water infrastructure.",

    demonstrates: [
      "Gameplay mechanics",
      "Unity development",
      "Environmental storytelling"
    ],

    // *** Replace this with your actual video or playlist URL.
    videoUrl: "https://youtu.be/lZ7PN-mgPag?si=OukfhZGtozUWF5hU",

    
  },

  {
    title: "The Grove Meadows",
    category: "games",
    categoryLabel: "Game Development",
    symbol: "🌳",
    thumbnailText: "DEFEND THE GROVE",

    description:
      "Discover a fantasy forest tower-defence experience where players deploy defenders, manage resources and protect their tower from waves of corrupted creatures.",

    demonstrates: [
      "Unreal Engine",
      "C++ and Blueprints",
      "Tower-defence systems"
    ],

    // *** Replace this with the actual video or playlist URL.
    videoUrl: "https://youtu.be/8zs7T26HlO8?si=C5IiZL5cafEG8TlC",

    // *** Add a thumbnail URL here, or leave empty.
    thumbnailUrl: ""
  },

  {
    // *** Fiscal Flow is now included as the third showcase card.
    title: "Fiscal Flow",
    category: "apps",
    categoryLabel: "Application Development",
    symbol: "💰",
    thumbnailText: "TAKE CONTROL OF YOUR FINANCES",

    description:
      "Explore Fiscal Flow, a budgeting and finance application designed to help users organise their finances, track expenses and understand their spending through a user-friendly digital experience.",

    demonstrates: [
      "Android development",
      "Kotlin",
      "User interface design",
      "Budgeting features"
    ],

    // *** Replace this with your actual Fiscal Flow demo URL.
    // Leave empty until you have a working video link.
    videoUrl: "https://youtu.be/Yg5snHO7Fbg",

    
  }
];

/* =========================================================
   ELEMENT REFERENCES
   ========================================================= */

const videoGrid = document.getElementById("video-grid");
const collectionCount = document.getElementById("collection-count");
const filterButtons = document.querySelectorAll(".filter-button");

/* =========================================================
   CREATE A VIDEO CARD
   ========================================================= */

function createVideoCard(video) {
  const card = document.createElement("article");

  card.className = "video-card";
  card.dataset.category = video.category;

  // *** Create the thumbnail link.
  const thumbnail = document.createElement("a");

  thumbnail.className = "video-thumbnail";
  thumbnail.setAttribute("aria-label", `Watch ${video.title}`);

  // *** Safely check whether a video URL exists.
  const hasVideo = Boolean(video.videoUrl?.trim());

  if (hasVideo) {
    thumbnail.href = video.videoUrl;
    thumbnail.target = "_blank";
    thumbnail.rel = "noopener noreferrer";
  } else {
    thumbnail.href = "#";
    thumbnail.setAttribute("aria-disabled", "true");
    thumbnail.classList.add("thumbnail-disabled");
  }

  // *** Use a supplied thumbnail image when available.
  // *** Optional chaining prevents errors when the image URL is empty.
  if (video.thumbnailUrl?.trim()) {
    thumbnail.style.backgroundImage =
      `linear-gradient(rgba(32,34,60,.12), rgba(32,34,60,.12)), url("${video.thumbnailUrl}")`;

    thumbnail.style.backgroundSize = "cover";
    thumbnail.style.backgroundPosition = "center";
  }

  const thumbnailArt = document.createElement("span");
  thumbnailArt.className = "thumbnail-art";
  thumbnailArt.textContent = video.symbol;
  thumbnailArt.setAttribute("aria-hidden", "true");

  const thumbnailCaption = document.createElement("span");
  thumbnailCaption.className = "thumbnail-caption";
  thumbnailCaption.textContent = video.thumbnailText;

  const playOverlay = document.createElement("span");
  playOverlay.className = "play-overlay";
  playOverlay.textContent = hasVideo ? "▶" : "＋";
  playOverlay.setAttribute("aria-hidden", "true");

  thumbnail.append(thumbnailArt, thumbnailCaption, playOverlay);

  // *** Create the information section.
  const content = document.createElement("div");
  content.className = "video-card-content";

  const category = document.createElement("span");
  category.className = "video-category";
  category.textContent = video.categoryLabel;

  const title = document.createElement("h3");
  title.textContent = video.title;

  const description = document.createElement("p");
  description.className = "video-description";
  description.textContent = video.description;

  const detailLabel = document.createElement("p");
  detailLabel.className = "video-detail-label";
  detailLabel.textContent = "What this showcases";

  const skills = document.createElement("div");
  skills.className = "video-skills";

  video.demonstrates.forEach((skill) => {
    const skillTag = document.createElement("span");
    skillTag.textContent = skill;
    skills.appendChild(skillTag);
  });

  // *** Create the video or project link.
  const watchLink = document.createElement("a");
  watchLink.className = "watch-link";

  if (hasVideo) {
    watchLink.href = video.videoUrl;
    watchLink.target = "_blank";
    watchLink.rel = "noopener noreferrer";
    watchLink.innerHTML =
      'Watch video <span aria-hidden="true">↗</span>';
  } else {
    // *** Keep Fiscal Flow visible even before a demo is available.
    watchLink.href = "#";
    watchLink.classList.add("is-disabled");
    watchLink.setAttribute("aria-disabled", "true");
    watchLink.textContent = "Project showcase coming soon";
  }

  // *** Prevent inactive links from jumping to the top of the page.
  [thumbnail, watchLink].forEach((link) => {
    if (!hasVideo) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }
  });

  content.append(
    category,
    title,
    description,
    detailLabel,
    skills,
    watchLink
  );

  card.append(thumbnail, content);

  return card;
}

/* =========================================================
   RENDER THE VIDEO COLLECTION
   ========================================================= */

function renderShowcase(filter = "all") {
  if (!videoGrid || !collectionCount) {
    // *** Stop safely if the expected HTML elements are missing.
    console.warn(
      "Showcase could not load: check video-grid and collection-count in showcase.html."
    );
    return;
  }

  videoGrid.replaceChildren();

  const filteredVideos = showcaseVideos.filter((video) => {
    return filter === "all" || video.category === filter;
  });

  filteredVideos.forEach((video) => {
    videoGrid.appendChild(createVideoCard(video));
  });

  const count = filteredVideos.length;
  const label = count === 1 ? "SHOWCASE" : "SHOWCASES";

  collectionCount.textContent =
    `${String(count).padStart(2, "0")} ${label}`;

  // *** Show a message if no projects match the selected category.
  if (count === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "video-note";
    emptyMessage.textContent =
      "No showcases are available in this category yet.";

    videoGrid.appendChild(emptyMessage);
  }
}

/* =========================================================
   CATEGORY FILTERS
   ========================================================= */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    // *** Update the active filter's visual state.
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    // *** Render only projects matching the selected category.
    renderShowcase(selectedFilter);
  });

  // *** Make the initial filter state accessible.
  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );
});

/* =========================================================
   INITIALISE THE PAGE
   ========================================================= */

// *** Display all three projects when the page first loads.
renderShowcase("all");

