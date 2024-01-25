async function getalluser() {
    try {
      const Response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await Response.json();
      console.log(data);
    } catch (error) {
      console.log('e:', error);
    }
  }
  
  getalluser();