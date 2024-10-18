use rocket::serde::{json::Json, Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Message {
    title: String,
    text: String,
    author: String,
    side: String,
    session: String,
    parent: String,
}

#[post("/checkMsg", data = "<message>")]
pub async fn check_msg(message: Json<Message>) -> Json<Message> {
    let mut title = message.title.clone();
    let mut text = message.text.clone();
    if message.title.to_ascii_lowercase().contains("rust")
        || message.text.to_ascii_lowercase().contains("rust")
    {
        title = "Rusted!".to_string();
        text = "This message has been altered by Rust!".to_string();
    }
    Json(Message {
        title,
        text,
        author: message.author.clone(),
        side: message.side.clone(),
        session: message.session.clone(),
        parent: message.parent.clone(),
    })
}
