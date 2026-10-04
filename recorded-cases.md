# Recorded Cases

Below are examples of how the assistant responds to the **exact same question** ("How does a blockchain work?") but steered differently based on the ENS name's text records.

### Question: "How does a blockchain work?"

---

### Case 1: Ana's Preferences (`anadyslexic.eth`)
- **Language**: Portuguese (`pt`)
- **Length**: Short (`short`)
- **Complexity**: Simple (`simple`)

**Response:**
> O blockchain funciona como um caderno digital público que todos podem ver, mas ninguém pode apagar. Quando alguém faz uma transação, ela é guardada num "bloco" junto com outras. Esses blocos são ligados uns aos outros formando uma corrente segura e protegida por matemática.

---

### Case 2: Bob's Preferences (`bobexpert.eth`)
- **Language**: English (`en`)
- **Length**: Long (`long`)
- **Complexity**: Expert (`expert`)

**Response:**
> A blockchain operates as a decentralized, immutable distributed ledger relying on consensus algorithms like Proof of Work or Proof of Stake to validate state transitions. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data typically structured in a Merkle tree. 
> 
> When nodes in the peer-to-peer network broadcast a new transaction, it is pooled into a mempool. Miners or validators select these transactions, verify their cryptographic signatures (e.g., ECDSA), and compute a valid block hash that meets the network's current difficulty target. Once validated, the block is appended to the chain, ensuring Byzantine fault tolerance and preventing double-spending without requiring a trusted central authority.

---

### Case 3: Default Fallback (`unconfigured.eth` or missing records)
- **Language**: English (`en`)
- **Length**: Medium (`medium`)
- **Complexity**: Standard (`standard`)

**Response:**
> A blockchain is a type of decentralized database that stores information in blocks that are linked together in a chain. Unlike traditional databases controlled by a central authority, a blockchain is maintained by a distributed network of computers (nodes).
> 
> When a new transaction occurs, it is verified by the network and added to a new block. Once the block is filled, it is cryptographically sealed and attached to the previous block, making the history of transactions permanent and highly resistant to tampering.
