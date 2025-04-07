import daisyui from "daisyui"
import {daisyUiThemes} from "./src/themes"

export default {
    content: ['./src/**/*.{vue,js,ts}'],
    plugins: [
        daisyui,
    ],

    daisyui: {
        themes: daisyUiThemes,
    },
}