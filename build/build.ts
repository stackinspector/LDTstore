import { parse as parseYaml } from "https://deno.land/std@0.102.0/encoding/yaml.ts"

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

/* TODO enhance performance by using string[] as string builders */
const insert = (template: string, content: Record<string, string>) => {
    let current = template
    for (const [key, val] of Object.entries(content)) {
        const splited = current.split(key)
        if (splited.length !== 2) throw new Error(`split error when key=${key}`)
        const [foo, bar] = splited
        current = foo + val + bar
    }
    return current
}

Deno.writeTextFileSync(
    "C:/swap/stuff/testhtml/index.html",
    insert(
        Deno.readTextFileSync("./index.prebuild.html"),
        {
            "<!--{{buttons}}-->": handleContainer(
                parseYaml(Deno.readTextFileSync("./buttons.yml")) as Container
            ),
            "/*{{base.css}}*/": Deno.readTextFileSync("./base.css"),
            "/*{{buttons.css}}*/": Deno.readTextFileSync("./buttons.css"),
        }
    )
)
