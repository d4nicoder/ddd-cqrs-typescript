# 🤝 DDD + CQRS with Typescript

This is a sample project to show how to implement DDD + CQRS with Typescript.

DDD (or Domain Driven Design) is a software development practice that focuses on the business domain as a guide and its model as a communication tool between business and technology.

## The two legs of DDD

### 🔮 Strategic part

The strategic part is the business domain. It is the core of the application. It is the part that is the most difficult to change. It is the part that is the most difficult to understand. It is the part that is the most difficult to test and the part that we will usually spend the most time refining and will involve the most people within a company.

In this phase, domain experts and stakeholders from all areas of the company must work together to define the application domain, its business rules, invariants, use cases, etc., and build a common ubiquitous language between technology and business. This is an ongoing task, which must be carried out together with the evolution of the company.

### 🛠️ Tactical part

This is where we transfer the model we have defined in that strategic part to the application code. This is usually the most popular and stimulating part for developers. However, without a good definition of the domain and its model, usually the tactical part will fail, which will lead us to rewrite our code several times.

In this part is where we will use different tools to represent our model and bring the domain to life. These are Value Objects, Entities, Aggregates, Services, Bounded Contexts and Domain Events among others.

## 🤷‍♂️ What will you see on this repo?

Since the strategic part is something that depends on the business and, as we have already said, involves many people within a company, in this repository we will focus on the tactical part.

Here I propose, based on my own experience, a way to implement a scalable and decoupled architecture that helps us to implement an application following the DDD paradigm applying Hexagonal Architecture and CQRS.


### 🕘 Work in progress

Since this repository exists for didactic and illustrative reasons, I will continue to update it with new ideas or concepts that I can learn related to DDD, Hexagonal Architecture, CQRS and any technology.

Please feel free to participate with comments, issues, PRs or whatever you want. Of course you can fork this project whenever you want and adapt it to your needs.

Finally, if you have reached the end of this README, it would be very cool if you give a ⭐ to this repo 😉

[@d4nicoder](https://www.twitter.com/d4nicoder)
