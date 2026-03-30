import { instructorRender } from "../../pages/instructors/index.js";
import { searchInstructors } from "../../services/instructorService.js";
import { renderInstructorCard } from "./instructorTable.js";

let selectedInstructorId = null;

export function getSelectedInstructorId() {
    return selectedInstructorId;
}
function selectInstructor(instructor, onSelect) {
    const input =document.getElementById("instructorSearch")
    const suggestionBox = document.getElementById("instructorSuggestions")
    input.value = `${instructor.Instructor_Full_Name} - (ID: ${instructor.Instructor_ID})`

    selectedInstructorId = instructor.Instructor_ID
    suggestionBox.style.display = "none"

    if (onSelect) {
        onSelect(instructor)
    }
}

async function searchInstructor(keyword, onSelect) {
    try {
        const token = localStorage.getItem("token")
        const res = await searchInstructors(keyword, token)
        renderInstructorSuggestions(res,onSelect)
    } catch (err) {
        console.error(err)
    }
}

export function setupInstructorSearch(onSelect = null) {
    const input = document.getElementById("instructorSearch")
    const suggestionBox = document.getElementById("instructorSuggestions")
    let debounceTimer

    input.addEventListener("input", () => {
        clearTimeout(debounceTimer)
        const keyword = input.value.trim()

        if (keyword.length < 2) {
            suggestionBox.style.display = "none"
            return
        }

        debounceTimer = setTimeout(() => {
            searchInstructor(keyword, onSelect)
        }, 400)
    })
}

function renderInstructorSuggestions(instructors, onSelect) {
    const suggestionBox = document.getElementById("instructorSuggestions")
    suggestionBox.innerHTML = ""
    if (instructors.length === 0) {
        suggestionBox.style.display = "none"
        return
    }

    instructors.forEach(instructor => {
        const item = document.createElement("div")
        item.classList.add("suggestion-item")
        item.innerHTML = `
            <strong>
                ${instructor.Instructor_Full_Name}
            </strong>
            <br>

            <small>
                ID: ${instructor.Instructor_ID}
                | ${instructor.Instructor_Email_Address}
                | ${instructor.Instructor_Phone_Number}
            </small>
        `

        item.addEventListener("click", () => {
            selectInstructor(instructor,onSelect)
        })
        suggestionBox.appendChild(item)
    })
    suggestionBox.style.display = "block"
}