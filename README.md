# Hosting-a-Dynamic-Web-App-on-Amazon-ECS
Dynamic Website Hosting using Amazon Route 53, Amazon Certificate Manager, Amazon RDS, Cloudfront, Amazon Systems Session Manager, Amazon EC2 instances, Amazon ECS & ECR
This guide is going to show you how to create an Amazon S3 Website, using Amazon Route 53, Amazon Certificate Manager, Amazon RDS, Amazon ECS & ECR, VPC, ALB

# Architecture 

<img width="1435" height="463" alt="Dynamic-webapp" src="https://github.com/user-attachments/assets/c7ef7f14-f820-4607-b310-b1bd27088629" />



This diagram shows the key components of our setup, including:

<p><b>Route 53</b> a Scalable Domain Name System (DNS) web service.</p>
<p><b>Amazon Certificate Manager</b> a service that simplifies the process of provisioning, managing, and deploying SSL/TLS certificates for AWS services.</p>
<p><b>Amazon RDS</b> is a managed cloud database service that automates routine tasks for relational databases, making it easier to set up, operate, and scale.</p>
<p><b>Amazon ECS (Elastic Container Service)</b> is a managed service for running and managing Docker containers, while Amazon ECR (Elastic Container Registry) is a fully managed Docker container registry for storing, managing, and deploying container images.</p>
<p><b>Amazon ALB (Application Load Balancer)</b> is a managed load balancing service that automatically distributes incoming application traffic across multiple targets, such as EC2 instances or containers, to enhance application availability and performance.</p>
<p><b>Amazon CloudFront</b> is a fast content delivery network (CDN) that securely delivers data, videos, applications, and APIs to users globally with low latency and high transfer speeds.</p>
<p><b>Amazon Systems Session Manager</b> is a secure and fully managed tool that allows you to remotely access and manage your AWS instances without the need for an SSH connection or opening inbound ports.</P>
<p><b>Amazon VPC (Virtual Private Cloud</b>) is a service that allows users to create a logically isolated network in the AWS cloud, enabling control over network configuration, IP address range, and security settings.</p>

As we progress through this guide, we'll set up each of these components step by step.

