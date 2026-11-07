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
const dialogueCopy = document.querySelector ("#dialogue-copy");
const dialogueActions = document.querySelector("#dialogue-actions");


const cookieImages = [
    "images/cookie1.png",
    "images/cookie2.png",
    "images/cookie3.png",
    "images/cookie4.png",
    "images/cookie5.png"
];

const acceptReactions = [
    // 1st accept - guy is happy
    { image: "images/guy2.png", line: "of course! enjoy!" },
    // 2nd accept - guy is still polite
    { image: "images/guy3.png", line: "sure, have another!" },
    // 3rd accept - guy's patience is being tested
    { image: "images/guy4.png", line: "three? well, i suppose it does taste good..." },
    // 4th accept - peanut allergy?
    { image: "images/guy5.png", line: "hey, you don't happen to have a nut allergy, do you?" },
    // 5th accept - last cookie, guy is annoyed
    { image: "images/guy9.png", line: "alright, well, this is the last one, buddy. please savor it." },
    // 6th accept attempt final - guy says no
    { image: "images/guy7.png", line: "that's it. we don't have anymore because you wanted to be greedy." },
    // 6th accept retry attempt - guy kicks user out
    { image: "images/guy8.png", line: "nope. we're done here. bye." },
];

let acceptCount = 0;
let stayedAfterDecline = false;

acceptButton.addEventListener("click", acceptCookies);
declineButton.addEventListener("click", declineCookies);
consentAcceptButton.addEventListener("click", () => startGame(true));
consentDeclineButton.addEventListener("click", () => startGame(false));

function say(line, imageName) {
    guy.src = "images/" + imageName;
    speech.textContent = line;

    guy.classList.add("visible");
    speech.classList.add("visible");
}

function showDialogue(title, copy, buttons) {
    dialogueTitle.textContent = title;
    dialogueCopy.textContent = copy;
    dialogueActions.replaceChildren();
}

buttons.forEach(({label, action, primary = false}) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = primary ? "accept" : "decline";
    button.addEventListener("click", action, {once:true});
    dialogueActions.append(button);
});

dialogue.hidden = false;
dialogueActions.querySelector("button").focus();

function hideDialogue() {
    dialogue.hidden = true;
}

function addCookie(number) {
    const cookie = document.createElement("img");
    cookie.className = "cookie";
    cookie.src = cookieImages[number - 1];
    cookie.alt `cookie ${number} on the plate`;
    cookie.style.setProperty("--tilt", `${number * 3 * (number % 2 ? -1 : 1)}deg`);
    serving.append(cookie);
    requestAnimationFrame(() => cookie.classList.add("on-plate"));
}

function acceptCookies (){
    acceptCount +=1;

    if (stayedAfterDecline) {
        say ("Back for more?", "images/guy1.png");
        stayedAfterDecline = false;
    } else {
        const reaction = acceptReactions[acceptCount -1];
        say(reaction.line, reaction.image);
    }
}

if (acceptCount <= cookieImages.length) {
    serving.classList.add("visible");
    countLabel.textContext = `Cookies: ${acceptCount} / 5`;
    window.setTimeout(() => addCookie(acceptCount), 700);
}
if (acceptCount ===7){
    closeBrowser();
}

function declineCookies(){
    if (accept)
}