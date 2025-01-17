# advkr-io

advkr-io is a simple and lightweight URL shortener built using the Deno Fresh
framework and Deno KV. This project aims to provide a cost-effective solution
for URL shortening while offering additional features such as QR code
generation.

## Features

- **URL Shortening**: Easily shorten long URLs.
- **QR Code Generation**: Automatically generate QR codes for shortened URLs.
- **Search Functionality**: Filter and search through shortened URLs based on
  user input.
- **Lightweight**: Designed to be efficient and cost-effective in terms of
  database usage.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) (version 1.21 or later)
- [Fresh](https://fresh.deno.dev/) framework

### Installation

1. Clone the repository: \`\`\`bash git clone
   https://github.com/crowlsyong/advrk-io.git cd advkr-io \`\`\`

2. Start the development server: \`\`\`bash deno task start \`\`\`

### Deployment

This project uses Deno Deploy and Cloudflare for deployment. Follow these steps
to set it up:

1. Deploy the project on [dash.deno.dev](https://dash.deno.dev/).
2. In the project deployment settings on dash.deno.dev, get the DNS information
   from the domain area.
3. Configure your DNS to use custom settings and update it with the DNS info
   obtained from dash.deno.dev.

### Project Structure

- **components**: Contains reusable Preact components.
- **islands**: Contains interactive Preact components that need hydration.
- **routes**: Defines the application's routing and API endpoints.
- **static**: Contains static assets such as images and styles.
- **dev.ts**: Development server configuration file.
- **fresh.gen.ts**: Generated file by the Fresh framework.
- **import_map.json**: Manages import mappings for dependencies.
- **main.ts**: Main entry point of the application.

### Usage

1. Open your browser and navigate to \`http://localhost:8000\`.
2. Enter a long URL to shorten it.
3. Use the provided short URL or the generated QR code.

### Search Functionality

To search for a specific URL, use the search bar on the main page. The search
functionality filters the list of shortened URLs based on the input provided.

### Deno KV

This project leverages Deno KV for efficient and cost-effective data storage.
Special thanks to the To-Do list example that helped inspire and kickstart this
project.

### Continuous Integration

This project uses GitHub Actions for continuous integration. A build step is
included in the GitHub Actions workflow to ensure that the project is built and
tested before deployment.

### Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (\`git checkout -b feature/YourFeature\`).
3. Make your changes.
4. Commit your changes (\`git commit -m 'Add some feature'\`).
5. Push to the branch (\`git push origin feature/YourFeature\`).
6. Open a pull request.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.

### Acknowledgments

- [Deno](https://deno.land/)
- [Fresh](https://fresh.deno.dev/)
- [Preact](https://preactjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
