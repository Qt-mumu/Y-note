const express = require('express');

const app = express();
app.set('secret', 'adsasfafasas234345')
app.use(require('cors')());
app.use(express.json());

require('./plugins/db')(app);
require('./routes/admin')(app);

require('./plugins/db')(app)

app.listen(3001, () => {
	console.log('Y-note listen on post 3001');
})


