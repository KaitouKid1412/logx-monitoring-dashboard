export function parseHHMMTo24HourDate(timeNumber) {
    // Convert the number to a string and pad with leading zeros if necessary
    const timeString = String(timeNumber).padStart(4, "0")

    // Extract hours and minutes from the string
    const hours = parseInt(timeString.substring(0, 2), 10)
    const minutes = parseInt(timeString.substring(2, 4), 10)

    // Create a new Date object and set hours and minutes
    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)

    return date
}

export function formatTo24HourHHMM(date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Pad single-digit hours and minutes with leading zeros
    const formattedHours = String(hours).padStart(2, "0")
    const formattedMinutes = String(minutes).padStart(2, "0")

    // Concatenate hours and minutes as a string
    const result = formattedHours + formattedMinutes

    // Convert the result to a number
    return parseInt(result, 10)
}
