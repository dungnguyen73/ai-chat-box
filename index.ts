import concurrently from 'concurrently';

concurrently([
    {
        command: "bun run dev",
        name: "client",
        cwd: "packages/client",
        env: {
            PORT: "5173"
        },
        prefixColor: 'green'
    },
    {
        command: "bun run dev",
        name: "server",
        cwd: "packages/server",
        env: {
            PORT: "3000"
        },
        prefixColor: 'cyan'
    }
])