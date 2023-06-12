# The Cloud Resume Challenge

&nbsp;

## Introduction

&nbsp;

During the summer semester of my senior year, I stumbled upon the Cloud Resume Challenge. It is a challenge consisting of 16 steps in which you deploy a static website to the cloud. Although it sounds simple, it is more complicated than it seems. When I first looked into the details of the challenge, I thought it would be relatively easy. I was in my senior year with a degree in Computer Science. I had experience with multiple programming languages and had a strong foundational base in general IT knowledge. Piece of cake, right? I couldn't be more wrong.

In this article I thought I'd just write about my own struggles at certain points throughout the challenge and my own solutions to these problems.

&nbsp;

---

## A False Sense of Security

&nbsp;

The first steps of the challenge were actually very easy. I was to write a resume website in HTML, then style it with CSS. After that, I had to host this static website to the cloud. In this challenge I was using AWS as my primary cloud provider, therefore, S3 was the practical choice. For the unaware, Simple Storage Service(S3) is a cloud storage solution provided by Amazon. After hosting the website on S3, the next step was to ensure that my website was using HTTPS. HTTPS is just a protocol that encrypts the information sent between web server and web browser. Most websites use HTTPS nowadays and if they don't, tread with caution!

Anyways, S3 doesn't provide HTTPS when hosting a static website in a S3 bucket so I had to use Amazon Cloudfront. Cloudfront is just a Content Delivery Network (CDN). This part was a bit confusing since I wasn't sure why I couldn't just do all of this within S3. In my eyes, both services seemed to provide the same functionality. They store data, right? After some research, I came to learn that S3 stores your data in some data center, and Cloudfront serves as a proxy to the data. In other words, Cloudfront enables you to distribute your website on a global scale through the use of edge locations and increases performance through the use of caches (we will see this in action in the next article). Though they technically both "store" data, they are fundamentally different in nature. Hopefully that helped clear things up for people who are taking the challenge and got confused at the difference between the two services!

To make my website use HTTPS, I simply created a Cloudfront distribution and pointed it to my S3 bucket holding my website, enabling HTTPS in the process. You can refer to this [AWS tutorial](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-https-requests-s3/) for more detail. At this point, I had completed these first steps with ease. I was under the impression this "challenge" wasn't so much of a challenge. I would be done with this by the end of the week! Until I had to deal with DNS.

&nbsp;

---

&nbsp;

## Fighting with DNS

&nbsp;

