export type History = {_id : string, title: string}

export type Message = {
        _id :string,
        content :string,
        date: Date,
        role: string
}

export type User = {
        id: string,
        username: string,
        email: string,
        thumbnail: string,
}