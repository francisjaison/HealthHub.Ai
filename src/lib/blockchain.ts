import { toast } from "@/hooks/use-toast";

// Interface for blockchain transaction response
interface BlockchainTransaction {
  transactionId: string;
  timestamp: number;
  blockNumber?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

// Interface for health record data to be stored on blockchain
export interface BlockchainHealthRecord {
  id: string;
  patientId: string;
  recordType: string;
  dataHash: string;
  metadata: {
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    uploadDate: string;
    category: string;
    description?: string;
  };
  permissions: string[];
  lastModified: string;
}

// Mock blockchain node connection (in a real app, this would connect to a real blockchain node)
class BlockchainService {
  private static instance: BlockchainService;
  private isConnected: boolean = false;
  private pendingTransactions: Map<string, BlockchainTransaction> = new Map();
  private storedRecords: Map<string, BlockchainHealthRecord> = new Map();
  
  // Simulate blockchain network status
  private networkLatency: number = 800; // ms
  private failureRate: number = 0.05; // 5% chance of transaction failure
  
  private constructor() {
    // Initialize connection to blockchain in constructor
    this.connectToBlockchain();
    
    // In a real app, we would establish WebSocket connection to nodes here
    console.log("BlockchainService: Initializing blockchain connection...");
  }
  
  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }
  
  private async connectToBlockchain(): Promise<void> {
    // Simulate connection to blockchain network
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        console.log("BlockchainService: Connected to blockchain network");
        resolve();
      }, 1000);
    });
  }
  
  public async storeRecord(record: BlockchainHealthRecord): Promise<BlockchainTransaction> {
    if (!this.isConnected) {
      await this.connectToBlockchain();
    }
    
    // Simulate blockchain transaction
    return new Promise((resolve, reject) => {
      console.log("BlockchainService: Initiating transaction to store record:", record.id);
      
      // Generate a random transaction ID
      const txId = `tx_${Math.random().toString(36).substring(2, 15)}`;
      
      // Create pending transaction
      const transaction: BlockchainTransaction = {
        transactionId: txId,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      // Store pending transaction
      this.pendingTransactions.set(txId, transaction);
      
      // Simulate network delay and blockchain confirmation
      setTimeout(() => {
        // Simulate potential transaction failure
        if (Math.random() < this.failureRate) {
          transaction.status = 'failed';
          console.error("BlockchainService: Transaction failed:", txId);
          reject(new Error("Blockchain transaction failed. Please try again."));
          return;
        }
        
        // Simulate successful transaction
        transaction.status = 'confirmed';
        transaction.blockNumber = Math.floor(Math.random() * 10000000);
        
        // Store the record in our simulated blockchain
        this.storedRecords.set(record.id, record);
        
        console.log("BlockchainService: Transaction confirmed:", txId, "Block:", transaction.blockNumber);
        resolve(transaction);
      }, this.networkLatency);
    });
  }
  
  public async retrieveRecord(recordId: string): Promise<BlockchainHealthRecord> {
    if (!this.isConnected) {
      await this.connectToBlockchain();
    }
    
    // Simulate blockchain data retrieval
    return new Promise((resolve, reject) => {
      console.log("BlockchainService: Retrieving record:", recordId);
      
      setTimeout(() => {
        const record = this.storedRecords.get(recordId);
        
        if (!record) {
          console.error("BlockchainService: Record not found:", recordId);
          reject(new Error("Record not found on blockchain"));
          return;
        }
        
        console.log("BlockchainService: Record retrieved successfully:", recordId);
        resolve(record);
      }, this.networkLatency * 0.5); // Retrieval is usually faster than writing
    });
  }
  
  public async getTransactionStatus(txId: string): Promise<BlockchainTransaction | null> {
    const transaction = this.pendingTransactions.get(txId);
    return transaction || null;
  }
  
  // Generate a secure hash for a document (in a real app, this would use a proper hashing algorithm)
  public generateHash(data: any): string {
    // This is a simplified mock implementation
    // In a real app, we would use a proper cryptographic hash function
    const jsonStr = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  }
}

// Export singleton instance
export const blockchainService = BlockchainService.getInstance();

// Helper function to store a health record on blockchain
export const storeHealthRecordOnBlockchain = async (
  patientId: string,
  recordType: string,
  fileData: {
    fileName: string;
    fileType: string;
    fileSize: number;
    category: string;
    description?: string;
  }
): Promise<string> => {
  try {
    const recordId = `record_${Math.random().toString(36).substring(2, 15)}`;
    
    // Generate a hash of the file data
    const dataHash = blockchainService.generateHash({
      patientId,
      fileData,
      timestamp: Date.now()
    });
    
    // Create the blockchain record
    const blockchainRecord: BlockchainHealthRecord = {
      id: recordId,
      patientId,
      recordType,
      dataHash,
      metadata: {
        fileName: fileData.fileName,
        fileType: fileData.fileType,
        fileSize: fileData.fileSize,
        uploadDate: new Date().toISOString(),
        category: fileData.category,
        description: fileData.description
      },
      permissions: [patientId], // Initially, only the patient has access
      lastModified: new Date().toISOString()
    };
    
    // Store record on blockchain
    const transaction = await blockchainService.storeRecord(blockchainRecord);
    
    console.log("Health record stored on blockchain:", transaction.transactionId);
    return recordId;
  } catch (error) {
    console.error("Error storing health record on blockchain:", error);
    throw error;
  }
};

// Helper function to retrieve a health record from blockchain
export const getHealthRecordFromBlockchain = async (recordId: string): Promise<BlockchainHealthRecord> => {
  try {
    return await blockchainService.retrieveRecord(recordId);
  } catch (error) {
    console.error("Error retrieving health record from blockchain:", error);
    throw error;
  }
}; 