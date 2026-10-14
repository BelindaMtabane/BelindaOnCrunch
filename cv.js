
// ==========================================
// BELINDA ON CRUNCH — CV ACCESS
// ==========================================

// *** Configure this after deploying your Supabase Edge Function.

const CV_UNLOCK_ENDPOINT =
    "https://apclgxwjhweoftzkppyi.supabase.co/functions/v1/unlock-cv";


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

let accessExpiryTimer = null;

// *** Added: Display accessible status and error messages.
function showFeedback(message, type = "error") {
    feedback.textContent = message;
    feedback.className = "cv-feedback";

    if (type === "success") {
        feedback.classList.add("success");
    }
}

// *** Added: Disable the submit button while the server checks the password.
function setLoading(isLoading) {
    unlockButton.disabled = isLoading;
    passwordInput.disabled = isLoading;
    buttonText.textContent = isLoading ? "Verifying access..." : "Unlock my CV";
}

// *** Added: Ask the server to verify the password.
// The password is sent over HTTPS and is never stored in this script.
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = passwordInput.value;

    if (!password) {
        showFeedback("Please enter your access password.");
        passwordInput.focus();
        return;
    }

    if (CV_UNLOCK_ENDPOINT.includes("YOUR_PROJECT_REF")) {
        showFeedback(
            "Secure access is not configured yet. Please finish the backend setup."
        );
        return;
    }

    setLoading(true);
    showFeedback("");

    try {
        const response = await fetch(CV_UNLOCK_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error(
                    "Too many attempts. Please wait before trying again."
                );
            }

            if (response.status === 401) {
                throw new Error("That password is incorrect. Please try again.");
            }

            throw new Error(
                result.error || "Access could not be verified. Please try again."
            );
        }

        // *** Security: Only accept the authorised HTTPS document URL.
        if (
            typeof result.signedUrl !== "string" ||
            !result.signedUrl.startsWith("https://")
        ) {
            throw new Error("The server did not return a valid document link.");
        }

        // *** Added: Load the real PDF only after server authorisation.
        pdfViewer.src = result.signedUrl;
        pdfContainer.hidden = false;
        gateOverlay.hidden = true;
        placeholderPreview.hidden = true;
        viewerControls.hidden = false;

        passwordInput.value = "";
        showFeedback("", "success");

        // *** Added: Clear the viewer when the signed link is expected to expire.
        clearTimeout(accessExpiryTimer);

        const expiresInSeconds = Number(result.expiresIn) || 600;

        accessExpiryTimer = setTimeout(() => {
            lockDocument(
                "Your access session has expired. Enter the password again."
            );
        }, Math.max(1, expiresInSeconds - 10) * 1000);

        document.getElementById("cv-document-shell").scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            block: "start"
        });

    } catch (error) {
        showFeedback(
            error.message || "Something went wrong. Please try again."
        );
    } finally {
        setLoading(false);
    }
});

// *** Added: Toggle password visibility.
togglePasswordButton.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    togglePasswordButton.textContent = isPassword ? "Hide" : "Show";
    togglePasswordButton.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
    );
});

// *** Added: Remove the PDF from the viewer when the visitor locks the page.
// This removes the displayed document; it cannot revoke a URL already copied.
function lockDocument(message = "") {
    clearTimeout(accessExpiryTimer);

    pdfViewer.removeAttribute("src");
    pdfContainer.hidden = true;
    gateOverlay.hidden = false;
    placeholderPreview.hidden = false;
    viewerControls.hidden = true;

    passwordInput.value = "";
    showFeedback(message);

    passwordInput.focus({ preventScroll: true });
}

lockButton.addEventListener("click", () => {
    lockDocument("The document is locked. Enter the password to view it again.");
});

// *** Added: Lock the visible document when this page is hidden.
// This is a privacy convenience, not a substitute for server security.
document.addEventListener("visibilitychange", () => {
    if (document.hidden && !pdfContainer.hidden) {
        lockDocument("The document was locked when you left this page.");
    }
});
