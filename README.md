# WorkGraph

## What my application does
I built an app called WorkGraph. It helps you see how everything in an office is connected. Instead of just showing who the boss is, it shows who is working on what project, and what tools they are using. This makes it easy to find out how people, teams, tasks, and documents in a company link together.

## Why I chose this problem
In many offices, it is hard to find out what other people are doing. Normal tools only show who reports to whom. They don't show how the actual work happens. I wanted to fix this by drawing lines between the workers, their projects, and their tools. This helps anyone find the right person to ask when they need help.

## Why a graph database makes sense
When building this, I needed a way to store connections. In a normal database, linking people to teams to projects is very messy. 

A graph database is great for this because:
1. **It connects things directly:** It is easy to draw a path from a person to a project to a tool.
2. **It can follow long paths:** I can ask the database to find all tasks blocking my project, even if the chain is 5 steps long.
3. **It finds shortcuts:** It can quickly find the shortest path between two people who don't know each other.

## Graph Data Model
Here is how I store the data:

### Node Types (The things)
- **Person**: A worker.
- **Team**: A group of workers.
- **Project**: A big piece of work.
- **Task**: A small piece of work.
- **Technology**: Tools used to do the work.
- **Document**: Files with instructions.

### Relationship Types (The lines between things)
- `MEMBER_OF`: A person is in a team.
- `WORKS_ON`: A person does a project.
- `OWNS`: A team runs a project, or a person wrote a document.
- `HAS_TASK`: A project is made of tasks.
- `USES`: A task needs a tool.
- `DEPENDS_ON`: A task must wait for another task to finish.
- `ASSIGNED_TO`: A person is supposed to do a task.
- `DOCUMENTED_BY`: A project or tool has a help document.

### Data Model Diagram
```mermaid
graph TD;
    Person([Person<br/>name, role])
    Team([Team<br/>name])
    Project([Project<br/>name, status])
    Task([Task<br/>title, status])
    Technology([Technology<br/>name])
    Document([Document<br/>title])

    Person -- MEMBER_OF --> Team
    Person -- WORKS_ON --> Project
    Person -- OWNS --> Document
    Team -- OWNS --> Project
    Project -- HAS_TASK --> Task
    Project -- USES --> Technology
    Task -- DEPENDS_ON --> Task
    Task -- USES --> Technology
    Task -- ASSIGNED_TO --> Person
    Document -- DOCUMENTED_BY --> Document
    Project -- DOCUMENTED_BY --> Document
```

## Main Cypher queries and what they do
I used a language called Cypher to ask the database questions. Here are three examples:

### 1. Finding what is blocking a task
**What it does:** It looks to see if a task is waiting for another task. Then it checks if that second task is waiting for a third task, up to 5 times.
```cypher
MATCH path = (t:Task {id: $id})-[:DEPENDS_ON*1..5]-(blocker:Task)
RETURN DISTINCT blocker, labels(blocker) AS types
```

### 2. Finding an entire team
**What it does:** It starts from a project, finds which team runs it, and then lists all the people in that team.
```cypher
MATCH (proj:Project {id: $id})<-[:OWNS]-(team:Team)<-[:MEMBER_OF]-(person:Person)
RETURN DISTINCT person, labels(person) AS types
```

### 3. Finding the shortest path
**What it does:** It finds the fastest way to connect any two things in the company, using up to 10 connections.
```cypher
MATCH (a {id: $from}), (b {id: $to}),
      path = shortestPath((a)-[*..10]-(b))
RETURN nodes(path) AS nodes, relationships(path) AS rels
```

## How to create the CognoDB database
1. Go to [console.cognodb.com](https://console.cognodb.com/).
2. Make a free (c0) database.
3. Wait for it to be ready.
4. Save the `bolt+s://` URL and the password for the `cognodb` user.

## How to run the project locally

### What you need
- Node.js installed on your computer.
- Your CognoDB connection details from earlier.

### Backend Setup
1. Open a terminal and go to the `backend` folder:
   ```bash
   cd backend
   npm install
   ```
2. Copy `.env.example` to a new file named `.env` and put your database details in it:
   ```env
   NEO4J_URI=bolt+s://<instance-id>.databases.cognodb.cloud
   NEO4J_USER=cognodb
   NEO4J_PASSWORD=<your-generated-password>
   PORT=3001
   ```
3. **Fill the database** with fake practice data:
   ```bash
   npm run seed
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and go to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your web browser to see it.
