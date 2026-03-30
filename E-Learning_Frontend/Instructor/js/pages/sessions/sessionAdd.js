import { loadPage } from "../../app.js"
import { createSession } from "../../services/sessionService.js"

export function setupAddingSession() {
    const form = document.getElementById("addSessionForm")

    const videoInput = document.getElementById("videoFile")
    const videoPreview = document.getElementById("videoPreview")
    const videoEmpty = document.getElementById("videoEmptyText")

    videoInput.addEventListener("change", () => {
        const file = videoInput.files[0]

        const url = URL.createObjectURL(file)
        videoPreview.src = url
        videoPreview.style.display = "block";
        videoEmpty.style.display = "none";
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const course = JSON.parse(localStorage.getItem("selectedCourse"))

        const title = document.getElementById("sessionTitle").value
        const videoFile = document.getElementById("videoFile").files[0]
        const pdfFile = document.getElementById("pdfFile").files[0]

        if (!videoFile || !pdfFile) {
            alert("Please upload both MP4 and PDF.");
            return;
        }

        if (!title) {
            alert("Please fill in the title");
            return;
        }

        const formData = new FormData()

        formData.append("title", title)
        formData.append("video", videoFile)
        formData.append("pdf", pdfFile)

        try {
            const token = localStorage.getItem("token")
            await createSession(course.id, formData, token)
            alert("Session added successfully")
            form.reset()
            console.log(
                "selectedCourse:",
                localStorage.getItem("selectedCourse")
            );
            loadPage("sessions")
        } catch (err) {
            console.log(err)
            alert("Adding session failed")
        }
    })
}