const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors'); // Import the CORS middleware

// Enable CORS for all routes
server.use(cors());

// Add custom route to search CAs by name
server.get('/search/:name', (req, res) => {
  const searchTerm = req.params.name;
  const db = router.db.getState();
  const caData = db.caData.filter((ca) =>
    ca.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  res.status(200).send(caData[0]);
});
server.get('/searchAll', (req, res) => {
  const db = router.db.getState();
  const caData=[]
  db.caData.map((e)=>
    caData.push(e.name)
  )
  res.json(caData);
});

server.use(middlewares);
server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
