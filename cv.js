
/* ==========================================
   BELINDA ON CRUNCH — CV ACCESS
   ========================================== */

/* *** Configure your CV access settings here. */

// *** Replace this with your own password.
const CV_PASSWORD = "BelindasCV2026*";

// *** Replace this with your actual PDF filename.
const CV_PDF_PATH = "assets/Belinda Mtabane - Undergraduate 2026 - CV Resume (2).pdf";

// *** Ten-minute access session.
const CV_ACCESS_DURATION = 10 * 60 * 1000;


/* ==========================================
   HTML ELEMENTS
   ========================================== */

const form = document.getElementById("cv-access-form");
const passwordInput = document.getElementById("cv-password");
const togglePasswordButton = document.getElementById("cv-toggle-password");
const unlockButton = document.getElementById("cv-unlock-button");
const buttonText = document.getElementById("cv-button-text");
const feedback = document.getElementById("cv-feedback");

const gateOverlay = document.getElementById("cv-gate-overlay");
const placeholderPreview = document.getElementById("cv-placeholder-preview");
const pdfContainer = document.getElementById("cv-pdf-container");
const pdfViewer = document.getElementById("cv-pdf-viewer");
const viewerControls = document.getElementById("cv-viewer-controls");
const lockButton = document.getElementById("cv-lock-button");

// *** Added: Countdown elements.
const countdownDisplay = document.getElementById("cv-countdown");
const sessionTimer = document.getElementById("cv-session-timer");


/* ==========================================
   SESSION VARIABLES
   ========================================== */

// *** Added: Track the access expiry time.
let accessExpiryTime = null;

// *** Added: Store the countdown interval.
let countdownInterval = null;


/* ==========================================
   FEEDBACK
   ========================================== */

// *** Display success and error messages.
function showFeedback(message, type = "error") {
    feedback.textContent = message;
    feedback.className = "cv-feedback";

    if (type === "success") {
        feedback.classList.add("success");
    }
}


/* ==========================================
   BUTTON LOADING STATE
   ========================================== */

// *** Added: Manage the unlock button state.
function setLoading(isLoading) {
    unlockButton.disabled = isLoading;
    passwordInput.disabled = isLoading;

    buttonText.textContent = isLoading
        ? "Unlocking..."
        : "Unlock CV";
}


/* ==========================================
   COUNTDOWN DISPLAY
   ========================================== */

// *** Added: Format remaining time as MM:SS.
function formatCountdown(milliseconds) {
    const totalSeconds = Math.max(
        0,
        Math.ceil(milliseconds / 1000)
    );

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}


// *** Added: Update the visible countdown.
function updateCountdown() {

    if (accessExpiryTime === null) {
        return;
    }

    const remainingTime = accessExpiryTime - Date.now();

    // *** Automatically lock the CV when time expires.
    if (remainingTime <= 0) {
        lockDocument(
            "Your 10-minute access session has expired. Enter your password again."
        );

        return;
    }

    countdownDisplay.textContent = formatCountdown(remainingTime);

    // *** Warn the visitor when less than one minute remains.
    if (remainingTime <= 60 * 1000) {
        sessionTimer.classList.add("expiring");
    } else {
        sessionTimer.classList.remove("expiring");
    }
}


/* ==========================================
   START ACCESS SESSION
   ========================================== */

// *** Added: Start the ten-minute access countdown.
function startAccessSession() {

    // *** Clear any previous countdown.
    clearInterval(countdownInterval);

    // *** Calculate the exact expiry time.
    accessExpiryTime = Date.now() + CV_ACCESS_DURATION;

    // *** Display the initial countdown.
    countdownDisplay.textContent = "10:00";

    // *** Remove any previous warning styling.
    sessionTimer.classList.remove("expiring");

    // *** Update the countdown every 250 milliseconds.
    countdownInterval = setInterval(() => {
        updateCountdown();
    }, 250);
}


