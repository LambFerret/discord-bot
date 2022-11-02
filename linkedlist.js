class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.first = null;
    this.last = null;
  }

  // 끝부분에 추가
  append(newValue) {
    const newNode = new Node(newValue);

    // 끝부분에 추가하는 로직이라서
    // last는 새로 생성된 노드를 바라본다.
    this.last = newNode;
    if (this.first === null) {
      this.first = newNode;
    } else {
      this.last.next = newNode;
    }
  }

  // 중간에 추가
  insert(node, newValue) {
    // 파라미터로 받은 node 다음에 추가
    const newNode = new Node(newValue);
    newNode.next = node.next;
    node.next = newNode;
  }

  // 삭제
  remove(value) {
    let prevNode = this.head;
    while (prevNode.next.value !== value) {
      // 요소의 값과 삭제할 값이 같을 때 까지 검색
      prevNode = prevNode.next;
    }

    if (prevNode.next !== null) {
      // 삭제 할 요소의 이전 요소의 다음을
      // 이전 요소의 다음 다음 요소를 연결한다.
      // 삭제 할 요소는 연결이 되지 않아
      // 가비지 컬렉션이 지워버린다.
      prevNode.next = prevNode.next.next;
    }
  }

  // 검색
  find(value) {
    let currentNode = this.head;
    while (currentNode.value !== value) {
      currentNode = currentNode.next;
    }
    return currentNode;
  }
}

const a = new LinkedList
a.append(1)
a.append(2)
a.append(3)
a.append(4)
a.append(5)

console.log(a[1]);