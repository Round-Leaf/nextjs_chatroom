import postgres from "postgres"
const sql = postgres("postgres://postgres:123456@localhost:5432/chatroom",
    // {
    //     connect_timeout:2,
    //     idle_timeout:2

    // }
);
export default sql