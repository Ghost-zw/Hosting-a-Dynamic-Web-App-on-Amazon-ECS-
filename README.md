# Hosting-a-Dynamic-Web-App-on-Amazon-ECS
Dynamic Website Hosting using Amazon Route 53, Amazon Certificate Manager, Amazon RDS, Amazon ECS & ECR
This guide is going to show you how to create an Amazon S3 Website, using Amazon Route 53, Amazon Certificate Manager, Amazon RDS, Amazon ECS & ECR, VPC, ALB

# Architecture 

<img width="4768" height="1752" alt="dynamic web app" src="https://github.com/user-attachments/assets/56df5833-c990-4a81-9fd5-d3c517ca56b1" />

This diagram shows the key components of our setup, including:

<p><b>Route 53</b> a Scalable Domain Name System (DNS) web service.</p>
<p><b>Amazon Certificate Manager</b> a service that simplifies the process of provisioning, managing, and deploying SSL/TLS certificates for AWS services.</p>
<p><b>Amazon RDS</b> is a managed cloud database service that automates routine tasks for relational databases, making it easier to set up, operate, and scale.</p>
<p><b>Amazon ECS (Elastic Container Service)</b> is a managed service for running and managing Docker containers, while Amazon ECR (Elastic Container Registry) is a fully managed Docker container registry for storing, managing, and deploying container images.</p>
<p><b>Amazon ALB (Application Load Balancer)</b> is a managed load balancing service that automatically distributes incoming application traffic across multiple targets, such as EC2 instances or containers, to enhance application availability and performance.</p>
<p><b>Amazon VPC (Virtual Private Cloud</b>) is a service that allows users to create a logically isolated network in the AWS cloud, enabling control over network configuration, IP address range, and security settings.</p>

As we progress through this guide, we'll set up each of these components step by step.

## Table of Contents
1. [Overview of Hosting a Dynamic Web App on Amazon ECS](#overview)
2. [Why we need to  host a Dynamic Web App n containers and using Amazon ECS ](#DynamicWebsiteApp)
  - Phase 1 : [Create VPC](#CreateVPC)
  - Phase 2 : [Create Database](#CreateDatabase)
  - Phase 3 : [Setup Amazon ECS](#AmazonECS)
  - Phase 4 : [Setup Amazon ALB](#AmazonALB)
  - Phase 5 : [Request a Certicficate with ACM](#RequestACertficate)
  - Phase 6 : [Setting Up Route 53](#Route53-Setup)
  - Phase 7 : [Test the the whole solution](#Testing)
3. [Conclusion](#Conclusion)

# Overview of Hosting a Dynamic Web App on Amazon ECS using fargate instances, Amazon RDS, Amazon ALB, Amazon ECR and ACM Architecture 
<a name="overview"></a>
<p>Hosting a dynamic web application on Amazon ECS using Fargate, Amazon RDS, Amazon ALB, Amazon ECR, and AWS Certificate Manager (ACM) provides a fully managed, scalable, and secure cloud-native architecture. The application is containerized and deployed on Amazon ECS (Elastic Container Service) with Fargate, which runs containers serverlessly—removing the need to manage EC2 instances. The container images are stored securely in Amazon ECR (Elastic Container Registry), ensuring version control and reliable image distribution.</p>

<p>Incoming user traffic is routed through an Application Load Balancer (ALB), which distributes requests evenly across running container tasks, supports HTTPS termination using SSL/TLS certificates from AWS Certificate Manager (ACM), and performs health checks to ensure only healthy containers receive traffic. The application connects to a Amazon RDS (Relational Database Service) instance, hosted in a private subnet, which provides a managed, secure, and scalable database backend.</p>

<p>This architecture enhances security through VPC isolation and IAM roles, availability via load balancing and auto-scaling, and cost-efficiency through pay-as-you-go Fargate instances. Together, these services form a robust, automated, and resilient environment ideal for hosting dynamic web applications in production.</p>

**Why we need to Host a Dyanmic Web App on Amazon ECS ?**
 <a name="DynamicWebsiteApp"></a>
Hosting a dynamic web app in containers and deploying it with Amazon ECS ensures consistency, scalability, and easier management. Containers package the app and its dependencies into a single, portable unit that runs identically across environments, eliminating configuration issues. ECS then automates deployment, load balancing, scaling, and health monitoring, allowing the app to handle traffic efficiently without manual server management. When combined with AWS Fargate, it becomes serverless — you pay only for compute resources used — making it a secure, cost-effective, and highly resilient way to run dynamic applications in the cloud.

## Phase 1: CREATE  VPC
<a name="CreateVPC"></a>
