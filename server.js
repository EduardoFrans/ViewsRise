const puppeteer = require('puppeteer');

const myDBConnectionClient = require('./dbconnection');
const fs = require('fs');
var dt = require('./public/Date')
//const loginfile = require('./public/login.js');
const express = require('express')
const app = express()
const cors = require("cors")
const dotenv = require("dotenv")
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const path = require('path')

const bcrypt = require('bcryptjs')
const { addUser, getUsers } = require("./controllers/user")
const { link } = require("fs")
const { log, Console } = require("console");
const db = require('./db');
const { message } = require('statuses');
var login




//const router = express.Router()

/*const SocialBlade = require("socialblade");
SOCIALBLADE_CLIENT_ID="cli_25f0982c231a415c9d55e2da"
SOCIALBLADE_ACCESS_TOKEN= "85775e648c011f76b86a5991a4dc41fedc70e024c838bbfb5fec730006149e6e33288383f7c1d5b697db20aca307bc50c07b91d1d84029dc42120cbcf788d14e";
const client = new SocialBlade(SOCIALBLADE_CLIENT_ID, SOCIALBLADE_ACCESS_TOKEN);

// Get a YouTube User
client.youtube.user('gameplayrj').then(console.log);

//console.log(loginfile,"i so gut")*/
function remakeconnection() {
   myDBConnectionClient.then((connection) => {
      connection.connect((error) => {
         if (error) {
            console.log('Error connecting to MySQL database:', error);
            return;
         }

      });

   })
}



dotenv.config({ path: './.env' })

app.use(cookieParser())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
//app.set("view engine", "hbs")
app.set('views', path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('public'))
app.get('/', function (req, res) {
   myDBConnectionClient.then((connection) => {
      let query = "SELECT su_data_id FROM su_data";
      connection.query(query, function (error, data) {
         if (error) {
            throw error;
         } else {
            var result = data.map(obj => parseInt(obj.su_data_id));

            // First, we count the number of su_data_id entries
            let countQuery = `SELECT COUNT(*) AS count FROM su_data WHERE su_data_id IN (${result.join(',')})`;

            connection.query(countQuery, function (error, countData) {
               if (error) {
                  throw error;
               } else {
                  let count = countData[0].count;

                  // Render the index.ejs template with the count
                  res.render(__dirname + "/public/index.ejs", { 'count': count });
               }
            });
         }
      });
   });
});
app.get('/count', function (req, res) {
   myDBConnectionClient.then((connection) => {
      let query = "SELECT su_data_id FROM su_data";
      connection.query(query, function (error, data) {
         if (error) {
            throw error;
         } else {
            var result = data.map(obj => parseInt(obj.su_data_id));

            // First, we count the number of su_data_id entries
            let countQuery = `SELECT COUNT(*) AS count FROM su_data WHERE su_data_id IN (${result.join(',')})`;

            connection.query(countQuery, function (error, countData) {
               if (error) {
                  throw error;
               } else {
                  let count = countData[0].count;

                  // Render the index.ejs template with the count
                  res.render(__dirname + "/public/count.ejs", { 'count': count });
               }
            });
         }
      });
   });
});
app.get('/countviews', function (req, res) {
   myDBConnectionClient.then((connection) => {
      let query = "SELECT views FROM su_data";
      connection.query(query, function (error, data) {
         if (error) {
            throw error;
         } else {
            // Sum all values in the views column
            let totalViews = data.reduce((sum, row) => sum + parseInt(row.views), 0);

            // Render the countviews.ejs template with the totalViews
            res.render(__dirname + "/public/countviews.ejs", { 'count': totalViews });
         }
      });
   });
});




app.use(express.json())

app.use(cors())
app.post('/check-suburl', (request, response) => {

const suburl = request.body.suburl;

   const sql = 'SELECT COUNT(*) AS count FROM su_data WHERE suburl = ?';
   myDBConnectionClient.then((connection) => {
      connection.query(sql, [suburl], (error, results) => {

         const count = results[0].count;
   
         const suburlExists = count === 1;
   
         response.json({ suburlExists });
   
      });
     
   })
	
});
app.get('/resolve', function (req, res) {
   res.render(__dirname + "/public/index.ejs")

})
app.get("/socialUnlocks'", function (req, res) {
   res.render(__dirname + "/public/index.ejs")

})
app.get('/query', function (req, res) {
   res.render(__dirname + "/public/index.ejs")

})
app.get('/hello.world', function (req, res) {
   res.render(__dirname + "/public/index.ejs")

})

