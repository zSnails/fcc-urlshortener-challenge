require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;

let urls = new Map();


app.use(bodyParser());
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.use(function(req, _, next) {
    console.log(req.body, req.params, req.query, req.path);

    next();
})
app.get('/', function(_, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// dns.lookup()
//

app.get('/api/shorturl/:id/', function(req, res) {
    const { id } = req.params;
    
    let url = urls.get(id);

    if (!url) return res.json({ error: 'Unknown id' });

    res.status(301).redirect(url);
});
app.post('/api/shorturl', function(req, res) {
    const { url } = req.body;
    let regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g
    dns.lookup(url.split('/')[2], function(err, _, _) {
        console.log(url.split('/'));
        if ((err || !regex.test(url)) && !url.includes("localhost")) {
            return res.json({ error: 'Invalid url' });
        }
        
        let url_id = urls.size;

        urls.set(url_id.toString(), url);
        return res.json({ original_url: url, short_url: url_id });
    });
});

// app.post('/api/shorturl', function(req, res) {
//     const { url } = req.body;

//     dns.lookup(url.split('//')[1], function(err, _, _) {
//         console.log()
//         if (err || !(/(https|http)\:\/\/[a-zA-Z]+\.[a-zA-Z]+/g.test(url))) {
//             return res.json({ error: 'Invalid url' });
//         }
        
        
//         let url_id = urls.size;

//         urls.set(url_id.toString(), url);
//         console.log(urls);
//         res.json({ original_url: url, short_url: url_id });
//     });
// });
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
