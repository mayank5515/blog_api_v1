BLOG_API_V1-> Based on REST architecture ,followed by good/safe api practices 😇.

Allows CRUD operation (GET,POST,PATCH,DELETE)🛠️

On top of that has some already pre-defined routes (we will get to that later)

How to access ? 🧐
https://localhost:PORT/api/v1/blog
https://localhost:PORT/api/v1/blog/:id (for id specific CRUD operations) (update blog,get blog,delete blog)

//PRE-DEFINED-ROUTES 🧭
https://localhost:PORT/api/v1/blog/top-five-liked 
https://localhost:PORT/api/v1/blog/top-five-recent
https://localhost:PORT/api/v1/blog/similar-blogs

what can u expect:
{
    "status": "success",
    "results": 1,
    "blogs": [
        {
            "_id": "65f7ef786ef212970c61a223",
            "title": "This is test blog 11",
            "blog": "bla bla goo goo bla bla goo goo",
            "createdAt": "2024-03-18T07:38:27.423Z",
            "likes": 0,
            "tags": [
                "Cooking",
                "Lifestyle"
            ],
            "slug": "This-is-test-blog-11"
        },
}