app.get('/ajax', function (req, res) {
   res.render(__dirname + "/public/index.ejs")

})
app.get('/login', function (req, res) {
   res.render(__dirname + "/public/index.ejs")

})
app.get('/dns-query', function (req, res) {
   res.render(__dirname + "/public/index.ejs")

})
app.get('/terms', (req, res) => {
   res.sendFile(__dirname + "/public/otherpages/terms.html")

})
app.use('/image-editor', express.static(path.join(__dirname, 'PhotoEditor')));

// Route to handle /PhotoEditor request
app.use('/image-editor', express.static(path.join(__dirname, '/PhotoEditor')));

// Route to serve index.html file when /PhotoEditor is accessed
app.get('/image-editor', (req, res) => {
   res.sendFile(path.join(__dirname, '../PhotoEditor', 'index.html')); // Adjusted path
});

app.get('/about-viewsrise', (req, res) => {
   res.sendFile(__dirname + "/public/otherpages/about.html")

})
app.get('/contact-viewsrise', (req, res) => {
   res.sendFile(__dirname + "/public/otherpages/contact.html")

})
app.get('/privacy-viewsrise', (req, res) => {
   res.sendFile(__dirname + "/public/otherpages/privacy.html")

})
app.get('/cookie-viewsrise', (req, res) => {
   res.sendFile(__dirname + "/public/otherpages/cookie.html")

})


/*app.get('/socialunlocks', function (req, res) {
   res.sendFile(__dirname + "/public/otherpages/socialunlocks.html")
})
/*app.get('/tags', function (req, res) {
   res.sendFile(__dirname + "/public/otherpages/tags.html")
})*/

app.get('/tiktok-tags-generator', function (req, res) {
   res.render(__dirname + "/public/otherpages/tags2.ejs")

})

app.get('/tags-generator', function (req, res) {
   res.render(__dirname + "/public/otherpages/tags.ejs")

})
app.get('/analytics', function (req, res) {
   res.render(__dirname + "/public/otherpages/analytics.ejs")

})
app.get('/analytics/site-analytics', function (req, res) {
   res.render(__dirname + "/public/otherpages/analyticsWebsite.ejs")

})
app.get('/analytics/youtube-analytics', function (req, res) {
   res.render(__dirname + "/public/otherpages/analyticsytchannels.ejs")

})

app.get('/analytics/ytchannels/:id', async function (req, res) {
   const url = 'https://vidiq.com/youtube-stats/channel/' + req.params.id;

   try {
      const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
      const page = await browser.newPage();

      await page.goto(url);
      await page.waitForTimeout(500);

      // Click on the button
    
      // Wait for some time to allow the content to load after the click
      // await page.waitForTimeout(3000);

      // Extract content of elements with the specified class
      const extractedContent = await page.$$eval('.border-vidiq-dark-400', elements => {
         return elements.map(element => element.textContent.trim());
      });

      // Output the extracted content
      const dates = [];
      const subscribers = [];
      const subscribersGained = [];
      const views = [];
      const viewsGained = [];

      // Iterate through the extractedContent
      for (let i = 0; i < extractedContent.length; i += 4) {
         // Extracting date
         dates.push(extractedContent[i]);

         // Extracting subscribers
         subscribers.push(extractedContent[i + 1]);

         // Extracting views
         views.push(parseInt(extractedContent[i + 2].replace(/,/g, ''))); // Removing commas and converting to integer

         // Extracting subscribers gained
         subscribersGained.push(extractedContent[i + 3].includes('+') ? extractedContent[i + 3].split('+')[1] : '+0');

         // Extracting views gained
         const viewsGainedValue = extractedContent[i + 2].split("+")[1]; // Corrected extraction
         viewsGained.push(viewsGainedValue ? parseInt(viewsGainedValue.replace(/,/g, '')) : 0);
      }

      // Calculate the total views gained
      const totalViewsGained = viewsGained.reduce((acc, val) => acc + val, 0);

      // Calculate the sum of the first seven views gained
      const firstSevenViewsGained = viewsGained.slice(0, 7).reduce((acc, val) => acc + val, 0);

      // Get the first views gained
      const firstViewsGained = viewsGained.slice(0, 1)[0];

      // Print the results
      res.json(totalViewsGained + "," + firstSevenViewsGained + "," + firstViewsGained + "," + subscribers[0]);
      await browser.close();
   } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching data.');
   }
   /* const { socialblade } = require('youtube-views-month01')

   async function main() {
      try {
         const response1 = await socialblade('youtube', req.params.id)

     
         res.send(response1)
        // res.render(__dirname + "/public/otherpages/analyticsYtchannels.ejs", { a: totalViewsDelta, b: lastSevenViewsDelta, c: lastViewsDelta })
      } catch (err) {
         console.error(err)
      }
   }

   main()
*/
})
app.get('/tags-generator', function (req, res) {
   res.render(__dirname + "/public/otherpages/tags.ejs")

})/*
app.get('/users/:user', function (req, res) {


   var query = `Select * from su_data where user ="${req.params.user}";`
   myDBConnectionClient.then((connection) => {
      connection.query(query, function (error, data) {

         if (error) {
            throw error;
         }
         else {
            // res.render(__dirname + "/public/su.ejs")
            res.render(__dirname + "/public/otherpages/user.ejs", {
               'a': data.map(obj => obj.title), 'b': data.map(obj => obj.views), 'c': data.map(obj => obj.date), 'd': data.map(obj => obj.suburl)

            })





         }


      })
   })
})*/

