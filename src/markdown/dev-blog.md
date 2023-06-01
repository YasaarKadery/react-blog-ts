# Dev Blog w/ React and Go

![Go and React](https://golang.ch/wp-content/uploads/2022/06/1_I573jH5jB7Olg23gWSxwrA.png)

## Introduction

These past few months I've been learning Go. I've always been more of a backend developer but I found myself tired of testing my APIs via curl. So I decided to teach myself React aswell so I could build my own UI. Since I was already learning React and Go, why not build something while I'm at it? And just for fun, let's deploy it to the cloud. And this website is the result of my hard work.

## The Backend

I usually start projects in the backend. I like to map out the database and how the data should "flow" between the browser and database. So I made came up with this Go struct as a model for my database.

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

Pretty basic attributes for a blog post. The first 5 are self-explanatory, but `ImageSrc` and `Markdown` may be a bit confusing.` ImageSrc` simply holds the image URL for the post thumbnail. `Markdown` holds the link to a markdown file. All my blog posts are written in markdown and rendered to the browser via the `react-markdown` library.

Why not just use React? I felt like React was insufficient for writing blog posts. I would need to create some sort of text editor and then implement the logic to post the rendered html to the database. Why do all that when I could just write in markdown. It felt like the easier way to do things, but in the future I plan to create a more elegant solution to this problem. But for now, I have markdown files in an S3 bucket that are fetched and then rendered via React (We'll get to that later).

Anyways, now that we've created our Post model, let's actually intiialize a connection to the database. To do this we'll be using the `database/sql` and `github.com/go-sql-driver/mysql` package. First declare a pointer to the sql.DB type.

```go
var db *sql.DB
```

The sql.DB object is a database handle representing a pool of database connections. This allows us to execute operations on the SQL database without us having to worry about the details of connection management.
