import { nanoid } from "nanoid";

const generateID = (prefix) => {

    if(typeof prefix !== "string") throw Error

    let uid = nanoid(10) + Date.now().toString();
    return prefix.trim() + uid;
}

export { generateID };