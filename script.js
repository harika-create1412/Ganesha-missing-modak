// ================================
// SCREEN ELEMENTS
// ================================

const startScreen = document.querySelector(".start-screen");
const storyScreen = document.querySelector(".story-screen");
const level1Screen = document.querySelector(".level1-screen");
const level2Screen = document.querySelector(".level2-screen");
const level3Screen = document.querySelector(".level3-screen");
const finalScreen = document.querySelector(".final-screen");


// ================================
// GAME INFO
// ================================

const gameInfo = document.querySelector(".game-info");
const scoreText = document.getElementById("score");
const currentLevelText = document.getElementById("currentLevel");
const progressBar = document.getElementById("progressBar");

let score = 0;


// ================================
// SOUND EFFECTS
// ================================

let audioContext = null;

function initAudio() {

    if (!audioContext) {
        audioContext = new(
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}


function playSound(type) {

    initAudio();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "click") {
        oscillator.frequency.value = 600;
    } else if (type === "collect") {
        oscillator.frequency.value = 750;
    } else if (type === "correct") {
        oscillator.frequency.value = 900;
    } else if (type === "wrong") {
        oscillator.frequency.value = 250;
    } else if (type === "win") {
        oscillator.frequency.value = 1200;
    }

    gainNode.gain.setValueAtTime(
        0.2,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.3
    );
}


// ================================
// PROGRESS BAR
// ================================

function updateProgress() {

    const progress = (score / 160) * 100;

    progressBar.style.width =
        progress + "%";
}


// ================================
// BUTTONS
// ================================

const startBtn =
    document.getElementById("startBtn");

const continueBtn =
    document.getElementById("continueBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");


// ================================
// START GAME
// ================================

startBtn.addEventListener("click", function() {

    // Start audio after user click
    playSound("click");

    startScreen.style.display = "none";

    storyScreen.style.display = "block";

    gameInfo.style.display = "block";

});


// ================================
// STORY → LEVEL 1
// ================================

continueBtn.addEventListener("click", function() {

    playSound("click");

    storyScreen.style.display = "none";

    level1Screen.style.display = "block";

    currentLevelText.textContent = "1";

});


// ================================
// LEVEL 1: FLOWER HUNT
// ================================

let flowerScore = 0;

const flowers =
    document.querySelectorAll(".flower");

const flowerScoreText =
    document.getElementById("flowerScore");

const flowerMessage =
    document.getElementById("flowerMessage");


flowers.forEach(function(flower) {

    flower.addEventListener("click", function() {

        if (flower.disabled) {
            return;
        }

        // Flower count
        flowerScore++;

        // Sound
        playSound("collect");

        // Score +10
        score += 10;

        scoreText.textContent = score;

        // Progress
        updateProgress();

        // Disable flower
        flower.disabled = true;

        flower.style.opacity = "0.4";

        // Update count
        flowerScoreText.textContent =
            flowerScore;


        // All flowers collected
        if (flowerScore === 5) {

            playSound("correct");

            flowerMessage.textContent =
                "🎉 Great! All flowers collected!";

            setTimeout(function() {
                startLevel2();
            }, 1000);
        }

    });

});


// ================================
// LEVEL 1 → LEVEL 2
// ================================

function startLevel2() {

    level1Screen.style.display = "none";

    level2Screen.style.display = "block";

    currentLevelText.textContent = "2";

    playSound("correct");
}


// ================================
// LEVEL 2: MODAK PUZZLE
// ================================

const modaks =
    document.querySelectorAll(".modak");

const modakMessage =
    document.getElementById("modakMessage");


modaks.forEach(function(modak, index) {

    modak.addEventListener("click", function() {

        // Correct Modak
        if (index === 2) {

            // Correct animation
            modak.classList.add("correct");

            playSound("correct");

            // Score +50
            score += 50;

            scoreText.textContent = score;

            // Progress
            updateProgress();

            modakMessage.textContent =
                "🎉 Correct! You found Ganesha's special Modak!";


            // Disable all Modaks
            modaks.forEach(function(item) {

                item.disabled = true;

            });


            setTimeout(function() {

                startLevel3();

            }, 1000);

        }

        // Wrong Modak
        else {

            // Wrong animation
            modak.classList.add("wrong");

            playSound("wrong");

            modakMessage.textContent =
                "❌ Not this one! Try again.";


            setTimeout(function() {

                modak.classList.remove("wrong");

            }, 400);

        }

    });

});


// ================================
// LEVEL 2 → LEVEL 3
// ================================

function startLevel3() {

    level2Screen.style.display = "none";

    level3Screen.style.display = "block";

    currentLevelText.textContent = "3";

    playSound("correct");
}


// ================================
// LEVEL 3: PUJA PUZZLE
// ================================

const pujaItems =
    document.querySelectorAll(".puja-item");

const pujaMessage =
    document.getElementById("pujaMessage");

let pujaStep = 1;


pujaItems.forEach(function(item) {

    item.addEventListener("click", function() {

        const correctOrder =
            Number(item.dataset.order);


        // Correct order
        if (correctOrder === pujaStep) {

            playSound("correct");

            // Score +20
            score += 20;

            scoreText.textContent = score;

            // Progress
            updateProgress();

            // Disable selected item
            item.disabled = true;

            item.style.opacity = "0.5";

            pujaStep++;


            // All steps completed
            if (pujaStep === 4) {

                playSound("win");

                pujaMessage.textContent =
                    "🎉 Amazing! Puja is ready!";


                setTimeout(function() {

                    showFinalScreen();

                }, 1500);

            } else {

                pujaMessage.textContent =
                    "✅ Correct! Now choose Step " +
                    pujaStep;

            }

        }

        // Wrong order
        else {

            playSound("wrong");

            pujaMessage.textContent =
                "❌ Wrong order! Try again.";

        }

    });

});


// ================================
// FINAL SCREEN
// ================================

function showFinalScreen() {

    level3Screen.style.display = "none";

    finalScreen.style.display = "block";

    currentLevelText.textContent = "3";

    // Full progress
    progressBar.style.width = "100%";

    playSound("win");

}


// ================================
// PLAY AGAIN
// ================================

playAgainBtn.addEventListener("click", function() {

    location.reload();

});