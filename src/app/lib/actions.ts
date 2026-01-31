import sql from "./sql"
import { message } from "@/types/message"
import { user } from "@/types/user";
import { conversation } from "@/types/conversation";
export async function sendMessage(message: Omit<message,"created_at"|"id">){
    await sql`INSERT INTO messages(conversation_id,user_id,content,type)
    VALUES(${message.conversation_id},${message.user_id},${message.content},${message.type})
    `;
    
}
export async function createUser(user:Omit<user,"created_at"|"id">){
    await sql`INSERT INTO users(username,password_hash,avatar_url)
    VALUES(${user.username},${user.password_hash},${user.avatar_url})
    `;
}
export async function getUser(user_id:number){
    const user:user[] = await sql`
    SELECT * FROM users WHERE id=${user_id}
    `
    return user;
}
export async function createConversation(conversation:Omit<conversation,"created_at"|"id">){
    await sql `INSERT INTO conversations(type,name,avatar_url) VALUES(${conversation.type},${conversation.name},${conversation.avatar_url??'https://i.pravatar.cc/150'})`
}

export async function addUserToConversation(user_id:number,conversation_id:number,role:'owner'|'admin'|'user'){
    await sql `INSERT INTO conversation_members(conversation_id,user_id,role)
    VALUES(${conversation_id},${user_id},${role})
    `
}
export async function removeUserFromConversation(user_id:number,conversation_id:number){
    await sql `UPDATE conversation_members SET is_deleted=TRUE WHERE user_id=${user_id} AND conversation_id=${conversation_id}`
}
export async function getUsersFromConversation(conversation_id:number){
    const users:user[] = await sql`
    SELECT * FROM conversation_members WHERE conversation_id=${conversation_id}
    `
    return users;
}
export async function getConversationList(user_id:number){
    const conversations:conversation[] = await sql
    `SELECT conversations.* FROM conversations
    JOIN conversation_members ON conversation_members.conversation_id = conversations.id AND user_id=${user_id} AND is_deleted=FALSE
    `
    conversations.forEach(async (conversation,i)=>{
        if(conversation.type=="private"){
            const users = await getUsersFromConversation(conversation.id);
            if(users[0].id==user_id){
                conversations[i].avatar_url = users[1].avatar_url;
            }else{
                conversations[i].avatar_url = users[0].avatar_url;
            }
        }
    })
    return conversations;
}
export async function getMessagesFromConversation(conversation_id:number){
    const messages:message[] = await sql
    `
    SELECT * FROM messages WHERE conversation_id=${conversation_id}
    `
    return messages;
}