import { formatDate } from "../../../../utils/DateFormatUtils.js";
import { renderPagination } from "../../../../utils/RenderPagination.js";
import { getUnansweredQuestion } from "../../services/courseService.js";
import { submitAnswer } from "../../services/courseService.js";

let currentCourseId

export async function loadCourseQuestions(courseId, page = 1) {
    currentCourseId = courseId
    const list = document.getElementById("questionList")
    const empty = document.getElementById("questionEmpty")

    const questions = await getUnansweredQuestion(courseId, page)

    if (!questions || questions.length === 0) {
        list.innerHTML = "";
        empty.style.display = "block";
    }

    empty.style.display = "none";
    list.innerHTML = renderQuestionList(questions);
    attachAnswerEvents()
    renderPagination(page,
        (newPage) => loadCourseQuestions(courseId, newPage),
        "questionPagination"
    );
}

function renderQuestionList(questions) {
    return questions.map(q => `
        <div class="question-card">
            <p>
                <strong>
                    ${q.Learner_Full_Name}
                </strong>
            </p>

            <p>
                ${q.Question_Text}
            </p>

            <small>
                Asked at: ${formatDate(q.Question_Asked_At)}
            </small>

            <div class="answer-section">
                <textarea class="answer-input" id="answer-${q.Question_ID}" placeholder="Write your answer..."></textarea>
                <button class="app-btn primary answer-btn" data-id="${q.Question_ID}">
                    Submit Answer
                </button>
            </div>
        </div>
    `).join("");
}

function attachAnswerEvents() {
    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.addEventListener("click", handleAnswerSubmit)
    })
}

async function handleAnswerSubmit(event) {
    const questionId = event.target.dataset.id
    const textarea = document.getElementById(`answer-${questionId}`)

    const answerText = textarea.value.trim();

    if (!answerText) {
        alert("Answer cannot be empty.");
        return;
    }

    const success = await submitAnswer(questionId, answerText)

    if (success) {
        alert("Answer submitted!");
        loadCourseQuestions(currentCourseId, 1)
    }
}