app.get('/sitemap.xml', (req, res) => {
   // Content type header
   res.header('Content-Type', 'application/xml');

   // Query the database to fetch all `suburl` entries
   const query = `SELECT suburl FROM su_data`; // Adjust this query based on your actual database structure

   myDBConnectionClient.then((connection) => {
       connection.query(query, (error, data) => {
           if (error) {
               console.error('Database query error:', error);
               res.status(500).send('Error generating sitemap');
               return;
           }

           // Start building the sitemap XML
           let xml = `
             <?xml version="1.0" encoding="UTF-8"?>
             <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
           `;

           // Static URLs
           xml += `
             <url>
                 <loc>https://viewsrise.com/</loc>
                 <lastmod>2024-04-19T16:11:37+00:00</lastmod>
                 <priority>1.00</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/tags-generator</loc>
                 <lastmod>2024-04-19T16:11:37+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/tiktok-tags-generator</loc>
                 <lastmod>2024-04-19T16:11:37+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/analytics</loc>
                 <lastmod>2024-04-19T16:11:37+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/youtube-analytics</loc>
                 <lastmod>2024-04-19T16:11:37+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/website-analytics</loc>
                 <lastmod>2024-04-19T16:11:37+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/terms</loc>
                 <lastmod>2024-04-11T16:32:01+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/privacy-viewsrise</loc>
                 <lastmod>2024-04-11T16:32:01+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/about-viewsrise</loc>
                 <lastmod>2024-04-11T16:29:31+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/contact-viewsrise</loc>
                 <lastmod>2024-04-11T16:29:31+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/cookie</loc>
                 <lastmod>2024-04-11T16:32:01+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
             <url>
                 <loc>https://viewsrise.com/image-editor</loc>
                 <lastmod>2024-04-19T16:11:37+00:00</lastmod>
                 <priority>0.80</priority>
             </url>
           `;

           // Loop through the dynamic `suburl` entries from the database and append them to the XML
           data.forEach(row => {
               xml += `
               <url>
                   <loc>https://viewsrise.com/${row.suburl}</loc>
                    <lastmod>2024-04-19T16:11:37+00:00</lastmod>
                   <priority>0.80</priority>
               </url>
               `;
           });

           // Close the XML structure
           xml += `</urlset>`;

           // Send the XML response
           res.send(xml);
       });
   }).catch(err => {
       console.error('Database connection error:', err);
       res.status(500).send('Error connecting to database');
   });
});


app.get('/:suburl', function (req, res) {

   var query = `SELECT su_data_id from su_data where suburl = "${req.params.suburl}";`

   myDBConnectionClient.then((connection) => {
      connection.query(query, function (error, data) {

         if (error) {
            throw error;
         }
         else {

            var result = data.map(obj => parseInt(obj.su_data_id));


            query = `SELECT * from su_data where su_data_id ="${result}"`
            myDBConnectionClient.then((connection) => {
               connection.query(query, function (error, data) {

                  if (error) {
                     throw error;
                  }
                  else {
                     if (data.map(obj => obj.title) == '') {
                     res.render(__dirname + "/public/index.ejs")
                     }
                     else { // res.render(__dirname + "/public/su.ejs")
                        res.render(__dirname + "/public/su.ejs", {
                           'a': data.map(obj => obj.title), 'b': data.map(obj => obj.url_destiny), 'c': data.map(obj => obj.the_dropdown), 'd': data.map(obj => obj.the_dropdown2)
                           , 'e': data.map(obj => obj.url_event), 'f': data.map(obj => obj.url_event2), 'g': data.map(obj => obj.suburl),'h': data.map(obj => obj.views)
                        })

                     }

                     var query = `UPDATE su_data SET views = views + 1  where suburl = "${req.params.suburl}";`
                     myDBConnectionClient.then((connection) => {
                        connection.query(query, function (error, data) {

                           if (error) {
                              throw error;
                           }
                           else {

                           }


                        })

                     })


                  }


               })
            })

            // res.render(__dirname + "/public/su.ejs")

         }

      })
   })
   /*  query = "select suburl from su_data"
     myDBConnectionClient.then((connection) => {
        connection.query(query, function (error, data) {
  
           if (error) {
              throw error;
           }
           else {
  
  
           if(req.params.suburl== data){
           res.status(404).send('404')}
  
           }
  
  console.log()
        })
     })*/
})

