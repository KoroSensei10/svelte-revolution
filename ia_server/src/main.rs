#[macro_use]
extern crate rocket;

mod api;

#[get("/health")]
fn health() -> &'static str {
    "OK"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/api", routes![health, api::check_msg])
}
