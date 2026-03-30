export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage(key, defaultValue = []) {
    const raw = localStorage.getItem(key);

    if (!raw) return defaultValue;

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error(`Failed to parse localStorage key: ${key}`, error);
        return defaultValue;
    }
}

export function getCourseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("courseId");
}

export function formatPrice(price) {
    const value = Number(price || 0);
    return value === 0 ? "Free" : value.toLocaleString("vi-VN") + " VND";
}

export function redirectToLogin() {
    window.location.href = "../../login.html";
}