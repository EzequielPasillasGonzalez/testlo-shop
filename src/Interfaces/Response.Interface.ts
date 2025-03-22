interface Body {
    message: string
    data: []
}

export interface Response {
    ok: boolean
    body: Body
}