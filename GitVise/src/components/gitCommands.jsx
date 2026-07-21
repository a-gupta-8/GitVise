export const gitCommand = {
    add: (data, stage) => {
        if (data.length === 0) {
            return { valid: false, error: "Nothing added to the tree" };
        };
        return { valid: true, treePopulated: true };
    },

    commit: (data, stage) => {
        if (!stage) {
            return { valid: false, error: "nothing to commit, working tree clean" }
        }
        if (data) {
            const hashVal = Math.random().toString(16).substring(2, 9);
            return { valid: true, hashValue: hashVal }
        }
        return { valid: false, error: "Invalid command" }
    }
}