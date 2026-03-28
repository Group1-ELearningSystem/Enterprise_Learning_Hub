import { setupSearchFilter } from "../../components/requests/requestSearch.js"
import { attachRequestEvent, renderRequestTable } from "../../components/requests/requestTable.js"
import { getRequests } from "../../services/requestService.js"

export async function renderRequests(){
    const reqTable = document.getElementById("requestTable")
    const token = localStorage.getItem("token")
    const requests = await getRequests(token)

    reqTable.innerHTML = renderRequestTable(requests)
    attachRequestEvent()
    setupSearchFilter()
}