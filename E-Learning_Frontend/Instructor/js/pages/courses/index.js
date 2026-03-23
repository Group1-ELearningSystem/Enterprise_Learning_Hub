import { getInstructorCourses } from "../../services/courseService.js"
import { attachCourseEvents, renderCourseCards } from "../../components/courses/courseCard.js"
import { setupCourseSearch, selectCourseFromSearch } from "../../components/courses/courseSearch.js"

let allCourses = []
export async function renderCourses() {
    const grid = document.getElementById("coursesGrid")
    const loginUser = JSON.parse(localStorage.getItem("loginUser"))

    const token = localStorage.getItem("token")
    const courses = await getInstructorCourses(loginUser.Instructor_ID, token)

    allCourses = courses
    grid.innerHTML = renderCourseCards(courses)

    attachCourseEvents(courses)

    setupCourseSearch({
        onReset: () => {
            renderCourseCards(allCourses);
        },
        onSelect: (courseId) => {
            const selected = allCourses.find(c => c.id == courseId);
            if (!selected) return;
            grid.innerHTML =renderCourseCards([selected]);
            document.getElementById("suggestions").style.display = "none";
        }
    });
}