## Table of Contents
1. [Overview of Hosting a Dynamic Web App on Amazon ECS](#overview)
2. [Why we need to  host a Dynamic Web App n containers and using Amazon ECS ](#DynamicWebsiteApp)
  - Phase 1 : [Create VPC](#CreateVPC)
  - Phase 2 : [Create Database](#CreateDatabase)
  - Phase 3 : [Create SSM Manager](#CreateSSMManager)
  - Phase 4 : [Setup Amazon ECS](#AmazonECS)
  - Phase 5 : [Setup Amazon Cloudfront](#AmazonCloudfront)
  - Phase 6 : [Setup Amazon ALB](#AmazonALB)
  - Phase 7 : [Request a Certicficate with ACM](#RequestACertficate)
  - Phase 8 : [Setting Up Route 53](#Route53-Setup)
  - Phase 9 : [Bonus](#Bonus)
  - Phase 10 : [Test the the whole solution](#Testing)
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
<p>2.Click on the Create VPC button.</p>
<p>3.Fill in the following fields:</p>
<p>4.Name tag: A name for your VPC (e.g., "MyCustomVPC").</p>
<p>5.IPv4 CIDR block: Specify an IP range using CIDR notation (e.g., 10.0.0.0/16).</p>
<p>6.IPv6 CIDR block (optional): You can assign an IPv6 block if needed.</p>
<p>7.Tenancy: Choose between default (shared) or dedicated for hardware.</p>
<p>8.Click on Create VPC.</p>

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

**Set Private Subnet as main route table:**


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

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Phase 2: Create Database
<a name="CreateDatabase"></a>

l am going to create an RDS Database which allows this Car Rental App to insert booking details when a customer wants to rent a car. l previously created the same Database and created a snapshot from that Database, l am going to restore this snapshot in this newly created VPC in a private subnet.

<img width="1900" height="763" alt="CreateDB" src="https://github.com/user-attachments/assets/9f0fdb1a-811a-4ad0-8cf3-bfb188cf2a6b" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1885" height="712" alt="CreateDB2" src="https://github.com/user-attachments/assets/29842998-3e45-4ac2-8d1f-0ebce839a5b5" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1898" height="757" alt="CreateDB3" src="https://github.com/user-attachments/assets/3ebe3f01-c170-4f4b-a233-5889be63eeef" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1902" height="761" alt="CreateDB4" src="https://github.com/user-attachments/assets/574037cf-7a9d-49f7-b174-d2f28e135031" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1895" height="765" alt="CreateDB5" src="https://github.com/user-attachments/assets/5bca5c69-7ac7-4d95-9ec6-3f20bace32ef" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1902" height="761" alt="CreateDB6" src="https://github.com/user-attachments/assets/aefc123c-2037-4d02-85b0-e99bcd2b39ca" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


## Phase 3: Create SSM Manager
<a name="CreateSSMManager"></a>

<p>This process securely exposes a private RDS instance to a local machine without using public IPs, SSH, or bastion hosts. A private EC2 instance with the SSM Agent acts as a controlled pivot point, communicating with the AWS SSM control plane through VPC Interface Endpoints instead of the internet. When you initiate a Session Manager port-forwarding session, SSM establishes an authenticated, encrypted WebSocket channel between your laptop and the EC2 instance. AWS then tunnels local traffic through this channel to the RDS endpoint, allowing direct DB access while keeping all infrastructure fully private, tightly IAM-controlled, and auditable in CloudTrail.</p>
<p>Below is the creation of SSM Manager:</p>

<p>1.Create EC2 IAM Role</p>
<p>2.Create IAM role with AmazonSSMManagedInstanceCore.</p>
<p>3.Create instance profile and attach it to the EC2.</p>
<p>4.Launch EC2 SSM Host (Private Only)</p>
<p>5.Private subnet only.</p>
<p>6.No public IP, no SSH, no key pair.</p>
<p>7.Attach sg-ssm-host.</p>
<p>8.Configure Security Groups</p>

      {
      sg-ssm-host → outbound: allow DB port to sg-rds.
      sg-rds → inbound: allow DB port from sg-ssm-host.
      sg-endpoints → inbound: allow TCP/443 from sg-ssm-host.
      }
      
<p>9.Create VPC Interface Endpoints</p>
<p>10.Create these endpoints in the same private subnets:</p>


     {
     com.amazonaws.<region>.ssm
      com.amazonaws.<region>.ec2messages
      com.amazonaws.<region>.ssmmessages
       } 
<p>11.Enable Private DNS, attach sg-endpoints.</p>
<p>12.Verify EC2 is SSM-managed</p>
<p>13.Systems Manager → Fleet Manager → instance should appear.</p>


<img width="1897" height="757" alt="CreateBastionH" src="https://github.com/user-attachments/assets/f0218991-70e0-413f-a83e-97ecc1ae8e96" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1870" height="707" alt="CreateBastionH2" src="https://github.com/user-attachments/assets/a429fa12-3b48-47a2-a598-3a8c7fe93ba6" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1871" height="762" alt="CreateBastionH3" src="https://github.com/user-attachments/assets/55b6b44e-b01b-4102-a1d6-1791801312d9" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Now  am connecting to the database using SSM Port Forwarding using the bastion host using the following steps:

<p>On your local machine open Powershell</p>
<p>run this command </p>

  {
 <p>aws ssm start-session `</p>
  <p>--target "i-0ac8229767bf4826a" `</p>
  <p>--document-name "AWS-StartPortForwardingSessionToRemoteHost" `</p>
  <p>--parameters file://C:\Users\Tanaka\ssm-port.json</p>
  } 


<p><b>If successfull you going to see a Connection Accepted Session</b></p>
  
<img width="1096" height="973" alt="SSM-Powershell-connect" src="https://github.com/user-attachments/assets/85345a36-8834-4eb6-97ea-787d992ae95e" />


**Successfully connected 😁**

Now lets connect our database to Sqlelectron to manage our database using the following steps:

|Setting |	Value   |
|--------|--------- |
|Host	   |127.0.0.1 |
|Port	   |3306      |
|User	   |admin     |
|Password|	(your updated password)|
|Database|	mydb(initial database name)|

<img width="1905" height="1015" alt="Testing-Database" src="https://github.com/user-attachments/assets/c0328f44-4486-4410-ac05-c250706d31c0" />

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


## Phase 4: CREATE  ECS Cluster, Task Definition and Task
<a name="AmazonECS"></a>

**Steps on how to create a ECS Cluster**


<p>In the ECS Dashboard, click on Clusters in the left sidebar.</p>
<p>Click on the Create cluster button.</p>
<p>Choose a Cluster Template</p>
<p>Select a Cluster template that fits your needs. You typically have options like:</p>
<p>Networking only (for Fargate launch type).</p>
<p>EC2 Linux + Networking (for EC2 launch type).</p>
<p>EC2 Windows + Networking (for Windows-based applications).</p>

**Configure Cluster Settings**

<p>Cluster name: Enter a name for your cluster.</p>
<p>Provisioning model: Choose between the default settings or customize EC2 instance types, number of instances, etc., if using the EC2 launch type.</p>
<p>Additional options: Configure settings like Capacity Providers, IAM Roles, and VPC settings based on your requirements.</p>
<p>Click Create.</p>

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1910" height="767" alt="Cluster1" src="https://github.com/user-attachments/assets/19a409bf-0645-4ae6-aeb9-4db9bd2a336d" />


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1897" height="763" alt="Cluster2" src="https://github.com/user-attachments/assets/cf9fbe66-005a-497e-a270-152871617647" />


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Steps on how to create an ECS Task Definition**

<p>In the ECS Dashboard, click on Task Definitions in the left sidebar.</p>
<p>Click on the Create new Task Definition button.</p>
<p>Select the appropriate launch type for your task:</p>
  <p>Fargate (serverless)</p>
  <p>EC2 (for EC2 instances)</p>
<p>Task Definition Name: Enter a unique name for your task definition.</p>
<p>Task Role (optional): Select an IAM role that the task can assume for permissions.</p>
<p>Network Mode: Choose the network mode for the containers in the task:</p>
  <p>bridge (default)</p>
  <p>host</p>
  <p>awsvpc (required for Fargate)</p>
<p>Add Container Definitions</p>
<p>Click on Add container.</p>

**Fill in the following details for the container:**

<p>Container name: A unique name for the container.</p>
  <p>Image: Specify the Docker image (e.g., nginx:latest).</p>
  <p>Memory Limits: Allocate task memory (optional).</p>
  <p>CPU Units: Specify CPU units (optional).</p>
  <p>Environment Variables: Add any environment variables your container needs.</p>
  <p>Port Mappings: Define ports to expose the container (e.g., container port 80 or 3000).</p>
<p>Click Add after configuring the container.</p>
<p>After configuring all containers and settings, click on the Create button at the bottom of the page.</p>


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1902" height="822" alt="TaskDefine1" src="https://github.com/user-attachments/assets/da14b08b-5994-4377-9dec-4ac4ccc63147" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1867" height="827" alt="TaskDefine2" src="https://github.com/user-attachments/assets/1ad3e7a3-54a2-4a49-a6f1-c6e864d00dcf" />

Add a port mapping to your
<img width="1902" height="387" alt="AddPortMapping" src="https://github.com/user-attachments/assets/2990ce5f-3b8a-49ed-aa18-a0b911d62c26" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1906" height="820" alt="ChooseimageInTSD" src="https://github.com/user-attachments/assets/17763e4f-e0ba-4f60-9c5a-3c15cf3dc208" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1861" height="870" alt="ChooseimageInTSD2" src="https://github.com/user-attachments/assets/5e99b2e0-7018-4ef9-9abf-748a87a29bbf" />


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Steps on how to create an ECS Task**

<p>To run the task, go back to the ECS Dashboard and select your cluster.</p>
<p>Click on the Tasks tab, then click on Run new Task.</p>
<p>Select the task definition you just created and configure the launch type (Fargate or EC2).</p>
<p>Choose the number of tasks and any additional settings, then click Run Task.</p>

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1908" height="772" alt="Task1" src="https://github.com/user-attachments/assets/9873f603-89f0-404c-9100-85df0b35bbe2" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1886" height="765" alt="Task2" src="https://github.com/user-attachments/assets/38e76b55-3e56-4622-8262-c8401fcdb6f9" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1892" height="765" alt="Task3" src="https://github.com/user-attachments/assets/677603c0-95c9-44a0-92f0-c5543a3e8597" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1893" height="766" alt="Task4" src="https://github.com/user-attachments/assets/149f1d36-cdcb-4003-881e-f0cff1f5a67e" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1876" height="762" alt="Task5" src="https://github.com/user-attachments/assets/e104a53f-9e2b-4bd6-848c-463cabda76d5" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1900" height="870" alt="TaskRunning" src="https://github.com/user-attachments/assets/84113b2d-b397-4ff7-b70e-eecd7108f794" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


## Phase 5: Setup Amazon Cloudfront
<a name="AmazonCloudfront"></a>

<p>Open CloudFront Console: Search for and select CloudFront.</p>
<p>Create Distribution: Click on Create Distribution.</p>
<p>Select Web: Choose Web under the Select a delivery method for your content section.</p>
<p>Configure Origin Settings:</p>
<p>Origin Domain Name: Enter the URL of your origin (e.g., S3 bucket, web server).</p>
<p>Origin Path (optional): Specify a path if needed.</p>
<p>Configure Default Cache Behavior:</p>
<p>Set Viewer Protocol Policy (e.g., HTTP and HTTPS).</p>
<p>Choose how to handle caching and forwarding cookies, headers, etc.</p>
<p>Configure Distribution Settings:</p>
<p>Enter a Distribution Name and set other options like price class and logging preferences.</p>
<p>Create Distribution: Click Create Distribution.</p>
<p>Wait for Deployment: Monitor the status until it changes to "Deployed".</p>

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1910" height="805" alt="Cloudfront" src="https://github.com/user-attachments/assets/67c452c4-e1f7-4d27-934a-17b2121989ed" />

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1911" height="812" alt="Cloudfront2" src="https://github.com/user-attachments/assets/a5de4111-63e5-4895-9599-5b5f7c467494" />

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1895" height="802" alt="Cloudfront3" src="https://github.com/user-attachments/assets/6b747bc7-07a5-473e-af63-fe51c368f389" />

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1913" height="415" alt="Cloudfront4" src="https://github.com/user-attachments/assets/9eff1e1d-91dd-409c-a624-5933956e3cad" />

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1913" height="657" alt="Cloudfront5" src="https://github.com/user-attachments/assets/decea32f-1a85-42e9-8e2a-a645561c1d71" />

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


<img width="1902" height="803" alt="Cloudfront6" src="https://github.com/user-attachments/assets/1c3e43fa-3d91-44a9-bc81-d5d6f15c8b76" />

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Phase 6: CREATE  Application Load Balancer
<a name="AmazonALB"></a>

<p>1.Open EC2 Dashboard: Search for and select EC2.</p>
<p>2.Navigate to Load Balancers: In the left sidebar, click on Load Balancers under Load Balancing.</p>
<p>3.Create Load Balancer: Click Create Load Balancer and select Application Load Balancer.</p>
<p>4.Configure Basic Settings:</p>
<p>5.Enter a name for the load balancer.</p>
<p>6.Choose the scheme (Internet-facing or Internal).</p>
<p>7.Select the IP address type (IPv4 or Dualstack).</p>
<p>8.Configure Listeners and Availability Zones:</p>
<p>9.Set up listeners (default is HTTP on port 80, And port mapping your container).</p>
<p>10.Select a VPC and subnet(s) for availability zones.</p>
<p>11.Configure Security Groups: Choose or create a security group that allows inbound traffic on your listener ports.</p>
<p>14.Configure Routing:</p>
<p>15.Create a target group and specify its name, target type, and health check settings.</p>
<p>16.Register targets (EC2 instances) in the target group.</p>
<p>17.Review and Create: Review your settings and click Create Load Balancer.</p>

Monitor: Once created, monitor the ALB from the Load Balancers section and test it using the provided DNS name.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1905" height="762" alt="ALB-TG" src="https://github.com/user-attachments/assets/6bf96f1c-7d91-4799-a379-f6c2438a45c8" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1897" height="763" alt="ALB-TG2" src="https://github.com/user-attachments/assets/adbf4974-d6d3-4e0b-bffe-f18e44206c19" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1903" height="761" alt="ALB-TG3" src="https://github.com/user-attachments/assets/dbbfa6d5-70e4-4aa7-926d-c8b34bdbc23b" />

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<img width="1892" height="755" alt="AddListener-ALB" src="https://github.com/user-attachments/assets/fb2fdaa5-07ff-4ff1-97cc-4dafc7178c61" />

<img width="1905" height="763" alt="AddACMCert-toALB" src="https://github.com/user-attachments/assets/3f62ff60-2a45-44fe-968a-cfd5888dbe52" />


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Phase 7: Request a Certicficate with ACM
<a name="RequestACertficate"></a>

l had already requested my Certificate but, to request a Certificate you need to have a domain and then follow the steps on the Amazon ACM page to get a certificate it takes 5 - 10 minutes to get your certificate.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1897" height="360" alt="RequestACM" src="https://github.com/user-attachments/assets/f0e0d5dc-86c9-4174-a30c-a7644814094a" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Phase 8 : Setting Up Route 53
<a name="Route53-Setup"></a>

l already have a domain in Route 53, l only have to create a record for my Amazon ALB as an Alias so that it can be reachable to the public in secure way.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1872" height="762" alt="Route53" src="https://github.com/user-attachments/assets/2b68705a-3601-469d-a9ad-945b40721120" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Phase 9 : Bonus
<a name="Bonus"></a>

**❗ IMPORTANT: How to structure Security Groups**

<p>✅ Security Group Setup (Correct Configuration)</p>
<p>You will have three SGs:</p>

| Component      | Inbound                                     | Outbound                     | Public? |
| -------------- | ------------------------------------------- | ---------------------------- | ------- |
| **ALB SG**     | 80/443 from Internet                        | App port → ECS SG            | Yes     |
| **ECS SG**     | App port from ALB SG                        | DB port → RDS SG             | No      |
| **RDS SG**     | DB port from ECS SG (+ optional SSM EC2 SG) | AWS internal                 | No      |
| **SSM EC2 SG** | None                                        | SSM Endpoints + optional RDS | No      |

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Phase 10 : Test the the whole solution
<a name="Testing"></a>

My first test was using my ALB

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1918" height="967" alt="Testing-ALB-1" src="https://github.com/user-attachments/assets/b4e95f1f-2021-4249-a213-8e57d38926bb" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The second test is using ALB which is connected to my ECS Tasks.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1877" height="990" alt="TestingALB" src="https://github.com/user-attachments/assets/8adec199-a431-4a2b-8d27-f58ca38eb8c9" />

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The third test is when l used my Route 53 Record tech-with-tanaka.com

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1887" height="966" alt="Testing-Route-53-2" src="https://github.com/user-attachments/assets/70bbfec9-e9d5-4d16-a971-9050abfb04ac" />


---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**3. Conclusion**
<a name="Conclusion"></a>

<p>-AWS WAF integration on CloudFront</p>
<p>-Multi-AZ RDS for high availability</p>
<p>-Secrets Manager for secure credential rotation </p>
<p>-Improved observability using CloudWatch dashboards and alarms </p>
<p>-ElastiCache (Redis) for session and query caching</p>



