const cookieImages = [
    "images/cookie1.png",
    "images/cookie2.png",
    "images/cookie3.png",
    "images/cookie4.png",
    "images/cookie5.png"
];

const acceptReactions = [
    // 1st accept - guy is happy
    { image: "guy2.png", line: "of course! enjoy!" },
    // 2nd accept - guy is still polite
    { image: "guy3.png", line: "sure, have another!" },
    // 3rd accept - guy's patience is being tested
    { image: "guy4.png", line: "three? well, i suppose it does taste good..." },
    // 4th accept - peanut allergy?
    { image: "guy5.png", line: "hey, you don't happen to have a nut allergy, do you?" },
    // 5th accept - last cookie, guy is annoyed
    { image: "guy9.png", line: "alright, well, this is the last one, buddy. please savor it." },
    // 6th accept attempt final - guy says no
    { image: "guy7.png", line: "that's it. we don't have anymore because you wanted to be greedy." },
    // 6th accept retry attempt - guy kicks user out; line may not appear if window closes too fast
    { image: "guy8.png", line: "nope. we're done here. bye." }
];

const acceptButton = document.querySelector("#accept-button");
const declineButton = document.querySelector("#decline-button");
const consentAcceptButton = document.querySelector("#consent-accept");
const consentDeclineButton = document.querySelector("#consent-decline");
const consentDialogue = document.querySelector("#consent-dialogue");
const controls = document.querySelector("#controls");
const guy = document.querySelector("#guy");
const speech = document.querySelector("#speech");
const serving = document.querySelector("#serving");
const countLabel = document.querySelector("#cookie-count");
const dialogue = document.querySelector("#dialogue");
const dialogueTitle = document.querySelector("#dialogue-title");
const dialogueCopy = document.querySelector("#dialogue-copy");
const dialogueActions = document.querySelector("#dialogue-actions");

let acceptCount = 0;
let stayedAfterDecline = false;

function say(line, imageName) {
    guy.src = `images/${imageName}`;
    guy.classList.add("visible");
    speech.textContent = line;
    speech.classList.add("visible");
}

function addCookie(number) {
    const cookie = document.createElement("img");
    cookie.className = "cookie";
    cookie.src = cookieImages[number - 1];
    cookie.alt = `Cookie ${number} on the plate`;
    cookie.style.setProperty("--tilt", `${(number % 2 ? -1 : 1) * (number * 3)}deg`);
    serving.append(cookie);

    requestAnimationFrame(() => cookie.classList.add("on-plate"));
}

function showDialogue(title, copy, buttons) {
    dialogueTitle.textContent = title;
    dialogueCopy.textContent = copy;
    dialogueActions.replaceChildren();

    buttons.forEach(({ label, action, primary = false }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.className = primary ? "accept" : "decline";
        button.addEventListener("click", action, { once: true });
        dialogueActions.append(button);
    });

    dialogue.hidden = false;
    dialogueActions.querySelector("button").focus();
}

function hideDialogue() {
    dialogue.hidden = true;
}

function closeBrowser() {
    controls.hidden = true;
    window.close();
    window.setTimeout(() => {
        showDialogue(
            "Can't close this tab",
            "Your browser won't let this page close itself. You can close the tab manually.",
            [{ label: "Got it", action: hideDialogue, primary: true }]
        );
    }, 150);
}

function goHome() {
    window.location.href = "https://www.google.com";
}

function acceptCookies() {
    acceptCount += 1;

    if (stayedAfterDecline) {
        say("Back for more?", "guy1.png");
        stayedAfterDecline = false;
    } else {
        const reaction = acceptReactions[acceptCount - 1];
        say(reaction.line, reaction.image);
    }

    if (acceptCount <= cookieImages.length) {
        serving.classList.add("visible");
        countLabel.textContent = `Cookies: ${acceptCount} / 5`;
        const cookieNumber = acceptCount;
        window.setTimeout(() => addCookie(cookieNumber), 700);
    }

    if (acceptCount === 7) {
        closeBrowser();
    }
}

function declineCookies() {
    if (acceptCount === 0) {
        say("leaving so soon?", "guy10.png");
        showDialogue("Are you sure you want to decline?", "Do you really want to decline the cookies?", [
            { label: "Yes, leave", action: closeBrowser },
            {
                label: "No, stay",
                action: () => {
                    hideDialogue();
                    say("no pressure.", "guy3.png");
                    acceptButton.focus();
                },
                primary: true
            }
        ]);
        return;
    }

    say("thanks for sticking around. wanna head out?", "guy1.png");
    showDialogue("Heading home?", "Thanks for hanging out! Want to leave the page?", [
        { label: "Go home", action: goHome },
        {
            label: "Stay",
            action: () => {
                hideDialogue();
                stayedAfterDecline = true;
                say("cool, make yourself at home.", "guy3.png");
                acceptButton.focus();
            },
            primary: true
        }
    ]);
}

function startGame(accept) {
    consentDialogue.hidden = true;
    controls.hidden = false;

    if (accept) {
        acceptCookies();
    } else {
        declineCookies();
    }
}

acceptButton.addEventListener("click", acceptCookies);
declineButton.addEventListener("click", declineCookies);
consentAcceptButton.addEventListener("click", () => startGame(true));
consentDeclineButton.addEventListener("click", () => startGame(false));
