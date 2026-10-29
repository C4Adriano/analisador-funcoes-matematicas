export async function showAlert(message: string): Promise<void> {
    alert(message)
}

export async function showPrompt(message: string, placeholder = ""): Promise<string | null> {
    return prompt(message, placeholder)
}

export async function showConfirm(message: string): Promise<boolean> {
    return confirm(message)
}
