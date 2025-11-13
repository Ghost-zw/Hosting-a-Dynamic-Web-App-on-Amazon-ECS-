# Hosting-a-Dynamic-Web-App-on-Amazon-ECS
Dynamic Website Hosting using Amazon Route 53, Amazon Certificate Manager, Amazon RDS, Amazon ECS & ECR
This guide is going to show you how to create an Amazon S3 Website, using Amazon Route 53, Amazon Certificate Manager, Amazon RDS, Amazon ECS & ECR, VPC, ALB

# Architecture 

<img width="4768" height="1752" alt="dynamic web app" src="https://github.com/user-attachments/assets/56df5833-c990-4a81-9fd5-d3c517ca56b1" />

This diagram shows the key components of our setup, including:

<p>Route 53 a Scalable Domain Name System (DNS) web service.</p>
<p>Amazon Certificate Manager a service that simplifies the process of provisioning, managing, and deploying SSL/TLS certificates for AWS services.</p>
<p>Amazon RDS is a managed cloud database service that automates routine tasks for relational databases, making it easier to set up, operate, and scale.</p>
<p>Amazon ECS (Elastic Container Service) is a managed service for running and managing Docker containers, while Amazon ECR (Elastic Container Registry) is a fully managed Docker container registry for storing, managing, and deploying container images.</p>
<p>Amazon ALB (Application Load Balancer) is a managed load balancing service that automatically distributes incoming application traffic across multiple targets, such as EC2 instances or containers, to enhance application availability and performance.</p>
<p>Amazon VPC (Virtual Private Cloud) is a service that allows users to create a logically isolated network in the AWS cloud, enabling control over network configuration, IP address range, and security settings.</p>

As we progress through this guide, we'll set up each of these components step by step.

## Table of Contents
1. [Overview of Hosting a Dynamic Web App on Amazon ECS](#overview)
2. [Why we need to  host a static S3 website ](#StaticS3Website)
  - Phase 1 : [Create S3 Bucket](#CreateS3Bucket)
  - Phase 2 : [Request a Certicficate with ACM](#RequestACertficate)
  - Phase 3 : [Create Cloudfront Distribution](#Cloudfront)
  - Phase 4 : [Setting Up Route 53](#Route53-Setup)
  - Phase 5 : [Test the the whole solution](#Testing)
3. [Conclusion](#Conclusion)
