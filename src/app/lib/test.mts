import * as db from "./actions";
// db.createUser({username:"linfeng123",
//     password_hash:"12312312321",
//     avatar_url:"https://",
// });
await db.createConversation({
    type:"public",
    name:"Group2"
})
await db.createConversation({
    type:"public",
    name:"Group3"
})
await db.addUserToConversation(1,2,"owner")
await db.addUserToConversation(1,3,"owner")
// db.addUserToConversation(10,1,"admin")
// db.sendMessage({
//     conversation_id:1,
//     user_id:1,
//     content:"first message",
//     type:"text"
// })
//console.log(await db.getMessagesFromConversation(1))

//console.log(await db.getConversationList(1))
//db.removeUserFromConversation(1,1)
// sendMessage({
//     conversation_id: z.number(),
//     sender_id: z.number(),
//     content: z.string(),
//     type: z.string(),
//     created_at: z.string()
// });