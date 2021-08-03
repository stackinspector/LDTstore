import { parse as parseYaml } from "https://deno.land/std@0.102.0/encoding/yaml.ts"
import { encodeText, decodeText } from "https://cdn.jsdelivr.net/gh/Berylsoft/DenoBase/textcodec.ts"
import { insert } from "https://cdn.jsdelivr.net/gh/Berylsoft/DenoBase/insert-string.ts"

const dynamic: Record<string, () => Promise<string>> = {
    buttons: async () => {
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

        return handleContainer(parseYaml(await Deno.readTextFile("./build/buttons.yml")) as Container)
    }
}

const getCopyright = async (): Promise<string> => {
    const gitProc = Deno.run({
        cmd: `git log -1 --pretty=format:"%h"`.split(" "),
        cwd: "./",
        stdout: "piped",
    })
    return `<!--
  Copyright 2021 stackinspector. MIT Lincese.
  Source code: https://github.com/stackinspector/LDTstore
  Commit: ${decodeText(await gitProc.output())}
-->
`
}

const getInsertMap = async (): Promise<Map<string, string>> => {
    const map: Map<string, string> = new Map()
    for await (const item of Deno.readDir("./build/modules")) {
        if (item.isFile) map.set(`/*{{${item.name}}}*/`, await Deno.readTextFile("./build/modules/" + item.name))
    }
    for (const [name, func] of Object.entries(dynamic)) {
        map.set(`<!--{{${name}}}-->`, await func())
    }
    return map
}

const minify = async (input: string): Promise<string> => {
    const nodeProc = Deno.run({
        cmd: `html-minifier.cmd --collapse-whitespace --remove-comments --remove-tag-whitespace --minify-css true --minify-js true`.split(" "),
        cwd: "./",
        stdin: "piped",
        stdout: "piped",
    })
    await nodeProc.stdin.write(encodeText(input))
    nodeProc.stdin.close()
    return decodeText(await nodeProc.output())
}

await Deno.writeTextFile(
    "./nginx/wwwroot/index.html",
    await getCopyright() + await minify(insert(await Deno.readTextFile("./build/pages/index.html"), await getInsertMap()))
)
