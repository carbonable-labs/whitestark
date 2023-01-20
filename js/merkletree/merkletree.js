// intial proposition: https://github.com/Astraly-Labs/astraly-contracts/blob/main/tests/test_lottery_tickets.py

const starknet = require("starknet");

const merkletree = {

    getNextLevel(level) {
        nextLevel = [];
        for (let i = 0; i < level.length; i += 2) {
            let node;
            if (Number(level[i]) <= Number(level[i + 1])) {
                node = this.hashFn([level[i], level[i + 1]]);
            } else {
                node = this.hashFn([level[i + 1], level[i]]);
            }
            nextLevel.push(node);
        }
        return nextLevel;
    },

    generateProofHelper(level, index, proof) {
        if (level.length === 1) {
            return proof;
        }
        if (level.length % 2) {
            level.push(0);
        }

        let indexParent;
        for (let i = 0; i < level.length; i++) {
            if (i === index) {
                indexParent = Math.floor(i / 2);
                if (i % 2) {
                    proof.push(level[index - 1])
                } else {
                    proof.push(level[index + 1])
                }
            }
        }

        const nextLevel = this.getNextLevel(level);
        return this.generateProofHelper(nextLevel, indexParent, proof);
    },

    generateMerkleProof(values, index) {
        return this.generateProofHelper(values, index, []);
    },

    generateMerkleRoot(values) {
        if (values.length === 1) {
            return values[0];
        }
        if (values.length % 2) {
            values.push(0);
        }
        nextLevel = this.getNextLevel(values);
        return this.generateMerkleRoot(nextLevel);
    },

    verifyMerkleProof(leaf, proof, root) {
        let curr = leaf;

        for (const proof_elem of proof) {
            if (Number(curr) <= Number(proof_elem)) {
                curr = this.hashFn([curr, proof_elem]);
            } else {
                curr = this.hashFn([proof_elem, curr]);
            }
        }

        return curr === root;
    },

    getLeaf(address, quantity) {
        return this.hashFn([address, quantity])
    },

    getLeaves(data) {
        values = [];
        for (const row of data) {
            const address = this.hexToBn(row.address);
            leaf = this.getLeaf(address, row.quantity);

            values.push({
                "leaf": leaf,
                "address_bn": address,
                "address": row.address,
                "quantity": row.quantity,
            });
        }

        if (values.length % 2) {
            values.push({
                "leaf": 0,
                "address_bn": 0,
                "address": 0,
                "quantity": 0,
            });
        }

        return values;
    },

    hexToBn(hex) {
        const bn = starknet.number.toBN(hex.replace('0x', ''), 16);
        return bn.toString();
    },

    hashFn(inputs) {
        return this.hexToBn(starknet.hash.pedersen(inputs));
    },
};

module.exports = merkletree;