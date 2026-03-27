import { renderPagination } from "../../../../utils/RenderPagination.js";
import { calculateTotals, renderEarningTable, renderEarningTotal } from "../../components/courses/courseEarningDetails.js";
import { getCourseEarningDetails } from "../../services/courseService.js"

let currentCourseId = null;

export function setupCourseEarningDetails(courseId) {
    currentCourseId = courseId;
    const viewDetail = document.getElementById("earningDetail");
    const closeModal = document.getElementById("closeModal");

    viewDetail.addEventListener("click", () => {
        document.getElementById("earningModal").style.display = "block";
        loadEarningPage(1);
    });

    closeModal.addEventListener("click", () => {
        document.getElementById("earningModal").style.display = "none";
    });
}

async function loadEarningPage(page) {
    const tbody = document.querySelector("#earningTable tbody");
    const summary = document.getElementById("earningSummary");
    const token = localStorage.getItem("token");

    const course = await getCourseEarningDetails(currentCourseId, page, token);
    tbody.innerHTML = renderEarningTable(course);

    renderPagination(page, (newPage) => {
        loadEarningPage(newPage);
    }, "earningPagination"
    );

    const total = calculateTotals(course);
    summary.innerHTML = renderEarningTotal(total);
}