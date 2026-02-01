import sql from "./sql"
import { message, messageWithAvatarURL } from "@/types/message"
import { user, userInGroup } from "@/types/user";
import { conversation } from "@/types/conversation";
export async function sendMessage(message: Omit<message,"created_at"|"id">){
    const result:message[] = await sql`INSERT INTO messages(conversation_id,user_id,content,type)
    VALUES(${message.conversation_id},${message.user_id},${message.content},${message.type})
    RETURNING *
    `;
    return result[0];
    
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
export async function getAvatarUrl(user_id:number){
    const user = await sql`
    SELECT avatar_url FROM users WHERE id=${user_id}
    `
    return user[0].avatar_url;
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
    const usersInGroup:userInGroup[] = await sql`
    SELECT conversation_members.*,users.* FROM conversation_members 
    LEFT JOIN users on users.id=conversation_members.user_id
    WHERE conversation_id=${conversation_id}
    `
    return usersInGroup;
}
export async function getConversationList(user_id:number){
    const conversations:conversation[] = await sql
    `SELECT conversations.* FROM conversations
    JOIN conversation_members ON conversation_members.conversation_id = conversations.id AND user_id=${user_id} AND is_deleted=FALSE
    `
    for (const conv of conversations) {
        if (conv.type === "private") {
            const users = await getUsersFromConversation(conv.id);
            // 找出对方的信息（不是当前登录用户的那个）
            const otherUser = users.find(u => u.user_id !== user_id) || users[0];
            
            conv.avatar_url = otherUser.avatar_url;
            conv.name = otherUser.username;
        }
    }
    return conversations;
}
export async function getMessagesFromConversation(conversation_id:number){
    const messages:messageWithAvatarURL[] = await sql
    `
    SELECT messages.*,users.avatar_url FROM messages
    LEFT JOIN users on messages.user_id=users.id
    WHERE conversation_id=${conversation_id}
    ORDER BY messages.created_at ASC
    `
    return messages;
}