# WorkGraph

**WorkGraph** is a full-stack web application backed by **CognoDB** (a managed graph database supporting openCypher) that visualizes an organization's internal structure. It maps people, teams, projects, tasks, technologies, and documents to help users navigate complex dependencies that traditional organizational charts miss.

---

## 1. Why a graph database?

Organisational data is inherently a network of relationships. In a relational database (SQL), modeling "Who is working on the project that depends on the task blocked by the team using React?" requires brittle, complex `JOIN` operations across multiple junction tables (`ProjectTeam`, `TeamMember`, `TaskDependency`, etc.). 

A graph database is the perfect fit for this use case because:
1. **Relationships are First-Class Citizens**: We can natively traverse paths like `(Person)-[:WORKS_ON]->(Project)-[:USES]->(Technology)`.
2. **Variable-Depth Traversals**: Some queries, such as "Find all blocking dependencies up to 5 levels deep," require recursive CTEs in SQL which are slow and hard to maintain. Cypher solves this trivially with `[:DEPENDS_ON*1..5]`.
3. **Shortest Paths**: Discovering how any two isolated employees or projects are connected (e.g., to find an introduction or shared context) is a natural graph traversal that is awkward and computationally expensive in traditional RDBMS environments.

## 2. Data Model Diagram

Our data model maps the key components of an organizational ecosystem.

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

## 3. Notable Graph Queries

All queries are parameterized via the official Neo4j JavaScript Driver to prevent injection. 

### Multi-Hop Variable-Depth Traversal
Finding a chain of blocking tasks up to a depth of 5 (Awkward recursive CTE in SQL vs. simple traversal in Cypher):
```cypher
MATCH path = (t:Task {id: $id})-[:DEPENDS_ON*1..5]-(blocker:Task)
RETURN DISTINCT blocker, labels(blocker) AS types
```

### Complex Cross-Team Context
Finding all individuals that belong to a team that owns a specific project (multi-hop traversal):
```cypher
MATCH (proj:Project {id: $id})<-[:OWNS]-(team:Team)<-[:MEMBER_OF]-(person:Person)
RETURN DISTINCT person, labels(person) AS types
```

### Shortest Path Algorithm
Finding the shortest sequence of relationships connecting any two items in the organization:
```cypher
MATCH (a {id: $from}), (b {id: $to}),
      path = shortestPath((a)-[*..10]-(b))
RETURN nodes(path) AS nodes, relationships(path) AS rels
```

## 4. Setup and Run Instructions

### Prerequisites
- Node.js (v16+)
- A [CognoDB Cloud](https://console.cognodb.com/) account (free tier is sufficient). 

### Setup CognoDB
1. Sign up/log in to [console.cognodb.com](https://console.cognodb.com/).
2. Create a free (c0) instance.
3. Once provisioned, note the `bolt+s://` URI and the generated password for the `cognodb` user.

### Backend Setup & Data Seeding
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your CognoDB connection details:
   ```env
   NEO4J_URI=bolt+s://<instance-id>.databases.cognodb.cloud
   NEO4J_USER=cognodb
   NEO4J_PASSWORD=<your-generated-password>
   PORT=3001
   ```
3. **Seed the database** with realistic dummy data:
   ```bash
   npm run seed
   ```
4. Start the backend DEV server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## 5. UI/UX Highlights
- **PathFinder**: A visual tool for exploring the shortest path between any two disconnected entities.
- **Graph Inspector**: Uses interactive SVG map visualizations to explore direct relationships dynamically. 
- **Graceful error handling**: Complete with empty, loading, and connection-error UI states if the database is unreachable.
- **Responsive & Accessible**: Clean navigation, polished typography, and full scroll-snap immersion.

