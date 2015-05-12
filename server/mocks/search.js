module.exports = function(app) {
  var express = require('express');
  var searchRouter = express.Router();

  searchRouter.get('/', function(req, res) {
	  if(req.param('query') === 'nothing') {
		  res.send({ search: [] });
	  } else {
		  res.send({
			  'search': [
				  {
					  name: "test 1",
					  type: "test",
					  data: {
						  id: 1000
					  }
				  }, {
					  name: "test 2",
					  type: "test",
					  data: {
						  id: 1001
					  }
				  }, {
					  name: "test 3",
					  type: "test",
					  data: {
						  id: 1003
					  }
				  }
			  ]
		  });
	  }
  });

  searchRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  searchRouter.get('/:id', function(req, res) {
    res.send({
      'search': {
        id: req.params.id
      }
    });
  });

  searchRouter.put('/:id', function(req, res) {
    res.send({
      'search': {
        id: req.params.id
      }
    });
  });

  searchRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/search', searchRouter);
};
