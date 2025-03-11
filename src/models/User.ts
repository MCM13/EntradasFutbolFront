export default interface User {
    id: number
    name: string
    surname?: string
    email: string
    password: string
    course?: string
    active: boolean
    acceptNotifications: boolean
    role: string
}