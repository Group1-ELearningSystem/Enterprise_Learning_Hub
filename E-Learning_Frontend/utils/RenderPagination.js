export function renderPagination(page, callback, paginationId) {
    console.log("Rendering pagination...");
    const container = document.getElementById(`${paginationId}`)

    container.innerHTML =
        `
        <button class="page-btn" ${page === 1 ? "disabled" : ""} id="prevPage">←</button>
        <span class="page-info">Page ${page}</span>
        <button class="page-btn" id="nextPage">→</button>
    `
    const prevBtn = container.querySelector("#prevPage");
    const nextBtn = container.querySelector("#nextPage");

    prevBtn?.addEventListener("click", () => {
        if (page > 1) {
            callback(page - 1); 
        }
    });

    nextBtn?.addEventListener("click", () => {
        callback(page + 1);
    });
}