/* ==========================================
   UNLOCK CV
   ========================================== */

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const enteredPassword = passwordInput.value;

    // *** Check that a password was entered.
    if (!enteredPassword.trim()) {
        showFeedback("Please enter your access password.");
        passwordInput.focus();
        return;
    }

    // *** Check that the password placeholder was replaced.
    if (CV_PASSWORD === "YOUR_CV_PASSWORD") {
        showFeedback(
            "Please configure your CV password in cv.js first."
        );

        return;
    }

    // *** Verify the entered password.
    if (enteredPassword !== CV_PASSWORD) {

        showFeedback(
            "That password is incorrect. Please try again."
        );

        passwordInput.value = "";
        passwordInput.focus();

        return;
    }

    // *** Start loading state.
    setLoading(true);
    showFeedback("");

    try {

        // *** Load the actual CV PDF.
        pdfViewer.src = CV_PDF_PATH;

        // *** Show the PDF viewer.
        pdfContainer.hidden = false;

        // *** Remove the password overlay.
        gateOverlay.hidden = true;

        // *** Hide the decorative CV preview.
        placeholderPreview.hidden = true;

        // *** Show the document controls.
        viewerControls.hidden = false;

        // *** Clear the password field.
        passwordInput.value = "";

        // *** Reset password visibility.
        passwordInput.type = "password";
        togglePasswordButton.textContent = "Show";
        togglePasswordButton.setAttribute("aria-pressed", "false");

        // *** Start the ten-minute countdown.
        startAccessSession();

        // *** Scroll to the document.
        document.getElementById("cv-document-shell").scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            block: "start"
        });

    } catch (error) {

        // *** Display an error if the unlock process fails.
        showFeedback(
            "Something went wrong while opening your CV. Please try again."
        );

    } finally {

        // *** Restore the button state.
        setLoading(false);
    }
});


/* ==========================================
   SHOW / HIDE PASSWORD
   ========================================== */

// *** Toggle password visibility.
togglePasswordButton.addEventListener("click", () => {

    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePasswordButton.textContent = isPassword
        ? "Hide"
        : "Show";

    togglePasswordButton.setAttribute(
        "aria-pressed",
        String(isPassword)
    );

    togglePasswordButton.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
    );
});


/* ==========================================
   LOCK CV
   ========================================== */

// *** Remove the PDF from the viewer and restore the overlay.
function lockDocument(message = "") {

    // *** Stop the countdown.
    clearInterval(countdownInterval);
    countdownInterval = null;

    // *** Reset the expiry time.
    accessExpiryTime = null;

    // *** Remove the PDF from the iframe.
    pdfViewer.removeAttribute("src");

    // *** Hide the PDF viewer.
    pdfContainer.hidden = true;

    // *** Restore the password overlay.
    gateOverlay.hidden = false;

    // *** Restore the decorative preview.
    placeholderPreview.hidden = false;

    // *** Hide the viewer controls.
    viewerControls.hidden = true;

    // *** Reset the countdown.
    countdownDisplay.textContent = "10:00";

    // *** Remove the expiry warning.
    sessionTimer.classList.remove("expiring");

    // *** Clear the password field.
    passwordInput.value = "";

    // *** Restore password visibility.
    passwordInput.type = "password";
    togglePasswordButton.textContent = "Show";
    togglePasswordButton.setAttribute("aria-pressed", "false");

    // *** Restore the button state.
    setLoading(false);

    // *** Display the locking message.
    showFeedback(message);

    // *** Return focus to the password field.
    passwordInput.focus({ preventScroll: true });
}


/* ==========================================
   MANUAL LOCK BUTTON
   ========================================== */

// *** Allow visitors to lock their CV immediately.
lockButton.addEventListener("click", () => {

    lockDocument(
        "Your CV is now locked. Enter the password to view it again."
    );

});


/* ==========================================
   INITIAL PAGE STATE
   ========================================== */

// *** Always start with the CV locked after a page load.
pdfViewer.removeAttribute("src");

pdfContainer.hidden = true;
gateOverlay.hidden = false;
placeholderPreview.hidden = false;
viewerControls.hidden = true;

countdownDisplay.textContent = "10:00";
sessionTimer.classList.remove("expiring");

// *** The visitor must enter the password again after refreshing.
