import { renderSuggestions } from "../../../../utils/RenderSuggestion.js";
import { searchCourses } from "../../services/courseService.js";

export function selectCourseFromSearch(courseId, courses) {
    const selected = courses.find(c => c.id == courseId);
    return selected;
}

export function setupCourseSearch({ onReset, onSelect, hidePagination = false }) {
    console.log("setupCourseSearch initialized");
    const searchInput = document.getElementById("courseSearch");
    const suggestionsBox = document.getElementById("suggestions");
    const pagination = document.getElementById("pagination");

    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const keyword = searchInput.value.trim();
            if (keyword.length < 2) {
                suggestionsBox.innerHTML = "";
                suggestionsBox.style.display = "none";
                onReset?.();
                if (pagination && !hidePagination) {
                    pagination.style.display = "block";
                }
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const res = await searchCourses(keyword, token)
                const results = res || [];

                renderSuggestions(
                    results,
                    onSelect
                );

                if (pagination) {
                    pagination.style.display = "none";
                }
            }
            catch (err) {
                console.error(err);
            }
        }, 300);
    }
    );
}