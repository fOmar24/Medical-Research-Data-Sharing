# MedChain: Decentralized Medical Research Data Sharing



MedChain is a decentralized platform for secure, private, and controlled sharing of medical research data using Sui blockchain technology and Zero-Knowledge Proofs.

## 🌟 Features

- **Decentralized Data Ownership**: Researchers maintain full control over their data assets
- **Privacy-Preserving Access**: Zero-Knowledge Proofs protect sensitive information during verification
- **Granular Access Control**: Grant and revoke access to specific researchers with detailed permissions
- **Immutable Audit Trail**: Blockchain-based tracking of all access and modifications for compliance
- **End-to-End Encryption**: AES-256 encryption for all stored data
- **Decentralized Storage**: Integration with Walrus decentralized storage network

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Components**: Tailwind CSS, shadcn/ui
- **Blockchain**: Sui blockchain
- **Storage**: Walrus decentralized storage
- **Authentication**: Wallet-based authentication
- **Database**: PostgreSQL (for metadata and access control)
- **Security**: Zero-Knowledge Proofs, AES-256 encryption

## 📋 Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- Sui wallet (Sui Wallet, Ethos Wallet, etc.)
- Access to Sui blockchain (mainnet, testnet, or devnet)
- Walrus API key (or mock implementation for development)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/medchain.git
   cd medchain
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/medchain
   
   # Sui blockchain
   SUI_RPC_URL=https://sui-testnet.mystenlabs.com
   SUI_NETWORK=testnet
   
   # Walrus storage
   WALRUS_API_KEY=your_walrus_api_key
   WALRUS_ENDPOINT=https://api.walrus-storage.network
   \`\`\`

4. Initialize the database:
   \`\`\`bash
   npm run db:init
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://username:password@localhost:5432/medchain` |
| `SUI_RPC_URL` | Sui blockchain RPC endpoint | `https://sui-testnet.mystenlabs.com` |
| `SUI_NETWORK` | Sui network (mainnet, testnet, devnet) | `testnet` |
| `WALRUS_API_KEY` | API key for Walrus storage | `your_walrus_api_key` |
| `WALRUS_ENDPOINT` | Endpoint for Walrus storage API | `https://api.walrus-storage.network` |

## 📱 Usage

### Connecting Your Wallet

1. Click on "Connect Wallet" in the sidebar or header
2. Select your preferred Sui wallet
3. Approve the connection request in your wallet
4. Authenticate to access the platform features

### Registering Research Data

1. Navigate to the "Register Data" page
2. Fill in the dataset metadata (title, description, data type, etc.)
3. Upload your research data files
4. Configure encryption settings
5. Submit the transaction to register your data on the blockchain

### Managing Access Control

1. Navigate to the "Access Control" page
2. Select a dataset you own
3. Grant access to specific researchers by wallet address
4. Set access levels and expiration dates
5. Monitor access requests and usage

### Viewing Audit Trail

1. Navigate to the "Audit Trail" page
2. View a complete history of data access and modifications
3. Filter by dataset, user, or action type
4. Export audit logs for compliance reporting

## 🏗️ Architecture

MedChain follows a layered architecture:

1. **Presentation Layer**: Next.js frontend with React components
2. **Application Layer**: API routes and server actions
3. **Domain Layer**: Business logic and service implementations
4. **Infrastructure Layer**: Database, blockchain, and storage integrations

### Key Components

- **Wallet Integration**: Connects to Sui wallets for authentication and transactions
- **Blockchain Client**: Interacts with the Sui blockchain for data registration and verification
- **Storage Client**: Manages encrypted data storage on the Walrus network
- **Access Control**: Enforces permissions and manages access grants
- **Audit System**: Tracks all actions for compliance and transparency

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Sui Blockchain](https://sui.io/)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Walrus Storage Network](https://walrus-storage.network/)

## 📞 Contact

For questions or support, please contact us farhiyaomar24@gmail.com or open an issue on GitHub.
