import { attachInstructorEvents, renderInstructorCard } from "../../components/instructors/instructorTable.js"
import { getAllInstructors } from "../../services/instructorService.js"
import { setupInstructorSearch } from "../../components/instructors/instructorSearch.js"

export async function instructorRender() {
    try {
        const tableBody = document.getElementById("instructorTable")
        const token = localStorage.getItem("token")
        const res = await getAllInstructors(token)

        tableBody.innerHTML = renderInstructorCard(res)
        attachInstructorEvents()

        setupInstructorSearch((instructor) => {
            const tableBody = document.getElementById("instructorTable")
            tableBody.innerHTML =
                renderInstructorCard([instructor])
        });

    } catch (err) {
        console.log(err)
        alert("Failed loading course")
    }
}