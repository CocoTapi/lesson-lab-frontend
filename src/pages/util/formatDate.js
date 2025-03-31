// export function formatDateString(dateString) {
//     // Create a new Date object from the date string
//     let date = new Date(dateString);

//     // Extract the year, month, day, hour, and minute
//     let year = date.getUTCFullYear();
//     let month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
//     let day = String(date.getUTCDate()).padStart(2, '0');
//     let hours = String(date.getUTCHours()).padStart(2, '0');
//     let minutes = String(date.getUTCMinutes()).padStart(2, '0');

//     // Format the string as desired
//     return `${month}/${day}/${year} at ${hours}:${minutes}`;
// }