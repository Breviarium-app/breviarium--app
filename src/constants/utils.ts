export const currentLiturgyHour = () => {
    const hour = new Date().getHours();
    if (hour < 3) {
        return "Completorium";
    } else if (hour < 10) { // previously to 9
        return "Laudes";
    } else if (hour < 12) {
        return "Tercia";
    } else if (hour < 15) {
        return "Sexta";
    } else if (hour < 18) {
        return "Nona";
    } else if (hour < 22) {
        return "Vesperae";
    } else if (hour < 24) {
        return "Completorium"
    }
    return "Laudes" // by default if error
}

export function selectAll(event: any) {
    event.target.select()
}
