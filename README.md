<div align="center">
<img src="assets/banner.png" alt="Appwrite Docs MCP Server" width="700" />
</div>

# Appwrite Docs MCP Server
This MCP server is a tool that allows IDEs (Cursor, Windsurf, Claude Code, etc.) to utilize the Appwrite documentation.

## Setting up

Before setting up, make sure you have Bun installed.

Then, install the dependencies:
```bash
bun install
```

Check out the [.env.example](.env.example) file for the environment variables you need to set.

### Running Locally (Without Docker)

### Initialization
There are three processes involved in setting up the MCP server, to ensure we have the most up-to-date documentation available.

- **Downloading content:** This script downloads the documentation to `./content` and generates a table of contents JSON file.
- **Initializing vector store:** This script initializes the vector (PgVector) store with the documentation and relevant metadata.

Simply run the following command to initialize the MCP server:
```bash
bun run prepare
```

### Building and running the MCP server
First, build the server:
```bash
bun run build
```

Then, start the MCP server:
```bash
bun run start
```

The server should, by default, be available at `http://localhost:1234`.

## Setting up with Docker
Run the following command to build the Docker image:
```bash
bun run prepare
docker compose build
docker compose up
```

## Usage

### Inspect via the MCP Inspector
Simply run the following command to inspect the MCP server:
```bash
bun run mcp-inspect
```

A web browser tab will open up with the inspector interface.

<div align="center">
<img src="assets/inspector.png" alt="MCP Inspector" width="700" />
</div>


## Use in your IDE (Cursor, Windsurf, Claude Code, etc.)
Here is a sample configuration file:

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "appwrite-docs-mcp": {
      "transport": "http",
      "url": "http://localhost:1234"
    }
  }
}
```

The same configuration applies to any standard MCP client (Windsurf, Cursor, Claude, Claude Code, etc.).




