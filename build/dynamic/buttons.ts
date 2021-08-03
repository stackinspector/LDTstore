type Button = {
    type: "button"
    target: string
    text: string | null
}

type Text = {
    type: "text"
    footer: boolean
    text: string
}

type List = {
    type: "list"
    id: string
    text: string
    content: (Button | Text)[]
}

type Container = {
    type: "container"
    content: (Button | Text | List)[]
}

const handleButton = (input: Button, top: boolean): string => input.target === null ?
    `<p><a class="button button-detail button-nolink">${input.text}</a></p>` :
    `<p><a class="button${top ? '' : ' button-detail'}" href="/r/${input.target}">${input.text}</a></p>`

const handleText = (input: Text): string => `<span class="${input.footer ? 'text-detail-footer' : 'text'}">${input.text}</span>`

const handleList = (input: List): string => `<p><a class="button" onclick="change('${input.id}-detail')">${input.text}</a></p><div class="detail-container" id="${input.id}-detail">${input.content.map(matcher(false)).join("")}</div>`

const matcher = (top: boolean) => (input: Button | Text | List): string => {
    switch (input.type) {
        case "button": return handleButton(input, top)
        case "text": return handleText(input)
        case "list": {
            if (top) return handleList(input)
            throw new Error("no recursive lists")
        }
        default: throw new Error("unknown type")
    }
}

const handleContainer = (input: Container): string => `<div class="button-container">${input.content.map(matcher(true)).join("")}</div>`

export type { Container as ButtonContainer }
export { handleContainer as getButtons }
