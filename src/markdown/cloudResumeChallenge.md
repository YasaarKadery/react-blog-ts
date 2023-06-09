# The Cloud Resume Challenge

---

## Introduction

During the summer semester of my senior year, I stumbled upon the Cloud Resume Challenge. It is a challenge consisting of 16 steps in which you deploy a static website to the cloud. Although it sounds simple, it is more complicated than it seems. When I first looked into the details of the challenge, I thought it would be relatively easy. I was in my senior year with a degree in Computer Science. I had experience with multiple programming languages and had a strong foundational base in general IT knowledge. Piece of cake, right? I couldn't be more wrong.

In this article I thought I'd just write about my own struggles at certain points throughout the challenge and my own solutions to these problems.

---

## A False Sense of Security

The first steps of the challenge were actually very easy. I was to write a resume website in HTML, then style it with CSS. After that, I had to host this static website to the cloud. In this challenge I was using AWS as my primary cloud provider, therefore, S3 was the practical choice. For the unaware, Simple Storage Service(S3) is a cloud storage solution provided by Amazon. After hosting the website on S3, the next step was to ensure that my website was using HTTPS. HTTPS is just a protocol that encrypts the information sent between web server and web browser. Most websites use HTTPS nowadays and if they don't, tread with caution!

Anyways, S3 doesn't provide HTTPS when hosting a static website in a S3 bucket so I had to use Amazon Cloudfront. Cloudfront is just a Content Delivery Network (CDN). This part was a bit confusing since I wasn't sure why I couldn't just do all of this within S3. In my eyes, both services seemed to provide the same functionality. They store data, right? After some research, I came to learn that S3 stores your data in some data center, and Cloudfront serves as a proxy to the data. In other words, Cloudfront enables you to distribute your website on a global scale through the use of edge locations and increases performance through the use of caches (we will see this in action in the next article). Though they technically both "store" data, they are fundamentally different in nature. Hopefully that helped clear things up for people who are taking the challenge and got confused at the difference between the two services!

To make my website use HTTPS, I simply created a Cloudfront distribution and pointed it to my S3 bucket holding my website, enabling HTTPS in the process. You can refer to this [AWS tutorial](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-https-requests-s3/) for more detail. At this point, I had completed these first steps with ease. I was under the impression this "challenge" wasn't so much of a challenge. I would be done with this by the end of the week! Until I had to deal with DNS.

---

## Fighting with DNS

