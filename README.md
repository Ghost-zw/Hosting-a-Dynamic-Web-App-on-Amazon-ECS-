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

<p>1.In the VPC Dashboard, click on Your VPCs in the left sidebar.</p>
<p>Click on the Create VPC button.</p>
<p>Fill in the following fields:</p>
<p>Name tag: A name for your VPC (e.g., "MyCustomVPC").</p>
<p>IPv4 CIDR block: Specify an IP range using CIDR notation (e.g., 10.0.0.0/16).</p>
<p>IPv6 CIDR block (optional): You can assign an IPv6 block if needed.</p>
<p>Tenancy: Choose between default (shared) or dedicated for hardware.</p>
<p>Click on Create VPC.</p>

<img width="1895" height="812" alt="VPC1" src="https://github.com/user-attachments/assets/5155914d-bf3b-4210-aa7b-0976be7624c6" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1885" height="797" alt="VPC2" src="https://github.com/user-attachments/assets/50132532-4cb3-4a54-9407-791842faf057" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1896" height="843" alt="VPC3" src="https://github.com/user-attachments/assets/d6d76048-ebfb-4bbf-8841-a1293804f12e" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Edit Subnet Settings:**

This allow the public subnets to have IPv4 Addressses

<img width="1892" height="800" alt="Publicsubnet1" src="https://github.com/user-attachments/assets/a80837e7-2041-41ef-bdb3-983fda8c55d4" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Set Public Subnet as Main Route Table:**


<img width="1902" height="843" alt="setRouteTable" src="https://github.com/user-attachments/assets/e9b9cced-6735-4d48-ac24-2bd48bfd41bf" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Create NAT Gateway:**

An Amazon NAT Gateway is a managed service that enables instances in a private subnet to connect to the internet for outbound traffic while preventing inbound internet traffic from reaching those instances.

<img width="1898" height="762" alt="Create NAT Gateway" src="https://github.com/user-attachments/assets/334eae8a-8574-493d-a37a-2f9459790322" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Add NAT Gateway to the Private Subnet Route Table:**

The purpose of a NAT Gateway in a private routing table is to facilitate outbound internet access for EC2 instances within a private subnet while ensuring that those instances remain inaccessible from the public internet. This allows private resources to access updates, download software, and communicate with external services securely.

<img width="1893" height="505" alt="AddNATGW" src="https://github.com/user-attachments/assets/f126a255-c28c-4ee0-a89a-a65195d65245" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## At this point l have managed to setup the VPC and successfully setup the private and public subnets

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Phase 2: Create Database

l am going to create an RDS Database which allows this Car Rental App to insert booking details when a customer wants to rent a car. l previously created the same Database and created a snapshot from that Database, l am going to restore this snapshot in this newly created VPC in a private subnet.

<img width="1900" height="763" alt="CreateDB" src="https://github.com/user-attachments/assets/9f0fdb1a-811a-4ad0-8cf3-bfb188cf2a6b" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1885" height="712" alt="CreateDB2" src="https://github.com/user-attachments/assets/29842998-3e45-4ac2-8d1f-0ebce839a5b5" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1898" height="757" alt="CreateDB3" src="https://github.com/user-attachments/assets/3ebe3f01-c170-4f4b-a233-5889be63eeef" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1902" height="761" alt="CreateDB4" src="https://github.com/user-attachments/assets/574037cf-7a9d-49f7-b174-d2f28e135031" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1895" height="765" alt="CreateDB5" src="https://github.com/user-attachments/assets/5bca5c69-7ac7-4d95-9ec6-3f20bace32ef" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1902" height="761" alt="CreateDB6" src="https://github.com/user-attachments/assets/aefc123c-2037-4d02-85b0-e99bcd2b39ca" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
