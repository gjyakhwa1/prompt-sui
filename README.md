# **Prompt Sui - Product Overview Document**

## **1. Product Overview**

**Prompt Sui** is a decentralized marketplace built on the Sui blockchain that enables prompt engineers to monetize their AI prompts while providing buyers with verification tools to test prompts before purchase. The platform supports both text and image prompts with cryptographic security and decentralized storage.

---

## **2. Core Features**

### **Feature Matrix**

| Feature | Description | Technical Implementation |
|---------|-------------|-------------------------|
| **Prompt Listing & Selling** | Create and list text/image prompts for sale with custom pricing | Sui smart contracts + Walrus storage |
| **Decentralized Storage** | Store large prompts and images on Walrus | Walrus Protocol (blob storage) |
| **Secure Transactions** | Purchase prompts with automatic royalty distribution | Sui Pay + Escrow smart contracts |
| **Prompt Encryption** | Protect prompt content until purchase | SEAL Protocol encryption |
| **Global Marketplace** | Browse and filter prompts by category, AI model, rating | Indexer + Search API |

---

## **3. Technology Stack**

### **Blockchain & Protocol Layer**
- **Sui Blockchain**: High-performance Move-based chain for transactions and ownership
- **Walrus Protocol**: Decentralized blob storage for image prompts and large text prompts
- **Seal Protocol**: Cryptographic sealing/unsealing of prompt content

### **Authentication & Identity**
- **Mysten Labs Wallet Kit**: Wallet connection and transaction signing

### **Frontend**
- **React**: React framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Responsive UI styling
- **Vercel**: Deployment and edge functions

### **Storage & Indexing**
- **Walrus Aggregators**: Primary storage for prompt data
