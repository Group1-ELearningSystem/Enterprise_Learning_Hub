import { updateSession } from "../../services/sessionService.js"
import { loadPage } from "../../app.js"

export function setupEditSession() {
    const form = document.getElementById("editSessionForm")
    const titleInput = document.getElementById("sessionTitle")
    const videoPreview = document.getElementById("videoPreview")
    const videoEmpty = document.getElementById("videoEmptyText")
    const viewPdfBtn = document.getElementById("previewPdf");
    const newVideo = document.getElementById("videoFile");
    const newPdf = document.getElementById("pdfFile")

    const session = JSON.parse(localStorage.getItem("editingSession"))
    console.log(session)
    console.log(session.videoUrl);

    titleInput.value = session.sessionTitle

    if (session.sessionVideo) {
        videoPreview.src = `http://localhost:5000/${session.sessionVideo}`
        videoPreview.style.display = "block"
        videoEmpty.style.display = "none"
    }

    viewPdfBtn.addEventListener("click", () => {
        window.open(`http://localhost:5000/${session.sessionDocument}`, "_blank")
    })

    newVideo.addEventListener("change", () => {
        const file = newVideo.files[0]

        const url = URL.createObjectURL(file)
        videoPreview.src = url
        videoPreview.style.display = "block";
        videoEmpty.style.display = "none";
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const title = titleInput.value;
        const videoFile = newVideo.files[0]
        const pdfFile = newPdf.files[0]
        const formData = new FormData()

        formData.append("title", title)
        if (videoFile) {
            formData.append("video", videoFile)
        }
        if (pdfFile) {
            formData.append("pdf", pdfFile)
        }

        try {
            const token = localStorage.getItem("token")
            await updateSession(session.courseId, session.sessionId, formData, token)
            alert("Session updated successfully")
            loadPage("sessions")
        } catch (err) {
            console.log(err)
            alert("Updating session failed")
        }
    })
}