The next few steps were a bit more difficult. First, I had to create a custom domain name for my website (as the domain names given by Cloudfront aren't very human friendly). You could use any DNS provider you wish. I used Cloudflare because I liked the name. If I had to do this challenge again though, I would choose Amazon Route 53 as my DNS provider because it integrates with your AWS services very nicely.

Here is where my issues began to arise. I wasn't very confident in my understanding of DNS. How in the world was I supposed to add a domain name registered by Cloudflare to my Cloudfront distribution? I watched tons of YouTube videos on the subject to understand the general terminology surrounding DNS (things like CNAME records, A records, recursive resolver, etc.). This helped me understand articles regarding DNS since I actually understood the "language" they were speaking. After hours of research, I finally figured it out. First, I had to issue a certificate for my custom domain name using Amazon Certificate Manager. Certificates are necessary for HTTPS support and to provide proof that I own the domain. You could provide proof through the use of DNS validation. Amazon provides you a CNAME record to add to the DNS configuration for your domain.

![Example DNS record](https://media.licdn.com/dms/image/D4E12AQH_qiQYRHzxVQ/article-inline_image-shrink_1500_2232/0/1672677614149?e=1691625600&v=beta&t=fcIcxiSr4u-WkskxzZlP_fCYWN4N4Wr18Jup7O3B-FA)

After heading to Cloudflare and adding the record to the configuration, I had to wait around 24 hours for the certificate to be issued. Once that was complete, I had to add another CNAME record pointing my custom domain name to my Cloudfront distribution URL. And that was it! I finally got my custom domain working!

![](https://media.licdn.com/dms/image/D4E12AQGPjfHemCEeGQ/article-inline_image-shrink_1500_2232/0/1672677775734?e=1691625600&v=beta&t=wrp5J839xOfNDZElzNj9crOpZvtNzALMZrLkKJV7otk)

---

## The Eye of the Storm

Once I got over this DNS hurdle, the next few steps were straightforward. Create a Javascript function that includes a visitor counter to my website. Once I get that working, my function should fetch and retrieve data from a database(DynamoDB) that holds the number of visitors and increments it on each visit. Of course, I had to write create an API that would do this for me. I used AWS Lambda and Amazon API Gateway. The overall architecture looked like this:

![Architecture](https://media.licdn.com/dms/image/D4E12AQH2vvsHj_JTUQ/article-inline_image-shrink_1500_2232/0/1672678028470?e=1691020800&v=beta&t=ZzPx6tsFVQcPQBUghn5M-VjXOdWmFxcq942fP8yHHM0)

I used python to write my Lambda functions since that was a language I was most familiar with. All of the struggles I faced in these few steps came from the Lambda function. You see, in order for the Lambda function to interact with the database, I had to use [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html), an AWS SDK for Python that allowed me to create,configure and manage AWS services. I would repeatedly test my lambda function only to get errors of all sorts. Mostly syntax errors and logic errors. In fact, at one point I was stuck because I was getting 'Internal server error' whenever I would call the API. Eventually, I tested the lambda function using a test event and found the following response:

![](https://media.licdn.com/dms/image/D4E12AQGu3jAvsmiVLA/article-inline_image-shrink_1500_2232/0/1672678563821?e=1691625600&v=beta&t=qkxURX8nm_-P1EsMvi7YoaV-I4PVv7NjFV_0oGM7sUA)

Turns out, I was calling the update_item() function on the wrong object! Make sure to read documentation thoroughly folks! One last problem I faced was when I would test my API from my website. I would get an error that looked something like this:

![CORS](https://media.licdn.com/dms/image/D4E12AQH_xwJz0yyIbw/article-inline_image-shrink_1500_2232/0/1672678885314?e=1691625600&v=beta&t=Jl46RjXo2wZDbKCUNLcqf8H9Xm-cEB0cbooO4M4l4x8)

Seem familiar? Well, not for me. This was the first time I ever heard of a Cross-Origin Request. I had to do a little googling to figure out where I went wrong. CORS, or Cross-Origin Resource Sharing, is a mechanism that allows a website on one domain request data from another domain. Inside our browsers(Firefox, Chrome, Edge, etc..) is another mechanism called the Same Origin Policy. This policy allows websites to freely request data from it's own domain but blocks any requests from websites outside it's domain. It does this by sending the web server a request with a header indicating the request's Origin. The server responds with an 'Access-Control-Allow-Origin' header that shows which requests are valid. This is purely for security reasons, imagine if a bad actor got a hold of your API endpoints and started abusing them! So the solution was fairly simple, all I had to do was configure CORS in API gateway to allow requests from my domain.

---

And that was it! I was finally able to call my API from my domain. I opened my website on my browser and saw my visitor count correctly show the number of visitors. I refreshed and the number of visitors went up by one! Great, everything was working as expected. The next half of the challenge is my favorite! In the second half, we start heading into DevOps territory.

## Infrastructure as Code

Infrastructure as Code is the process of managing or provisioning of infrastructure through code. When first learning AWS, or Azure or even GCP, you probably will mess around in the console a lot. While that is fine to do, it is much more convenient to use IaC to do the heavy lifting for you. It is faster, more convenient and scalable.

There are many IaC tools out there. AWS has it's very own IaC "tool" called AWS SAM (Serverless Application Model), allowing you to define serverless resources (ex. lambda) using a SAM template file. I chose not to use SAM because Terraform was compatible with many different cloud providers and I didn't want to be restricted to only AWS. I plan on learning other cloud services in the future so Terraform was the best option for me.

---

## The first hurdle

When I first read about Infrastructure as Code I was daunted. There was quite a bit of information to digest and this entire concept was new to me. After reading a few of the Terraform tutorials, I started to realize the concepts were actually quite simple, especially for my own use case. The Terraform workflow really just boiled down to creating your resources in Terraform's configuration language (which is relatively intuitive), planning the new state of your infrastructure and comparing it the current state, and finally letting Terraform automatically provision your resources for you. Here's an example of what it looks like:
![terraform resource](https://media.licdn.com/dms/image/D4E12AQHJXKpb4TBwKw/article-inline_image-shrink_1500_2232/0/1672605079368?e=1691625600&v=beta&t=awj0Br9q8yknKhgRaTahDDp5tAobqhFcKjXPGpOJW2Q)

As you can see in the picture above, the Terraform configuration file really just consists of a bunch of these "resource" blocks that define different AWS resources or even IAM roles/policies. Once I finished writing my configuration all I had to do was type a few commands in the terminal and my resources were automatically deployed to AWS! You can refer to my entire code here.
