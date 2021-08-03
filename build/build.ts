import { parse as parseYaml } from "https://deno.land/std@0.102.0/encoding/yaml.ts"
import { encodeText, decodeText } from "https://cdn.jsdelivr.net/gh/Berylsoft/DenoBase/textcodec.ts"

import { getButtons, ButtonContainer } from "./dynamic/buttons.ts"

type StringMap = Record<string, string>

/* TODO enhance performance by using string[] as string builders */
const insert = (template: string, content: StringMap) => {
    let current = template
    for (const [key, val] of Object.entries(content)) {
        const splited = current.split(key)
        if (splited.length !== 2) throw new Error(`split error when key=${key}`)
        const [foo, bar] = splited
        current = foo + val + bar
    }
    return current
}

const getCopyright = async (): Promise<string> => {
    const gitProc = Deno.run({
        cmd: ["git", "log", "-1", '--pretty=format:"%h"'],
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

const getModulesMap = async (): Promise<StringMap> => {
    const MODULE_PATH = "./build/modules/"
    const map: StringMap = {}
    for await (const item of Deno.readDir(MODULE_PATH)) {
        if (item.isFile) map[`/*{{${item.name}}}*/`] = await Deno.readTextFile(MODULE_PATH + item.name)
    }
    return map
}

const minify = async (input: string): Promise<string> => {
    const nodeProc = Deno.run({
        cmd: ["html-minifier.cmd", "--collapse-whitespace", "--remove-comments", "--remove-tag-whitespace", "--minify-css", "true", "--minify-js", "true"],
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
    await getCopyright() + await minify(insert(
        await Deno.readTextFile("./build/pages/index.html"),
        {
            ...await getModulesMap(),
            "<!--{{buttons}}-->": getButtons(
                parseYaml(await Deno.readTextFile("./build/dynamic/buttons.yml")) as ButtonContainer
            ),
        }
    ))
)
