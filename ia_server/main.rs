#[macro_use]
extern crate rocket;

use rocket::serde::{json::Json, Deserialize};

#[get("/")]
fn index() -> &'static str {
    "Hello, snoup???"
}

#[get("/hello/<name>?<age>")]
fn hello(name: &str, age: Option<u8>) -> String {
    match age {
        Some(age) => format!("Hello, {}! You are {} years old.", name, age),
        None => format!("Hello, {}!", name),
    }
}

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct UserInput {
    name: String,
    age: Option<u8>,
}

#[post("/hello", format = "application/json", data = "<user_input>")]
fn hello_post(user_input: Json<UserInput>) -> String {
    let name = &user_input.name;
    let age = user_input.age;
    match age {
        Some(age) => format!("Hello, {}! You are {} years old.", name, age),
        None => format!("Hello, {}!", name),
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, hello, hello_post])
}
