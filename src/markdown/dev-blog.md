# Dev Blog w/ React and Go

---

&nbsp;

![Go and React](https://golang.ch/wp-content/uploads/2022/06/1_I573jH5jB7Olg23gWSxwrA.png)

## Introduction

&nbsp;

These past few months I've been learning Go. I've always been more of a backend developer but I found myself tired of testing my APIs via curl. So I decided to teach myself React as well so I could build my own UI. Since I was already learning React and Go, why not build something while I'm at it? And just for fun, let's deploy it to the cloud. This project is an extension of my previous project, the Cloud Resume Challenge (I have another blog post on that project in my website as well).

## The Backend

&nbsp;

I usually start projects in the backend. I like to map out the database and how the data should "flow" between the browser and database. So I made came up with this Go struct as a model for my database.

&nbsp;

```go
type Post struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	ImageSrc  string `json:"image_src"`
	Markdown  string `json:"markdown"`
}
```

&nbsp;

Pretty basic attributes for a blog post. The first 5 are self-explanatory, but `ImageSrc` and `Markdown` may be a bit confusing.` ImageSrc` simply holds the image URL for the post thumbnail. `Markdown` holds the link to a markdown file. All my blog posts are written in markdown and rendered to the browser via the `react-markdown` library.

Why not just use React? I felt like React was insufficient for writing blog posts. I would need to create some sort of text editor and then implement the logic to post the rendered html to the database. Why do all that when I could just write in markdown. It felt like the easier way to do things, but in the future I plan to create a more elegant solution to this problem. But for now, I have markdown files in an S3 bucket that are fetched and then rendered via React (We'll get to that later).

Anyways, now that we've created our Post model, let's actually intiialize a connection to the database. To do this we'll be using the `database/sql` and `github.com/go-sql-driver/mysql` package. First declare a pointer to the sql.DB type.

```go
var db *sql.DB
```

The sql.DB object is a database handle representing a pool of database connections. This allows us to execute operations on the SQL database without us having to worry about the details of connection management. And since we'll be needing to import the `database/sql` package, let's import everything we need right now.

```go
import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
)
```

We can now open a connection to our database. The issue is, we don't have a database to open in the first place. So let's fix that. I decided on using MySQL because that's what I'm familiar with. We'll connect to MySQL as a root user first

```bash
mysql -u root -p
```

Then we'll create the database and the table required. Notice how the table data types are similar to the Go struct we created earlier.

```sql
CREATE DATABASE IF NOT EXISTS blog_db;
USE blog_db;

CREATE TABLE IF NOT EXISTS posts (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Content TEXT,
    CreatedAt DATETIME,
    UpdatedAt DATETIME,
    ImageSrc TEXT,
    Markdown TEXT
);
```

We can fill it with some dummy data for now. The NOW() function is used to get the current date and time.

```sql
USE blog_db;

INSERT INTO posts (Title, Content, CreatedAt, UpdatedAt, ImageSrc, Markdown)
VALUES
('First post', 'This is the content of the first post.', NOW(), NOW(), 'https://example.com/images/first-post.jpg', 'https://example.com/markdown/first-post.md'),

('Second post', 'This is the content of the second post.', NOW(), NOW(), 'https://example.com/images/second-post.jpg', 'https://example.com/markdown/second-post.md'),

('Third post', 'This is the content of the third post.', NOW(), NOW(), 'https://example.com/images/third-post.jpg', 'https://example.com/markdown/third-post.md');
```

Now we have a local MySQL database setup, with some placeholder data inside our table. Back in our `main.go` file, let's open a connection to our database inside our `main()` function.

```go
func main() {
	// The format is username:password@tcp(host:port)/dbname
	db, err := sql.Open("mysql", "root:password@tcp(127.0.0.1:3306)/blog_db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	// ping the database to check connection status
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
}
```

The `sql.Open()` function returns a pool of database connections to the `db` variable we declared earlier. Now that we're connected to our database, let's create a few routes for our API. We'll be using the `github.com/julienschmidt/httprouter` package for this. Before we do that, let's reformat our code a bit and add an application struct and store a `sql.DB` pointer inside.

```go
type application struct {
	db *sql.DB
}
```

Now when we create our handlers later on, they will have access to our database connection pool without needing to reference a global `db` variable like before. This is a form of dependency injection in Go, and it's pretty neat. Here's the code so far:

```go
import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
)
type application struct {
	db *sql.DB
}
func main() {
	// The format is username:password@tcp(host:port)/dbname
	db, err := sql.Open("mysql", "root:password@tcp(127.0.0.1:3306)/blog_db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	// ping the database to check connection status
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	app := application {
		db: db,
	}
}
```

To handle the routes we can create a file `handlers.go` in our source directory. Add the following lines of code

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)
```

For now, let's create a simple `getPosts()` method that returns a list of posts in our database. The route should look something like `/posts`. Here's the code:

```go
func (app *application) getPosts(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	w.Header().Set("Content-Type", "application/json")
	var posts []Post
	result, err := app.db.Query("SELECT id, title, content, created_at,updated_at, image_src, markdown from posts")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var post Post
		err := result.Scan(&post.ID, &post.Title, &post.Content, &post.CreatedAt, &post.UpdatedAt, &post.ImageSrc, &post.Markdown)
		if err != nil {
			panic(err.Error())
		}
		posts = append(posts, post)
	}
	json.NewEncoder(w).Encode(posts)
}
```

Let's break it down line by line, starting with the parameters:
&nbsp;

`(app *application)` is a receiver argument. It means this function is bound to the application struct we defined earlier, which allows the function to access the fields and methods of the application struct. In this case, app is an instance of application and it's a pointer, allowing us to access the db connection we opened in the `main()` function.

&nbsp;

`w http.ReponseWriter` is an interface that a HTTP response writer should implement. It's essentially an object that can write the HTTP response. For example, `w.Header().Set("Content-Type", "application/json")` is used to set the response's content type to `"application/json"`.

&nbsp;

`r *http.Request` is a struct that represents the HTTP request that the client sent to the server. It contains information like the HTTP method (GET, POST, etc.), the URL, headers, body, etc. Typically you would use it to read request data.

&nbsp;

`_httprouter.Params` represents the parameters from the HTTP route, if there are any. In this case, the underscore \_ is used to ignore this parameter because it's not being used in the function. If this route had parameters (like `/posts/:id`), you could use `httprouter.Params` to access those parameters (which we do later).

&nbsp;

And inside the function all we really do is:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Set the HTTP response type to `"application/json"`

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Create a slice (or array) of struct `Post` to store the response from the database.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Use the `db.Query` function to execute a SQL command, in this case selecting all the posts from the table.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. Use the `Scan()` function on the `results` variable to store each post returned into the array of structs.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5. Return the selected rows from the database in JSON.

And now we can add this route inside `main.go`.

```go
router := httprouter.New()
router.GET("/posts", app.getPosts)
```

Here `httprouter.New` initializes a router instance so we can register routes to serve HTTP requests. Then in the following line, we register a route `/posts` in the router and tells it that any HTTP GET requests to the `/posts` path should use our `getPosts()` function to handle those requests (remember, our `getPosts` function is a method against our `application` struct so we need to call it through our `app` variable). At this point, our `main.go` file should look like so:

```go
import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
)
type application struct {
	db *sql.DB
}
func main() {
	// The format is username:password@tcp(host:port)/dbname
	db, err := sql.Open("mysql", "root:password@tcp(127.0.0.1:3306)/blog_db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	// ping the database to check connection status
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	app := application {
		db: db,
	}

	router := httprouter.New()
	router.GET("/posts", app.getPosts)
	log.Fatal(http.ListenAndServe(":8000", router))

}
```

If you type and enter `go run .` in your terminal, your server should start running (nothing will print to the terminal, but rest assured your server is running). Now that we confirmed that everything is working, let's quickly add another route so we can select posts by their ID. Add this to `handlers.go`

```go
func (app *application) getPost(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	w.Header().Set("Content-Type", "application/json")
	id, _ := strconv.Atoi(ps.ByName("id"))
	result, err := app.db.Query("SELECT id, title, content, created_at, updated_at, image_src, markdown FROM posts WHERE id = ?", id)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var post Post
	for result.Next() {
		err := result.Scan(&post.ID, &post.Title, &post.Content, &post.CreatedAt, &post.UpdatedAt, &post.ImageSrc, &post.Markdown)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(post)
}
```

and this to `main.go`

```go
router.GET("/posts/:id", app.getPost)
```

You can test that these routes actually work by executing some curl commands:

```bash
curl http://localhost:8000/posts

curl http://localhost:8000/posts/1
```

## Conclusion

And that is pretty much the backend for my blog! This isn't the end of these blog posts, as I still have to write the blog post for the frontend portion of this website. I also plan on writing about how I deployed this project to AWS in another blog post. Stay tuned for that!
