#[macro_use]
extern crate rocket;

use rocket::serde::{json::Json, Deserialize, Serialize};

#[get("/")]
fn index() -> &'static str {
    "Hello, snoup???"
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct UserInput {
    name: String,
    age: Option<u8>,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Message {
    message: String,
}

#[post("/hello", format = "application/json", data = "<user_input>")]
fn hello_post(user_input: Json<UserInput>) -> Json<Message> {
    let name = &user_input.name;
    let age = user_input.age;
    let msg = match age {
        Some(age) => format!("Hello, {}! You are {} years old.", name, age),
        None => format!("Hello, {}!", name),
    };
    Json(Message { message: msg })
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, hello_post])
    .mount("/api", routes![index, hello_post])
}
