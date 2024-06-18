class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1; // Height of node is initially set to 1
  }
}

class AVLTree {
  private root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  // Helper function to get height of the node
  private height(node: TreeNode | null): number {
    return node ? node.height : 0;
  }

  // Helper function to get the balance factor of the node
  private getBalance(node: TreeNode | null): number {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  // Right rotate subtree rooted with y
  private rightRotate(y: TreeNode): TreeNode {
    const x = y.left!;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

    // Return new root
    return x;
  }

  // Left rotate subtree rooted with x
  private leftRotate(x: TreeNode): TreeNode {
    const y = x.right!;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

    // Return new root
    return y;
  }

  // Insert a node
  insert(value: number): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(node: TreeNode | null, value: number): TreeNode {
    // 1. Perform the normal BST insertion
    if (node === null) {
      return new TreeNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    } else {
      // Duplicate keys are not allowed in BST
      return node;
    }

    // 2. Update height of this ancestor node
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

    // 3. Get the balance factor of this ancestor node to check whether this node became unbalanced
    const balance = this.getBalance(node);

    // If this node becomes unbalanced, then there are 4 cases

    // Left Left Case
    if (balance > 1 && value < node.left!.value) {
      return this.rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right!.value) {
      return this.leftRotate(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left!.value) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right!.value) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    // Return the (unchanged) node pointer
    return node;
  }

  // Delete a node
  delete(value: number): void {
    this.root = this.deleteNode(this.root, value);
  }

  private deleteNode(root: TreeNode | null, value: number): TreeNode | null {
    // STEP 1: PERFORM STANDARD BST DELETE
    if (root === null) {
      return root;
    }

    if (value < root.value) {
      root.left = this.deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = this.deleteNode(root.right, value);
    } else {
      // node with only one child or no child
      if (root.left === null || root.right === null) {
        const temp = root.left ? root.left : root.right;

        // No child case
        if (temp === null) {
          root = null;
        } else {
          // One child case
          root = temp; // Copy the contents of the non-empty child
        }
      } else {
        // node with two children: Get the inorder successor (smallest in the right subtree)
        const temp = this.minValueNode(root.right);

        // Copy the inorder successor's data to this node
        root.value = temp.value;

        // Delete the inorder successor
        root.right = this.deleteNode(root.right, temp.value);
      }
    }

    // If the tree had only one node then return
    if (root === null) {
      return root;
    }

    // STEP 2: UPDATE HEIGHT OF THE CURRENT NODE
    root.height = Math.max(this.height(root.left), this.height(root.right)) + 1;

    // STEP 3: GET THE BALANCE FACTOR OF THIS NODE (to check whether this node became unbalanced)
    const balance = this.getBalance(root);

    // If this node becomes unbalanced, then there are 4 cases

    // Left Left Case
    if (balance > 1 && this.getBalance(root.left) >= 0) {
      return this.rightRotate(root);
    }

    // Left Right Case
    if (balance > 1 && this.getBalance(root.left) < 0) {
      root.left = this.leftRotate(root.left!);
      return this.rightRotate(root);
    }

    // Right Right Case
    if (balance < -1 && this.getBalance(root.right) <= 0) {
      return this.leftRotate(root);
    }

    // Right Left Case
    if (balance < -1 && this.getBalance(root.right) > 0) {
      root.right = this.rightRotate(root.right!);
      return this.leftRotate(root);
    }

    return root;
  }

  // Get node with minimum value
  private minValueNode(node: TreeNode): TreeNode {
    let current = node;

    /* loop down to find the leftmost leaf */
    while (current.left !== null) {
      current = current.left;
    }

    return current;
  }

  // Search for a value
  search(value: number): TreeNode | null {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode | null, value: number): TreeNode | null {
    // Base Cases: root is null or value is present at root
    if (node === null || node.value === value) {
      return node;
    }

    // Value is greater than root's value
    if (node.value < value) {
      return this.searchNode(node.right, value);
    }

    // Value is smaller than root's value
    return this.searchNode(node.left, value);
  }

  // In-order traversal
  inOrder(): number[] {
    const result: number[] = [];
    this.inOrderTraversal(this.root, result);
    return result;
  }

  private inOrderTraversal(node: TreeNode | null, result: number[]): void {
    if (node !== null) {
      this.inOrderTraversal(node.left, result);
      result.push(node.value);
      this.inOrderTraversal(node.right, result);
    }
  }
}

// Example usage:
const tree = new AVLTree();
tree.insert(10);
tree.insert(20);
tree.insert(30);
tree.insert(40);
tree.insert(50);
tree.insert(25);

console.log('In-order traversal of the constructed AVL tree is:');
console.log(tree.inOrder());

tree.delete(30);

console.log('In-order traversal after deletion of 30:');
console.log(tree.inOrder());

const searchResult = tree.search(25);
console.log(
  searchResult
    ? `Node with value 25 found: ${searchResult.value}`
    : 'Node with value 25 not found.'
);
