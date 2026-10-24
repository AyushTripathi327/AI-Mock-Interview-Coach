const roleSelect = document.getElementById("role");
const startInterviewButton = document.getElementById("startInterview");

const setup = document.querySelector(".setup");
const interviewSection = document.getElementById("interviewSection");

const questionElement = document.getElementById("question");
const questionNumber = document.getElementById("questionNumber");

const videoPreview = document.getElementById("videoPreview");
const cameraMessage = document.getElementById("cameraMessage");

const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const submitAnswerButton = document.getElementById("submitAnswer");
const answerText = document.getElementById("answerText");
const feedbackBox = document.getElementById("feedbackBox");
const scoreElement = document.getElementById("score");
const feedbackText = document.getElementById("feedbackText");
const improvementText = document.getElementById("improvementText");
const nextQuestionButton = document.getElementById("nextQuestion");

const recordingStatus = document.getElementById("recordingStatus");


let stream;
let mediaRecorder;
let recordedChunks = [];

let currentQuestion = 0;
let answerRecorded = false;


const questions = [
    "Tell me about yourself.",
    "Explain one of your technical projects.",
    "What is the difference between an array and a linked list?",
    "How do you handle a difficult technical problem?",
    "Why should we hire you for this role?"
];


startInterviewButton.addEventListener("click", async function () {

    setup.style.display = "none";
    interviewSection.style.display = "block";

    currentQuestion = 0;

    showQuestion();

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        videoPreview.srcObject = stream;

        videoPreview.style.display = "block";
        cameraMessage.style.display = "none";

        recordingStatus.textContent =
            "Camera ready. You can start recording.";

    } catch (error) {

        console.error(error);

        recordingStatus.textContent =
            "Camera or microphone permission was denied.";
    }
});


function showQuestion() {

    questionElement.textContent = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    answerRecorded = false;

    submitAnswerButton.disabled = true;
    nextQuestionButton.disabled = true;

    recordingStatus.textContent = "Ready to record.";
}


startRecordingButton.addEventListener("click", function () {

    if (!stream) {

        recordingStatus.textContent =
            "Camera is not available.";

        return;
    }

    recordedChunks = [];

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (event) {

        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };


    mediaRecorder.onstop = function () {

        const videoBlob = new Blob(
            recordedChunks,
            { type: "video/webm" }
        );

        const videoURL = URL.createObjectURL(videoBlob);

        videoPreview.srcObject = null;
        videoPreview.src = videoURL;

        videoPreview.controls = true;
        videoPreview.muted = false;

        videoPreview.play();

        recordingStatus.textContent =
            "Recording completed. Submit your answer.";

        submitAnswerButton.disabled = false;
    };


    mediaRecorder.start();

    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;

    recordingStatus.textContent =
        "🔴 Recording...";
});


stopRecordingButton.addEventListener("click", function () {

    if (mediaRecorder && mediaRecorder.state !== "inactive") {

        mediaRecorder.stop();
    }

    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
});


submitAnswerButton.addEventListener("click", async () => {
    const answer = answerText.value.trim();

    if (!answer) {
        recordingStatus.textContent = "Please type your answer first.";
        answerText.focus();
        return;
    }

    submitAnswerButton.disabled = true;
    recordingStatus.textContent = "AI is evaluating your answer...";

    try {
        const response = await fetch("http://localhost:5000/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: questions[currentQuestion],
                answer: answer
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Evaluation failed.");
        }

        scoreElement.textContent = data.score;
        feedbackText.textContent = data.feedback;
        improvementText.textContent = data.improvement;

        feedbackBox.style.display = "block";

        answerRecorded = true;
        nextQuestionButton.disabled = false;

        recordingStatus.textContent = "AI evaluation completed.";

    } catch (error) {
        console.error("Evaluation error:", error);

        recordingStatus.textContent =
            "Evaluation failed. Check that the backend is running.";

    } finally {
        submitAnswerButton.disabled = false;
    }
});


nextQuestionButton.addEventListener("click", function () {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        videoPreview.src = "";
        videoPreview.srcObject = stream;

        videoPreview.controls = false;
        videoPreview.muted = true;

        startRecordingButton.disabled = false;

        showQuestion();

    } else {

        questionElement.textContent =
            "Interview completed!";

        questionNumber.textContent =
            "Completed";

        recordingStatus.textContent =
            "Great job! Your interview is complete.";

        startRecordingButton.style.display = "none";
        stopRecordingButton.style.display = "none";
        submitAnswerButton.style.display = "none";
        nextQuestionButton.style.display = "none";
    }
});