app.get('*', function (req, res) {
  res.render(__dirname + "/public/index.ejs")
})
/*app.post('/login', function (req, res) {
   const { Password, Email } = req.body
   myDBConnectionClient.then((connection) => {
      connection.query('SELECT * FROM users WHERE user_email =?', [Email], (error, results) => {

         if (error) {
            throw error;
         }
         if (results.length > 0) {
            bcrypt.compare(Password.toString(), results[0].user_pwd.toString(), (err, response) => {
               if (err) return console.log(err)
               if (response) {
                  login = true
                  return res.render('login.hbs', {

                     message: 'Welcome ' + results[0].user_name

                  })
               } else {

                  return res.render('login.hbs', {

                     message: 'Wrong Email or Password'

                  })
               }
            })
         }


      })

   })

})*/
app.post('/tags-generator', function (req, res) {

   res.redirect('/tags-generator');
})
//continuar essa parte
app.post('/analytics/site-analytics', function (req, res) {

   res.redirect('/analytics/site-analytics');
})
app.post('/analytics/channels', function (req, res) {

   res.redirect('/analytics/channels');
})
/*app.post('/register', function (req, res) {
   const { Name, Email, Password, confirmPassword } = req.body
   myDBConnectionClient.then((connection) => {
      connection.query('SELECT user_email FROM users WHERE user_email =?', [Email], async (error, results) => {

         if (error) {
            throw error;
         }
         if (results.length > 0) {
            return res.render('register.hbs', {
               message: 'Email already in use'
            })
         }

         else if (Password !== confirmPassword) {
            return res.render('register.hbs', { message: 'Passwords do not match' })

         }
         /*else{return res.render('register.hbs', {
            message: 'yes'
         })}

         let hashedPassword = await bcrypt.hash(Password, 8)
         connection.query('INSERT INTO users SET ?', { user_name: Name, user_email: Email, user_pwd: hashedPassword }, (error, results) => {
            if (error) { console.log(error) }
            else { return res.render('register.hbs', { message: 'User registered' }) }
         })
      })

   })

})*/
app.post('/:suburl', function (req, res) {
   const date = new Date();
   const formattedDate = date.toISOString().slice(0, 19).replace('T', ' '); // Format as "YYYY-MM-DD HH:MM:SS"

   const { Title, urlDestiny, theDropDown, theDropDown2, urlEvent, urlEvent2 } = req.body;

   // Check if any of the required fields are undefined
   if (!Title && !urlDestiny && !theDropDown && !theDropDown2 && !urlEvent && !urlEvent2) {
       // If any field is missing, respond with an error message and stop the process
       return res.status(400).send("Error: All fields are required.");
   }
   res.render(__dirname + "/public/su.ejs", {
      'a': req.body.Title, 'b': req.body.urlDestiny, 'c': req.body.theDropDown, 'd': req.body.theDropDown2
      , 'e': req.body.urlEvent, 'f': req.body.urlEvent2, 'g': req.body.suburl,'h': 0,
   })

   var query = `
	INSERT INTO su_data 
	(title,url_destiny,the_dropdown,the_dropdown2,url_event,url_event2,suburl,date,views) 
	VALUES ("${req.body.Title}", "${req.body.urlDestiny}", "${req.body.theDropDown}", "${req.body.theDropDown2}", "${req.body.urlEvent}", "${req.body.urlEvent2}", "${req.params.suburl}", "${formattedDate}","${0}")
	`;
   myDBConnectionClient.then((connection) => {
      connection.query(query, function (error, data) {

         if (error) {
            throw error;
         }
         else {

            // res.redirect('/socialUnlocks/'+ req.params.suburl);
         }


      })

   })

})


app.listen(8080, () => {

   console.log('Server up at 8080')
})