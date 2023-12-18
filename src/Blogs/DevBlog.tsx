import React from "react";
import BlogPostHeader from "../BlogPostHeader";
import "./../styles/BlogPost.css";
import Nav from "../Nav";
import BlogPostSubsection from "../BlogPostSubsection";
import BlogPostCodeBlock from "../BlogPostCodeBlock";
//TODO: create table of contents component, add to each blog
export default function DevBlog() {
  return (
    <>
      <Nav></Nav>
      <div className="blog-post">
        <BlogPostHeader
          title="How I created the Backend for my dev blog"
          bannerImageAlt="Go and React"
          bannerImageLink="https://golang.ch/wp-content/uploads/2022/06/1_I573jH5jB7Olg23gWSxwrA.png"
        ></BlogPostHeader>
        <BlogPostSubsection title="Introduction"></BlogPostSubsection>
        <p className="blog-post-paragraph">
          These past few months I've been learning Go. I've always been more of
          a backend developer but I found myself tired of testing my APIs via
          curl. So I decided to teach myself React as well so I could build my
          own UI. Since I was already learning React and Go, why not build
          something while I'm at it? And just for fun, let's deploy it to the
          cloud. This project is an extension of my previous project, the Cloud
          Resume Challenge (I have another blog post on that project in my
          website as well).
        </p>
        <BlogPostSubsection title="The Backend"></BlogPostSubsection>
        <p className="blog-post-paragraph">
          I usually start projects in the backend. I like to map out the
          database and how the data should "flow" between the browser and
          database. So I made came up with this Go struct as a model for my
          database.
        </p>
        <BlogPostCodeBlock
          code={`type Post struct {
            ID        int    \`json:"id"\`
            Title     string \`json:"title"\`
            Content   string \`json:"content"\`
            CreatedAt string \`json:"created_at"\`
            UpdatedAt string \`json:"updated_at"\`
            ImageSrc  string \`json:"image_src"\`
            Markdown  string \`json:"markdown"\`
          }`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          Pretty basic attributes for a blog post. The first 5 are
          self-explanatory, but <code className="inline-code">ImageSrc</code>{" "}
          and <code className="inline-code">Markdown</code> may be a bit
          confusing. <code className="inline-code">ImageSrc</code> simply holds
          the image URL for the post thumbnail.{" "}
          <code className="inline-code">Markdown</code> holds the link to a
          markdown file. All my blog posts are written in markdown and rendered
          to the browser via the{" "}
          <code className="inline-code">react-markdown</code> library. Why not
          just use React? I felt like React was insufficient for writing blog
          posts. Sure, I could manually write custom react components for each
          and every part of a typical blog post, but that seemed tedious. Why do
          all that when I could just write in markdown and have a library do the
          heavy lifting? It felt like the easier way to do things, but in the
          future I plan to create a more elegant solution to this problem. But
          for now, I have markdown files in an S3 bucket that are fetched and
          then rendered via React (We'll get to that later).
        </p>
        <p className="blog-post-paragraph">
          Anyways, now that we've created our Post model, let's actually
          intiialize a connection to the database. To do this we'll be using the{" "}
          <code className="inline-code">database/sql</code> and{" "}
          <code className="inline-code">github.com/go-sql-driver/mysql</code>{" "}
          package. First declare a pointer to the sql.DB type.
        </p>
        <BlogPostCodeBlock
          code={"var db *sql.DB"}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          The sql.DB object is a database handle representing a pool of database
          connections. This allows us to execute operations on the SQL database
          without us having to worry about the details of connection management.
          And since we'll be needing to import the{" "}
          <code className="inline-code">database/sql package</code>, let's
          import everything we need right now.
        </p>
        <BlogPostCodeBlock
          code={`import (
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
)`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          We can now open a connection to our database. The issue is, we don't
          have a database to open in the first place. So let's fix that. I
          decided on using MySQL because that's what I'm familiar with. We'll
          connect to MySQL as a root user first
        </p>
        <BlogPostCodeBlock
          code={`mysql -u root -p`}
          language="powershell"
          showLineNumbers={false}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          Then we'll create the database and the table required. Notice how the
          table data types are similar to the Go struct we created earlier.
        </p>
        <BlogPostCodeBlock
          code={`CREATE DATABASE IF NOT EXISTS blog_db;
USE blog_db;

CREATE TABLE IF NOT EXISTS posts (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Content TEXT,
    CreatedAt DATETIME,
    UpdatedAt DATETIME,
    ImageSrc TEXT,
    Markdown TEXT
);`}
          language="sql"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          We can fill it with some dummy data for now. The{" "}
          <code className="inline-code">NOW()</code> function is used to get the
          current date and time.
        </p>
        <BlogPostCodeBlock
          code={`USE blog_db;

INSERT INTO posts (Title, Content, CreatedAt, UpdatedAt, ImageSrc, Markdown)
VALUES
('First post', 'This is the content of the first post.', NOW(), NOW(), 'https://example.com/images/first-post.jpg', 'https://example.com/markdown/first-post.md'),

('Second post', 'This is the content of the second post.', NOW(), NOW(), 'https://example.com/images/second-post.jpg', 'https://example.com/markdown/second-post.md'),

('Third post', 'This is the content of the third post.', NOW(), NOW(), 'https://example.com/images/third-post.jpg', 'https://example.com/markdown/third-post.md');`}
          language="sql"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          {" "}
          Now we have a local MySQL database setup, with some placeholder data
          inside our table. Back in our main.go file, let's open a connection to
          our database inside our main() function.
        </p>
        <BlogPostCodeBlock
          code={`func main() {
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
}`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          The <code className="inline-code">sql.Open()</code> function returns a
          pool of database connections to the db variable we declared earlier.
          Now that we're connected to our database, let's create a few routes
          for our API. We'll be using the{" "}
          <code className="inline-code">
            github.com/julienschmidt/httprouter
          </code>
          package for this. Before we do that, let's reformat our code a bit and
          add an application struct and store a{" "}
          <code className="inline-code">sql.DB</code> pointer inside.
        </p>
        <BlogPostCodeBlock
          code={`type application struct {
	db *sql.DB
}`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          {" "}
          Now when we create our handlers later on, they will have access to our
          database connection pool without needing to reference a global db
          variable like before. This is a form of dependency injection in Go,
          and it's pretty neat. Here's the code so far:
        </p>
        <BlogPostCodeBlock
          code={`import (
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
}`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          To handle the routes we can create a file{" "}
          <code className="inline-code">handlers.go</code> in our source
          directory. Add the following lines of code:
        </p>
        <BlogPostCodeBlock
          code={`package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          For now, let's create a simple{" "}
          <code className="inline-code">getPosts()</code> method that returns a
          list of posts in our database. The route should look something like{" "}
          <code className="inline-code">/posts</code>. Here's the code:
        </p>
        <BlogPostCodeBlock
          code={`func (app *application) getPosts(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

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
}`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          Let's break it down line by line, starting with the parameters:
        </p>
        <p className="blog-post-paragraph">
          <code className="inline-code">(app *application)</code> is a receiver
          argument. It means this function is bound to the application struct we
          defined earlier, which allows the function to access the fields and
          methods of the application struct. In this case, app is an instance of
          application and it's a pointer, allowing us to access the db
          connection we opened in the{" "}
          <code className="inline-code">main()</code> function.
        </p>
        <p className="blog-post-paragraph">
          <code className="inline-code">w http.ReponseWriter</code> is an
          interface that a HTTP response writer should implement. It's
          essentially an object that can write the HTTP response. For example,
          <code className="inline-code">
            w.Header().Set("Content-Type", "application/json")
          </code>{" "}
          is used to set the response's content type to "application/json".
        </p>
        <p className="blog-post-paragraph">
          <code className="inline-code">r *http.Request</code> is a struct that
          represents the HTTP request that the client sent to the server. It
          contains information like the HTTP method (GET, POST, etc.), the URL,
          headers, body, etc. Typically you would use it to read request data.
        </p>
        <p className="blog-post-paragraph">
          <code className="inline-code">_httprouter.Params</code> represents the
          parameters from the HTTP route, if there are any. In this case, the
          underscore _ is used to ignore this parameter because it's not being
          used in the function. If this route had parameters (like{" "}
          <code className="inline-code">/posts/:id</code>), you could use{" "}
          <code className="inline-code">httprouter.Params</code> to access those
          parameters (which we do later).
        </p>
        <p className="blog-post-paragraph">
          And inside the function all we really do is:
          <ol>
            <li>
              {" "}
              Set the HTTP response type to{" "}
              <code className="inline-code">"application/json"</code>
            </li>
            <li>
              Create a slice (or array) of{" "}
              <code className="inline-code">struct Post</code> to store the
              response from the database.
            </li>
            <li>
              Use the <code className="inline-code">db.Query</code> function to
              execute a SQL command, in this case selecting all the posts from
              the table.
            </li>
            <li>
              Use the <code className="inline-code">Scan()</code> function on
              the <code className="inline-code">results</code> variable to store
              each post returned into the array of structs.
            </li>
            <li>Return the selected rows from the database in JSON.</li>
          </ol>
        </p>
        <p className="blog-post-paragraph">
          And now we can add this route inside{" "}
          <code className="inline-code">main.go</code>.
        </p>
        <BlogPostCodeBlock
          code={`router := httprouter.New()
router.GET("/posts", app.getPosts)`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          Here <code className="inline-code">httprouter.New</code> initializes a
          router instance so we can register routes to serve HTTP requests. Then
          in the following line, we register a route{" "}
          <code className="inline-code">/posts</code> in the router and tells it
          that any HTTP GET requests to the{" "}
          <code className="inline-code">/posts</code> path should use our{" "}
          <code className="inline-code">getPosts()</code> function to handle
          those requests (remember, our{" "}
          <code className="inline-code">getPosts()</code> function is a method
          against our <code className="inline-code">application</code> struct so
          we need to call it through our{" "}
          <code className="inline-code">app</code> variable). At this point, our{" "}
          <code className="inline-code">main.go</code> file should look like so:
        </p>
        <BlogPostCodeBlock
          code={`import (
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

}`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          If you type and enter <code className="inline-code">go run .</code> in
          your terminal, your server should start running (nothing will print to
          the terminal, but rest assured your server is running). Now that we
          confirmed that everything is working, let's quickly add another route
          so we can select posts by their ID. Add this to{" "}
          <code className="inline-code">handlers.go</code>:
        </p>
        <BlogPostCodeBlock
          code={`func (app *application) getPost(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

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
}`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          and this to <code className="inline-code">main.go</code>:
        </p>
        <BlogPostCodeBlock
          code={`router.GET("/posts/:id", app.getPost)`}
          language="go"
          showLineNumbers={true}
        ></BlogPostCodeBlock>
        <p className="blog-post-paragraph">
          You can test that these routes actually work by executing some curl
          commands:
        </p>
        <BlogPostCodeBlock
          code={`curl http://localhost:8000/posts

curl http://localhost:8000/posts/1`}
          language=""
          showLineNumbers={false}
        ></BlogPostCodeBlock>

        <BlogPostSubsection title="Conclusion"></BlogPostSubsection>
        <p className="blog-post-paragraph">
          And that is pretty much the backend for my blog! This isn't the end of
          these blog posts, as I still have to write the blog post for the
          frontend portion of this website. I also plan on writing about how I
          deployed this project to AWS in another blog post. Stay tuned for
          that!
        </p>
      </div>
    </>
  );
}
