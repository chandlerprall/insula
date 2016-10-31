const API_KEY = '3645505-8e53645651d74dccce9b9ceaf';

export function performQuery(query) {
    return fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${query}`).then(response => response.json());
}