The next few steps were a bit more difficult. First, I had to create a custom domain name for my website (as the domain names given by Cloudfront aren't very human friendly). You could use any DNS provider you wish. I used Cloudflare because I liked the name. If I had to do this challenge again though, I would choose Amazon Route 53 as my DNS provider because it integrates with your AWS services very nicely.

Here is where my issues began to arise. I wasn't very confident in my understanding of DNS. How in the world was I supposed to add a domain name registered by Cloudflare to my Cloudfront distribution? I watched tons of YouTube videos on the subject to understand the general terminology surrounding DNS (things like CNAME records, A records, recursive resolver, etc.). This helped me understand articles regarding DNS since I actually understood the "language" they were speaking. After hours of research, I finally figured it out. First, I had to issue a certificate for my custom domain name using Amazon Certificate Manager. Certificates are necessary for HTTPS support and to provide proof that I own the domain. You could provide proof through the use of DNS validation. Amazon provides you a CNAME record to add to the DNS configuration for your domain.

&nbsp;

![Example DNS record](https://media.licdn.com/dms/image/D4E12AQH_qiQYRHzxVQ/article-inline_image-shrink_1500_2232/0/1672677614149?e=1691625600&v=beta&t=fcIcxiSr4u-WkskxzZlP_fCYWN4N4Wr18Jup7O3B-FA)

&nbsp;

After heading to Cloudflare and adding the record to the configuration, I had to wait around 24 hours for the certificate to be issued. Once that was complete, I had to add another CNAME record pointing my custom domain name to my Cloudfront distribution URL. And that was it! I finally got my custom domain working!

&nbsp;

![](https://media.licdn.com/dms/image/D4E12AQGPjfHemCEeGQ/article-inline_image-shrink_1500_2232/0/1672677775734?e=1691625600&v=beta&t=wrp5J839xOfNDZElzNj9crOpZvtNzALMZrLkKJV7otk)

---

&nbsp;

## The Eye of the Storm

&nbsp;

Once I got over this DNS hurdle, the next few steps were straightforward. Create a Javascript function that includes a visitor counter to my website. Once I get that working, my function should fetch and retrieve data from a database(DynamoDB) that holds the number of visitors and increments it on each visit. Of course, I had to write create an API that would do this for me. I used AWS Lambda and Amazon API Gateway. The overall architecture looked like this:

&nbsp;

![Architecture](https://media.licdn.com/dms/image/D4E12AQH2vvsHj_JTUQ/article-inline_image-shrink_1500_2232/0/1672678028470?e=1691020800&v=beta&t=ZzPx6tsFVQcPQBUghn5M-VjXOdWmFxcq942fP8yHHM0)

&nbsp;

I used python to write my Lambda functions since that was a language I was most familiar with. All of the struggles I faced in these few steps came from the Lambda function. You see, in order for the Lambda function to interact with the database, I had to use [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html), an AWS SDK for Python that allowed me to create,configure and manage AWS services. I would repeatedly test my lambda function only to get errors of all sorts. Mostly syntax errors and logic errors. In fact, at one point I was stuck because I was getting 'Internal server error' whenever I would call the API. Eventually, I tested the lambda function using a test event and found the following response:

&nbsp;

![](https://media.licdn.com/dms/image/D4E12AQGu3jAvsmiVLA/article-inline_image-shrink_1500_2232/0/1672678563821?e=1691625600&v=beta&t=qkxURX8nm_-P1EsMvi7YoaV-I4PVv7NjFV_0oGM7sUA)

&nbsp;

Turns out, I was calling the update_item() function on the wrong object! Make sure to read documentation thoroughly folks! One last problem I faced was when I would test my API from my website. I would get an error that looked something like this:

&nbsp;

![CORS](https://media.licdn.com/dms/image/D4E12AQH_xwJz0yyIbw/article-inline_image-shrink_1500_2232/0/1672678885314?e=1691625600&v=beta&t=Jl46RjXo2wZDbKCUNLcqf8H9Xm-cEB0cbooO4M4l4x8)

&nbsp;

Seem familiar? Well, not for me. This was the first time I ever heard of a Cross-Origin Request. I had to do a little googling to figure out where I went wrong. CORS, or Cross-Origin Resource Sharing, is a mechanism that allows a website on one domain request data from another domain. Inside our browsers(Firefox, Chrome, Edge, etc..) is another mechanism called the Same Origin Policy. This policy allows websites to freely request data from it's own domain but blocks any requests from websites outside it's domain. It does this by sending the web server a request with a header indicating the request's Origin. The server responds with an 'Access-Control-Allow-Origin' header that shows which requests are valid. This is purely for security reasons, imagine if a bad actor got a hold of your API endpoints and started abusing them! So the solution was fairly simple, all I had to do was configure CORS in API gateway to allow requests from my domain.

&nbsp;

---

&nbsp;

And that was it! I was finally able to call my API from my domain. I opened my website on my browser and saw my visitor count correctly show the number of visitors. I refreshed and the number of visitors went up by one! Great, everything was working as expected. The next half of the challenge is my favorite! In the second half, we start heading into DevOps territory.

&nbsp;

## Infrastructure as Code

&nbsp;

Infrastructure as Code is the process of managing or provisioning of infrastructure through code. When first learning AWS, or Azure or even GCP, you probably will mess around in the console a lot. While that is fine to do, it is much more convenient to use IaC to do the heavy lifting for you. It is faster, more convenient and scalable.

There are many IaC tools out there. AWS has it's very own IaC "tool" called AWS SAM (Serverless Application Model), allowing you to define serverless resources (ex. lambda) using a SAM template file. I chose not to use SAM because Terraform was compatible with many different cloud providers and I didn't want to be restricted to only AWS. I plan on learning other cloud services in the future so Terraform was the best option for me.

&nbsp;

---

&nbsp;

## The first hurdle

&nbsp;

When I first read about Infrastructure as Code I was daunted. There was quite a bit of information to digest and this entire concept was new to me. After reading a few of the Terraform tutorials, I started to realize the concepts were actually quite simple, especially for my own use case. The Terraform workflow really just boiled down to creating your resources in Terraform's configuration language (which is relatively intuitive), planning the new state of your infrastructure and comparing it the current state, and finally letting Terraform automatically provision your resources for you. Here's an example of what it looks like:

&nbsp;

![terraform resource](https://media.licdn.com/dms/image/D4E12AQHJXKpb4TBwKw/article-inline_image-shrink_1500_2232/0/1672605079368?e=1691625600&v=beta&t=awj0Br9q8yknKhgRaTahDDp5tAobqhFcKjXPGpOJW2Q)

&nbsp;

As you can see in the picture above, the Terraform configuration file really just consists of a bunch of these "resource" blocks that define different AWS resources or even IAM roles/policies. Once I finished writing my configuration all I had to do was type a few commands in the terminal and my resources were automatically deployed to AWS! You can refer to my entire [code](https://github.com/YasaarKadery/my-resume-infra) here.

&nbsp;

## Continuous Integration, Continuous Delivery

&nbsp;

You may have heard of the term CI/CD before. CI/CD stands for Continuous Integration, Continuous Delivery. Sounds fancy, but what does that even mean? Like me, you might have had a vague idea about what it means. But what does it specifically mean? Continuous Integration is just the practice of consistently adding code changes to a singular shared repository, automatically testing the new code, and automatically building if tests pass.

Continuous Delivery works in tandem with Continuous Integration by automating the provision of any infrastructure (if necessary) and application release processes. If CI is testing and building the application, CD is deploying the application smoothly to any development or production environment. So basically CI/CD is a bunch of automation. If you are a fan of the game Factorio, you'll love this.

&nbsp;

---

&nbsp;

So how does this all fit in to the Challenge? Well the final steps of the Cloud Resume Challenge were to create two seperate repositories, one for front end and one for back end. Then, use any CI/CD tool to have tests run whenever an update was pushed to the main branch of the repositories. For example, suppose I wanted to add another lambda function that would reset the number of website visitors stored in my database. I could update my back end repository which holds my Terraform configuration files and push it to the main branch, which would then run a few tests to make sure the resources I defined were valid. If the tests pass, the update gets pushed to the main branch and Terraform deploys the newly defined resources to the cloud.

&nbsp;

## Github Actions

&nbsp;

I used Github Actions as my CI/CD platform because it seemed simpler to use, though there are many options available (Gitlab, Jenkins, etc). The way Github Action works is you have a YAML file in your Github repo somewhere that defines what to run when certain conditions are met. For example, I configured my repository to run tests whenever changes are pushed onto the main branch. These tests (or "jobs") differed for each repository. For the back end repository, I added a Cypress test that made sure the API returned a status code of 200. I also added a few Terraform commands that validated the configuration and made sure there were no errors in the new state.

&nbsp;

![GH actions](https://media.licdn.com/dms/image/D4E12AQGdejOs6F6jag/article-inline_image-shrink_1000_1488/0/1672607142881?e=1691625600&v=beta&t=wHmvvl1egOJRdwC-FnPIMhHXu99JQrtthXQfUtuCO3I)

&nbsp;

his part of the challenge was a bit challenging. Since running the Terraform commands required me to enter my AWS credentials in my local environment, how would I do this in some virtual container that is running these scripts? Surely I wouldn't hard code my credentials in my public repository for the world to see? It took some time before I learned of a neat thing called Github Secrets which let me add in "secret" information in my workflow. I could now add in confidential information like my AWS secret access key without worrying about any bad actors!

The front end part of this step was very similar. The goal was upload any changes to my repository to the S3 bucket where my resume website is located. I had to use a publicly available Github Action called S3 sync. I also had to add confidential AWS credentials in my workflow and was saved by Github Secrets once again. However I ran into a problem. I pushed changes onto my branch, the tests passed, and I smiled. I quickly checked my website, eager to see my new changes displayed in front of me, only to find the old version of my website looking back at me. I refreshed. The old website didn't change. I refreshed again. Nothing. Changed. What went wrong?

&nbsp;

---

&nbsp;

## Caching

&nbsp;

After a few hours of research I realized the issue. It had to do with the way caching works with CloudFront edge locations. You see, my website is hosted in some S3 bucket somewhere in the United States in some Amazon server. When someone enters "yasaarkadery.com" into their browser here's what happens:

&nbsp;

![Cloudfront](https://media.licdn.com/dms/image/D4E12AQEvIPJXPGPAGg/article-inline_image-shrink_1500_2232/0/1672608593816?e=1691625600&v=beta&t=m1X3MWrGbVSCZaMz9s3gXgJIu0-9e-WoacWsJMKynWg)

&nbsp;

DNS routes the request to the nearest edge location. This is done to reduce latency. If the requested object is in the cache at that edge location, it returns the object. If it isn't in the cache, then Cloudfront forwards the request to the origin server (in this case my s3 bucket hosting my website) and then returns the object back to the edge location. Once the edge location recieves the object, it forwards it back to the user and also adds the object to it's cache.

So essentially what is happening is my requests are returning the cached version of my website. Normally the cache's TTL (time to live) is 24 hours so that is why even after a few hours the website was not updating. Thankfully, this is an easy problem to solve. I could just wait 24 hours, but what if my website really needed an update this instant? Using the AWS Command Line Interface I could just run a command that invalidates the cache for my own Cloudfront distribution:

&nbsp;

```bash
aws cloudfront create-invalidation --distribution-id {distribution_ID} --paths "/{your-path-here}"
```

&nbsp;

Once I ran that command, I refreshed my website and it worked! The new changes were working correctly. And with that, the Cloud Resume Challenge was complete. I had succesfully deployed a website to the cloud incorporating many best practices used by cloud and DevOp engineers on a daily basis.

&nbsp;

---

&nbsp;

## Conclusion

&nbsp;

This challenge was time-consuming and sometimes a bit frustrating but the experience was worth it. I learned so much about general networking concepts, important DevOps best practices and a newfound passion for technology in general. Specifically when learning about DNS and caches. When you really think about it, the fact that we can access content stored on the other side of planet in seconds is fascinating! Anyways, I hoped these articles taught you something or helped you on your own Cloud Resume Challenge. Special shout out to Forrest Brazeal for creating this challenge!
