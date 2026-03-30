import { renderPagination } from "../../../../utils/RenderPagination.js";
import { setupCourseSearch } from "../../components/courses/courseSearch.js";
import { attachCourseEvents, renderCourseCards } from "../../components/courses/courseCard.js";
import { getCourses } from "../../services/courseService.js";

let searchResults = []
let selectedInstructorId = null

export async function courseRender(page = 1) {
    try {
        const grid = document.getElementById("courseGrid")

        const limit = 6
        const token = localStorage.getItem("token")
        const res = await getCourses(page, limit, token)
        searchResults = res.courses

        grid.innerHTML = renderCourseCards(searchResults)
        attachCourseEvents(searchResults)

        setupCourseSearch({
            onReset: () => {
                courseRender(1)
            },
            onSelect: (courseId) => {
                const selected = searchResults.find(c => c.id == courseId);
                if (!selected) return;
                grid.innerHTML = renderCourseCards([selected]);
                document.getElementById("suggestions").style.display = "none";
            },
            hidePagination: false
        });

        renderPagination(
            res.page,
            courseRender,
            "pagination"
        );
    } catch (err) {
        console.log(err)
        alert("Failed loading course")
    }
}